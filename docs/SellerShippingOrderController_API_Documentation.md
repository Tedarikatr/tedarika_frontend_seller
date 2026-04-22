# SellerShippingOrderController API Dokümantasyonu

Bu doküman, `API/Controllers/Shipping/SellerShippingOrderController.cs` içindeki tüm endpoint'leri, akışı, request/response örneklerini ve hata durumlarını ayrıntılı olarak anlatır. Frontend entegrasyonunda referans olarak kullanılmak üzere hazırlanmıştır.

---

## Genel Bilgiler

- **Base URL:** `/api/seller/orders/{orderId}/shipping`
- **Authentication:** Tüm endpoint'ler `[Authorize]` attribute'u ile korunur. `SellerUserContextHelper` üzerinden JWT'den `storeId` ve `sellerId` çözümlenir; başka bir satıcının siparişine erişim `404 Not Found` döner (bilerek "Not Found" gösterilir, varlık bilgisi sızdırılmaz).
- **Content-Type:** Request/response `application/json` (etiket indirme hariç, o PDF/binary döner).
- **Hata formatı:**
  ```json
  {
    "statusCode": 400,
    "message": "Kargo teklifleri alınamadı. Alıcı adresi veya sağlayıcı ayarlarını kontrol edin.",
    "errors": []
  }
  ```
- **Aktif kargo sağlayıcısı:** Geliver. Tüm provider çağrıları `IShippingProvider` üzerinden soyutlanmıştır.
- **Ortak yetki kontrolü:** Her endpoint önce `IOrderService.GetOrderSellerDetailAsync(orderId, sellerId)` çağırır. `UnauthorizedAccessException` fırlarsa endpoint `404` döner.

---

## Akış Özeti

Satıcının sipariş için kargo etiketi oluşturma süreci iki yol sunar:

### Yol A — Manuel Teklif Seçimi (gelişmiş akış)
```
[1a] POST /offers           → providerShipmentId + teklif listesi döner
[1b] GET  /offers           → teklifler asenkron geldiği için gerekirse yenile
[2]  POST /accept-offer     → seçilen teklifle etiket üretilir, satıcı borçlandırılır
[3]  GET  /label            → etiket meta bilgisi (UI'da göster)
[3]  GET  /label/download   → etiket PDF indir
```

### Yol B — Otomatik (tek tıkla, en ucuz teklifi al)
```
[2b] POST /label/auto       → en ucuz teklif otomatik kabul edilir, etiket üretilir
[3]  GET  /label            → etiket meta bilgisi
[3]  GET  /label/download   → etiket PDF indir
```

> **Not:** Önceki "order oluşturunca worker etiketi üretsin" mimarisi kaldırıldı. Artık etiket üretimi **satıcı tetiklemesi** ile senkron çalışır; ödeme tamamlanmamış siparişler için etiket üretilmez.

---

## 1a. Gönderi Oluştur ve Teklifleri Al

Sipariş için Geliver'da bir gönderi (shipment) yaratır ve kargo firmalarından teklifleri döner. **Etiket henüz satın alınmaz**; satıcı UI'dan uygun teklifi seçer.

- **Endpoint:** `POST /api/seller/orders/{orderId}/shipping/offers`
- **Method handler:** `CreateShipmentAndGetOffers`

### Request

**Path Parametre:**
- `orderId` *(int, required)* — Sipariş ID.

**Body:** `ShippingPackageDimensionsRequestDto` *(opsiyonel)*. Tamamen boş gönderilebilir. Herhangi bir alan verilmezse ürün metadatasından hesaplanan varsayılanlar kullanılır.

```json
{
  "weightKg": 1.5,
  "lengthCm": 30,
  "widthCm": 20,
  "heightCm": 10
}
```

**Parametreler:**
- `weightKg` *(decimal?)* — Ağırlık kg. Varsayılan 1 kg.
- `lengthCm` *(decimal?)* — Uzunluk cm. Varsayılan 10 cm.
- `widthCm` *(decimal?)* — Genişlik cm. Varsayılan 10 cm.
- `heightCm` *(decimal?)* — Yükseklik cm. Varsayılan 10 cm.

### Response 200 — `ShippingOffersResponseDto`

```json
{
  "providerShipmentId": "ship_01HK8N4A2F7G9K3P5Q7R9T1V2X",
  "offers": [
    {
      "id": "offer_01HK8N4B3G8H0L4M6N8P0Q2S4U",
      "providerCode": "YURTICI",
      "providerServiceCode": "STANDARD",
      "totalAmount": "54.90",
      "currency": "TRY",
      "estimatedDeliveryTime": "1-2 iş günü",
      "providerName": "Yurtiçi Kargo"
    },
    {
      "id": "offer_01HK8N4C4H9I1M5N7O9P1R3T5V",
      "providerCode": "ARAS",
      "providerServiceCode": "STANDARD",
      "totalAmount": "62.50",
      "currency": "TRY",
      "estimatedDeliveryTime": "1-3 iş günü",
      "providerName": "Aras Kargo"
    }
  ],
  "cheapestOfferId": "offer_01HK8N4B3G8H0L4M6N8P0Q2S4U",
  "fastestOfferId": "offer_01HK8N4B3G8H0L4M6N8P0Q2S4U"
}
```

**Alanlar:**
- `providerShipmentId` — Geliver shipment kimliği. **2. adımda (accept-offer) zorunludur; state olarak tutun.**
- `offers[]` — Kargo firmalarından gelen teklifler.
  - `id` — Teklif kimliği. `accept-offer` isteğinde `offerId` olarak gönderin.
  - `totalAmount` — String olarak kargo ücreti (kuruş ayırımı `.` ile). Satıcıdan tahsil edilecek rakam.
  - `providerName`, `providerCode`, `estimatedDeliveryTime` — UI'da göstermek için.
- `cheapestOfferId`, `fastestOfferId` — UI'da rozet göstermek için işaretli id'ler.

> **Önemli:** `offers` dizisi bazen boş dönebilir. Geliver teklifleri asenkron yüklediğinden, bu durumda **1b (GET /offers)** ile `providerShipmentId` üzerinden 1–3 sn aralıkla yeniden sorgulayın.

### Response 400

```json
{
  "statusCode": 400,
  "message": "Kargo teklifleri alınamadı. Alıcı adresi veya sağlayıcı ayarlarını kontrol edin."
}
```

Tipik sebepler: sipariş teslimat adresi eksik/geçersiz, Geliver `ApiToken` yok, satıcının Geliver gönderici adresi tanımlı değil, TR için geçerli plaka kodu (`cityCode`) çözümlenemedi.

### Response 404

Sipariş bu satıcıya ait değilse veya yoksa:

```json
{
  "statusCode": 404,
  "message": "Sipariş bulunamadı veya bu mağazaya ait değil."
}
```

### Frontend Örnek (Axios)

```ts
const { data } = await http.post<ShippingOffersResponseDto>(
  `/api/seller/orders/${orderId}/shipping/offers`,
  dimensions ?? {}
);
setProviderShipmentId(data.providerShipmentId);
setOffers(data.offers);
if (data.offers.length === 0) schedulePoll(data.providerShipmentId);
```

---

## 1b. Teklifleri Yenile

POST /offers boş teklif döndüğünde veya kullanıcı elle yenilemek istediğinde kullanılır. Yeni bir gönderi **oluşturmaz**, mevcut `providerShipmentId` için güncel teklifleri çeker.

- **Endpoint:** `GET /api/seller/orders/{orderId}/shipping/offers?providerShipmentId={id}`
- **Method handler:** `RefreshOffers`

### Request

**Path:** `orderId` *(int, required)*.

**Query:**
- `providerShipmentId` *(string, required)* — POST /offers yanıtından gelen değer.

### Response 200 — `ShippingOffersResponseDto`

POST /offers ile aynı şema. Tekliflerin dolu dönmesi ana hedef.

```json
{
  "providerShipmentId": "ship_01HK8N4A2F7G9K3P5Q7R9T1V2X",
  "offers": [
    {
      "id": "offer_01HK8N4B3G8H0L4M6N8P0Q2S4U",
      "providerCode": "YURTICI",
      "providerServiceCode": "STANDARD",
      "totalAmount": "54.90",
      "currency": "TRY",
      "estimatedDeliveryTime": "1-2 iş günü",
      "providerName": "Yurtiçi Kargo"
    }
  ],
  "cheapestOfferId": "offer_01HK8N4B3G8H0L4M6N8P0Q2S4U",
  "fastestOfferId": "offer_01HK8N4B3G8H0L4M6N8P0Q2S4U"
}
```

### Response 400

- `providerShipmentId` boş/eksikse:
  ```json
  {
    "statusCode": 400,
    "message": "providerShipmentId gerekli. POST /offers yanıtındaki providerShipmentId kullanın."
  }
  ```
- Sağlayıcı hatası / geçersiz id:
  ```json
  {
    "statusCode": 400,
    "message": "Teklifler alınamadı. providerShipmentId geçerli mi kontrol edin."
  }
  ```

### Response 404

```json
{
  "statusCode": 404,
  "message": "Sipariş bulunamadı veya bu mağazaya ait değil."
}
```

### Önerilen Polling Stratejisi

Teklifler Geliver tarafında ~1–5 sn içinde hazırlanır. Frontend örneği:

```ts
async function pollOffers(orderId: number, shipmentId: string, attempt = 0) {
  if (attempt >= 6) return []; // max ~12 sn
  const { data } = await http.get<ShippingOffersResponseDto>(
    `/api/seller/orders/${orderId}/shipping/offers`,
    { params: { providerShipmentId: shipmentId } }
  );
  if (data.offers.length > 0) return data.offers;
  await new Promise(r => setTimeout(r, 2000));
  return pollOffers(orderId, shipmentId, attempt + 1);
}
```

---

## 2. Seçilen Teklifi Kabul Et (Etiket Oluştur)

Satıcının UI'dan seçtiği teklifi Geliver'a kabul ettirir, etiket üretir ve satıcıyı kargo tutarı kadar borçlandırır. Bu tutar sipariş ödemesinde netleştirilir.

- **Endpoint:** `POST /api/seller/orders/{orderId}/shipping/accept-offer`
- **Method handler:** `AcceptOffer`

### Request

**Path:** `orderId` *(int, required)*.

**Body:** `AcceptShippingOfferRequestDto`

```json
{
  "providerShipmentId": "ship_01HK8N4A2F7G9K3P5Q7R9T1V2X",
  "offerId": "offer_01HK8N4B3G8H0L4M6N8P0Q2S4U",
  "acceptedOfferTotalAmount": 54.90
}
```

**Parametreler:**
- `providerShipmentId` *(string, required, max 100)* — POST /offers yanıtından.
- `offerId` *(string, required, max 100)* — Kullanıcının seçtiği teklifin `id` değeri.
- `acceptedOfferTotalAmount` *(decimal?, required UI'da)* — Seçilen teklifin `totalAmount` değeri. Satıcı borçlandırmasında kullanılır; backend ayrıca provider'dan da doğrulama yapabilir fakat UI'da net göstermek için istenir.

### Response 200 — `OrderShippingLabelDto`

```json
{
  "orderId": 54,
  "fileName": "label_54_20260420.pdf",
  "fileUrl": "https://api.geliver.io/labels/ship_01HK8N4A2F7G9K3P5Q7R9T1V2X.pdf",
  "shipmentId": "ship_01HK8N4A2F7G9K3P5Q7R9T1V2X",
  "responsiveLabelUrl": "https://api.geliver.io/labels/ship_01HK8N4A2F7G9K3P5Q7R9T1V2X_responsive.pdf",
  "trackingNumber": "1234567890TR",
  "trackingUrl": "https://track.geliver.io/1234567890TR",
  "trackingStatus": "CREATED",
  "trackingUpdatedAt": "2026-04-20T12:05:30Z",
  "contentType": "application/pdf",
  "createdAt": "2026-04-20T12:05:30Z",
  "isSkipped": false
}
```

**Önemli alanlar:**
- `fileUrl` — Satıcının indireceği/yazdıracağı etiket URL'i. Frontend'de **UI içinden `GET /label/download` tercih edin** (URL'in süresi dolabilir, proxy ile indirmek daha güvenli).
- `shipmentId` — Sonraki takip sorguları için.
- `trackingNumber` + `trackingUrl` — Satıcıya/alıcıya gösterilir.
- `trackingStatus` — Geliver'ın status kodu (`CREATED`, `PICKED_UP`, `IN_TRANSIT`, `DELIVERED`, `CANCELLED` vb.).
- `isSkipped` — Etiket üretilmemiş olsa bile idempotent bir kayıt varsa `true` olabilir. `true` ise `fileUrl` boş olur.

### Response 400

```json
{
  "statusCode": 400,
  "message": "Teklif kabul edilemedi veya etiket oluşturulamadı."
}
```

veya eksik body:

```json
{
  "statusCode": 400,
  "message": "İstek gerekli."
}
```

Tipik sebepler: `offerId` geçersiz/süresi doldu, Geliver teklif kabulü başarısız, sağlayıcı etiket URL'i dönmedi.

### Response 404

```json
{
  "statusCode": 404,
  "message": "Sipariş bulunamadı veya bu mağazaya ait değil."
}
```

### Frontend Örnek

```ts
const { data } = await http.post<OrderShippingLabelDto>(
  `/api/seller/orders/${orderId}/shipping/accept-offer`,
  {
    providerShipmentId,
    offerId: selectedOffer.id,
    acceptedOfferTotalAmount: Number(selectedOffer.totalAmount)
  }
);
showLabelView(data);
```

---

## 2b. Otomatik Etiket Oluştur (En Ucuz Teklif)

Teklif seçimi gerektirmeden, tek istekle en ucuz teklifi otomatik kabul edip etiket üretir. Önceki worker-based otomasyonun yerini alır. Önceden tamamlanmış etiket varsa yeniden üretmez, mevcut kaydı döner.

- **Endpoint:** `POST /api/seller/orders/{orderId}/shipping/label/auto`
- **Method handler:** `TriggerAutoLabel`

### Request

**Path:** `orderId` *(int, required)*.

**Body:** Yok.

### Response 201 — Yeni Etiket Üretildi

`OrderShippingLabelDto` gövdesi, `accept-offer` ile aynı şema.

```json
{
  "orderId": 54,
  "fileName": "label_54_20260420.pdf",
  "fileUrl": "https://api.geliver.io/labels/ship_01HK8N4A2F7G9K3P5Q7R9T1V2X.pdf",
  "shipmentId": "ship_01HK8N4A2F7G9K3P5Q7R9T1V2X",
  "responsiveLabelUrl": "https://api.geliver.io/labels/ship_01HK8N4A2F7G9K3P5Q7R9T1V2X_responsive.pdf",
  "trackingNumber": "1234567890TR",
  "trackingUrl": "https://track.geliver.io/1234567890TR",
  "trackingStatus": "CREATED",
  "trackingUpdatedAt": "2026-04-20T12:05:30Z",
  "contentType": "application/pdf",
  "createdAt": "2026-04-20T12:05:30Z",
  "isSkipped": false
}
```

### Response 200 — Mevcut Etiket Zaten Var (Idempotent)

Aynı şema döner; farkı `createdAt` eskiden kalmış olabilir ve istek **tekrar üretmeden** cached kaydı verir.

> **Frontend kuralı:** `201` ve `200` yanıtlarını **aynı** şekilde göster. Yeni/var ayrımı göstermek istiyorsan HTTP status kodundan ayırt et.

### Response 400

```json
{
  "statusCode": 400,
  "message": "Kargo etiketi oluşturulamadı. Gönderici adresi, teslimat adresi ve Geliver ayarlarını kontrol edin."
}
```

Tipik sebepler (`GeliverAutoLabelStatus.ProviderFailed`):
- Geliver `ApiToken` eksik veya satıcının `StoreSenderAddress` kaydı/`GeliverSenderAddressId`'si yok.
- Alıcı adresi eksik (ad, telefon, adres satırı veya şehir).
- **TR adreslerinde plaka kodu (`cityCode`) çözümlenemedi.** Artık `TurkishCityPlateCodeHelper.NormalizePlateCode` ile `CityCode` zaten plaka değilse `CityName`'den plaka türetilir; ikisi de çözülemezse request Geliver'a gitmeden durdurulur ve 400 döner.
- Geliver tarafında offer kabulü başarısız veya label URL'i boş.

### Response 404

```json
{
  "statusCode": 404,
  "message": "Sipariş bulunamadı veya bu mağazaya ait değil."
}
```

### İç Akış

```
TriggerAutoLabel(orderId)
  ├─ GetOrderSellerDetailAsync          → yetki doğrula
  └─ IGeliverLabelAutomationService.CreateOrderShippingLabelAsync
        ├─ Repo: label zaten tamamlanmış mı? (FileUrl dolu mu?)
        │     ├─ evet → AlreadyExists (200)
        │     └─ hayır → devam
        ├─ Order & store ownership doğrula
        │     └─ bulunamadı → OrderNotFound (404)
        └─ IShippingService.CreateLabelForOrderAsync (Geliver)
              ├─ başarılı → Created (201)
              └─ null → ProviderFailed (400)
```

### Frontend Örnek (React Query)

```ts
const mutation = useMutation({
  mutationFn: async (orderId: number) => {
    const res = await http.post<OrderShippingLabelDto>(
      `/api/seller/orders/${orderId}/shipping/label/auto`
    );
    return { label: res.data, created: res.status === 201 };
  },
  onSuccess: ({ label, created }) =>
    toast.success(created ? "Kargo etiketi oluşturuldu." : "Kargo etiketi zaten mevcut.")
});
```

---

## 3. Kargo Etiketini Getir (Meta Bilgi)

Mevcut etiketin JSON meta bilgisini döner. UI'da etiket bilgilerini göstermek, "PDF indir" butonunu aktifleştirmek ve takip numarasını/linkini yayımlamak için kullanılır.

- **Endpoint:** `GET /api/seller/orders/{orderId}/shipping/label`
- **Method handler:** `GetLabel`

### Request

**Path:** `orderId` *(int, required)*.

### Response 200 — `OrderShippingLabelDto`

```json
{
  "orderId": 54,
  "fileName": "label_54_20260420.pdf",
  "fileUrl": "https://api.geliver.io/labels/ship_01HK8N4A2F7G9K3P5Q7R9T1V2X.pdf",
  "shipmentId": "ship_01HK8N4A2F7G9K3P5Q7R9T1V2X",
  "responsiveLabelUrl": "https://api.geliver.io/labels/ship_01HK8N4A2F7G9K3P5Q7R9T1V2X_responsive.pdf",
  "trackingNumber": "1234567890TR",
  "trackingUrl": "https://track.geliver.io/1234567890TR",
  "trackingStatus": "IN_TRANSIT",
  "trackingUpdatedAt": "2026-04-21T09:15:00Z",
  "contentType": "application/pdf",
  "createdAt": "2026-04-20T12:05:30Z",
  "isSkipped": false
}
```

### Response 404

Henüz etiket üretilmemişse:

```json
{
  "statusCode": 404,
  "message": "Kargo etiketi bulunamadı."
}
```

> **UX önerisi:** Sipariş detay sayfası açıldığında bu endpoint'i sessizce çağır. `404` geldiğinde "Kargo etiketi oluştur" butonunu göster; `200` geldiğinde mevcut etiket + indirme butonunu göster.

---

## 3. Kargo Etiketini İndir (PDF)

Etiketin dosya içeriğini stream olarak indirir. Tarayıcıda `<a download>` ile tetiklenebilir veya programatik olarak alınıp yazdırılabilir.

- **Endpoint:** `GET /api/seller/orders/{orderId}/shipping/label/download`
- **Method handler:** `DownloadLabel`

### Request

**Path:** `orderId` *(int, required)*.

### Response 200

**Headers:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="label_54_20260420.pdf"
```

**Body:** Binary PDF akışı.

> Provider'ın dönmüş olduğu `contentType`'a göre `application/pdf` dışında ZPL/PNG de olabilir; `contentType` yoksa varsayılan `application/pdf` kullanılır.

### Response 404

```json
{
  "statusCode": 404,
  "message": "Kargo etiketi bulunamadı."
}
```

### Frontend Örnek

```ts
async function downloadLabel(orderId: number) {
  const res = await http.get(
    `/api/seller/orders/${orderId}/shipping/label/download`,
    { responseType: "blob" }
  );
  const url = URL.createObjectURL(res.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = `label_${orderId}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
```

---

## TypeScript Tip Tanımları

```ts
export interface ShippingPackageDimensionsRequestDto {
  weightKg?: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
}

export interface ShippingOfferItemDto {
  id: string;
  providerCode?: string | null;
  providerServiceCode?: string | null;
  totalAmount: string;       // "54.90"
  currency?: string | null;  // "TRY"
  estimatedDeliveryTime?: string | null;
  providerName?: string | null;
}

export interface ShippingOffersResponseDto {
  providerShipmentId: string;
  offers: ShippingOfferItemDto[];
  cheapestOfferId?: string | null;
  fastestOfferId?: string | null;
}

export interface AcceptShippingOfferRequestDto {
  providerShipmentId: string;
  offerId: string;
  acceptedOfferTotalAmount?: number;
}

export interface OrderShippingLabelDto {
  orderId: number;
  fileName: string;
  fileUrl: string;
  shipmentId?: string | null;
  responsiveLabelUrl?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  trackingStatus?: string | null;
  trackingUpdatedAt?: string | null; // ISO-8601
  contentType?: string | null;
  createdAt: string;                 // ISO-8601
  isSkipped: boolean;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  errors: string[];
}
```

---

## Durum Tablosu (HTTP Status Matrisi)

| Endpoint | 200 | 201 | 400 | 401/403 | 404 |
|---|---|---|---|---|---|
| `POST /offers` | Teklifler döndü | — | Alıcı/sağlayıcı/plaka sorunu | Auth yoksa `401` | Sipariş satıcıya ait değil |
| `GET /offers` | Teklifler yenilendi | — | providerShipmentId eksik/geçersiz | `401` | Sipariş yok/ait değil |
| `POST /accept-offer` | Etiket üretildi | — | Body eksik / teklif reddi | `401` | Sipariş yok/ait değil |
| `POST /label/auto` | Etiket zaten var | Yeni etiket | Gönderici/alıcı/Geliver sorunu | `401` | Sipariş yok/ait değil |
| `GET /label` | Etiket meta | — | — | `401` | Etiket yok |
| `GET /label/download` | PDF akış | — | — | `401` | Etiket yok |

---

## Manuel QA Senaryoları

1. **Mutlu yol — Manuel akış**
   - `POST /offers` → 200, `providerShipmentId` + dolu teklif listesi.
   - `POST /accept-offer` (en ucuz offer ile) → 200, `fileUrl` dolu.
   - `GET /label` → 200. `GET /label/download` → PDF iner.

2. **Boş teklif — Polling**
   - `POST /offers` → 200, `offers: []`.
   - 2 sn sonra `GET /offers?providerShipmentId=…` → 200, dolu liste.

3. **Mutlu yol — Auto**
   - `POST /label/auto` → 201, yeni etiket.
   - Aynı isteği tekrar at → 200, aynı etiket (re-create yok).

4. **Geçersiz sipariş**
   - Başka mağazanın siparişi ile tüm endpoint'ler → 404 "Sipariş bulunamadı veya bu mağazaya ait değil."

5. **Eksik plaka kodu (TR)**
   - `DeliveryAddress.CityCode` = "İzmir" (ad) olan eski kayıt için `POST /label/auto` → `TurkishCityPlateCodeHelper.NormalizePlateCode` "35" türetir, etiket oluşur.
   - `CityCode` ve `CityName` ikisi de çözümlenemeyen adres → 400.

6. **Geliver token yok**
   - `GeliverApiOptions.ApiToken` boş → tüm üretim endpointleri 400, log: "Geliver ApiToken eksik veya satıcı gönderici adresi tanımlı değil."

7. **Gönderici adresi yok**
   - Satıcının `StoreSenderAddress.GeliverSenderAddressId` boş → 400.

8. **Etiket yok**
   - Hiç oluşturulmamış siparişte `GET /label` → 404; `GET /label/download` → 404.

---

## Observability / Log İpuçları

- Geliver isteği göndermeden hemen önce `GeliverShippingProvider.CreateLabelAsync` bu satırı yazar:
  ```
  Geliver etiket isteği hazırlanıyor. OrderId:54 CountryCode:TR CityCode:35 CityName:İzmir District:Karabağlar Zip:35160
  ```
  `CityCode` burada numeric değilse provider adımında değil, daha önceden validation'da durdurulmuş demektir.
- Provider API başarısızsa: `Geliver etiket üretimi başarısız. OrderId:… Status:400 Body:{…}` ile Geliver'ın dönüş gövdesi loglanır (`code`, `message`, `additionalMessage` içerir).
- Controller sonundaki genel fallback: `Otomatik etiket oluşturulamadı. OrderId:… StoreId:…`.

---

## İlgili Backend Dosyalar

- `API/Controllers/Shipping/SellerShippingOrderController.cs` — endpoint'ler.
- `Services/Shipping/IServices/IShippingService.cs` — kargo servisi sözleşmesi.
- `Services/Shipping/IServices/IGeliverLabelAutomationService.cs` — oto-etiket sözleşmesi + `GeliverAutoLabelResult` / `GeliverAutoLabelStatus`.
- `Services/Shipping/Services/GeliverLabelAutomationService.cs` — oto-etiket iş kuralları (zaten var mı, sahiplik doğrulama, provider çağrısı).
- `Services/Shipping/Providers/Geliver/GeliverShippingProvider.cs` — Geliver HTTP entegrasyonu (`CreateLabelAsync`, `BuildRecipientAddress`, offer kabul).
- `Services/Shipping/Helpers/TurkishCityPlateCodeHelper.cs` — plaka kodu normalize (`NormalizePlateCode`, `IsValidPlateCode`).
- `Services/DeliveryAddress/Services/DeliveryAddressService.cs` — yeni teslimat adresi eklerken `CityCode` normalize edilir (gelecekteki kirli veri yazılmasını engeller).
- `Data/Dtos/Shipping/ShippingOffersDtos.cs` — teklif DTO'ları.
- `Data/Dtos/Shipping/GeliverDtos.cs` — `OrderShippingLabelDto` ve Geliver DTO'ları.
- `API/Middleware/ErrorResponse.cs` — hata gövdesi şeması.

---

## Breaking Changes (Önceki Sürüme Göre)

- `OrderShippingLabelRequestedEvent` ve worker / handler **kaldırıldı**. Sipariş oluşturulduğunda artık otomatik etiket üretilmiyor.
- `IGeliverLabelAutomationService.CreateOrderShippingLabelAsync` imzası değişti: `sellerId` parametresi eklendi ve geri dönüş tipi `OrderShippingLabelDto?` → `GeliverAutoLabelResult` oldu.
- Frontend artık kargo etiketi üretimini kullanıcı aksiyonuna bağlı olarak tetiklemeli (`POST /label/auto` veya manuel akış).
- TR adreslerinde `CityCode` plaka kodu değilse otomatik türetim yapılıyor; Mapbox'tan şehir adı gelse bile sorun çıkarmaz.
