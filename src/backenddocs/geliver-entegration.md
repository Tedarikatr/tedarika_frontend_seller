# Geliver Satıcı Entegrasyonu & Kargo Etiketi API Dokümantasyonu

Bu doküman, satıcı tarafında Geliver entegrasyonu ve sipariş kargo etiketi/track işlemleri için mevcut endpoint'leri, istek/yanıt modellerini ve frontend kullanım notlarını kapsamlı olarak açıklar.

## 📋 İçindekiler

1. [Genel Bilgiler](#genel-bilgiler)
2. [Entegrasyon Akışları](#entegrasyon-akışları)
3. [API Endpoint'leri](#api-endpointleri)
4. [DTO Modelleri ve Örnekler](#dto-modelleri-ve-örnekler)
5. [Kargo Maliyeti Entegrasyonu](#kargo-maliyeti-entegrasyonu)
6. [Webhook Entegrasyonu](#webhook-entegrasyonu)
7. [Frontend Kullanım Notları](#frontend-kullanım-notları)
8. [Konfigürasyon](#konfigürasyon)

---

## Genel Bilgiler

- **Base URL:** `/api/SellerGeliver`
- **Auth:** `Authorization: Bearer <token>`
- **Hata formatı:** `ErrorResponse` → `{ "statusCode": number, "message": string }`
- **Başarılı yanıtlar:** `200 OK` ve ilgili DTO
- **API Group:** `seller` (Swagger'da seller grubunda görünür)

---

## Entegrasyon Akışları

### Yöntem 1: Otomatik Kayıt (Önerilen) ⭐

1. **Otomatik kayıt**: `POST /api/SellerGeliver/auto-register`
   - Tek tıkla Geliver'e otomatik kayıt yapılır
   - Organizasyon, token ve gönderici adresi otomatik oluşturulur
   - Webhook otomatik kaydedilir
   - Tüm bilgiler (OrganizationId, OrganizationName, TokenName) otomatik kaydedilir

### Yöntem 2: Mevcut Hesap Eşleştirme (Yeni) ⭐

1. **Hesap eşleştirme**: `POST /api/SellerGeliver/match-existing-account`
   - Satıcının zaten Geliver'da hesabı varsa kullanılır
   - Token validate edilir ve organization bilgileri otomatik alınır
   - Sender address ID ve provider service code ile entegrasyon tamamlanır

### Yöntem 3: Manuel Entegrasyon

1. **Entegrasyon talebi**: `POST /api/SellerGeliver/integration-request`
2. **Entegrasyon detaylarını kaydet**: `POST /api/SellerGeliver/integration-details`
   - Token validate edilir ve organization bilgileri otomatik alınır
3. **Anlaşma yükle**: `POST /api/SellerGeliver/agreements`

---

## API Endpoint'leri

### 1. Entegrasyon Talebi Oluşturma

**POST** `/api/SellerGeliver/integration-request`

#### Request Body
**Yok** - Endpoint parametresiz çalışır, tüm bilgiler backend'den otomatik alınır.

**Otomatik Alınan Bilgiler:**
- `contactEmail`: Satıcının sistemde kayıtlı email adresinden
- `contactPhone`: Satıcının sistemde kayıtlı telefon numarasından
- `notes`: Satıcının mağaza adı ile otomatik oluşturulur (örn: "Mağaza adı: [StoreName]")

#### Response
```json
{
  "storeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "status": 0,
  "requestedAt": "2026-01-20T12:00:00Z",
  "approvedAt": null,
  "contactEmail": "seller@example.com",
  "contactPhone": "+90 5xx xxx xx xx",
  "notes": "Mağaza adı: Test Mağaza",
  "organizationId": null,
  "organizationName": null,
  "tokenName": null,
  "senderAddressId": null,
  "providerServiceCode": null,
  "autoLabelEnabled": true,
  "integrationCompletedAt": null,
  "tokenMasked": null,
  "isSkipped": false
}
```

**Status Değerleri:**
- `0` = Pending (Beklemede)
- `1` = Active (Aktif)
- `2` = Rejected (Reddedildi)

---

### 2. Otomatik Kayıt ve Kurulum (Önerilen) ⭐

**POST** `/api/SellerGeliver/auto-register`

#### Request Body
**Yok** - Endpoint parametresiz çalışır.

#### Response
```json
{
  "storeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "status": 1,
  "requestedAt": "2026-01-20T12:00:00Z",
  "approvedAt": "2026-01-20T12:05:00Z",
  "contactEmail": "seller@example.com",
  "contactPhone": "+90 5xx xxx xx xx",
  "notes": "Mağaza adı: Test Mağaza",
  "organizationId": "org_123456789",
  "organizationName": "Test Mağaza",
  "tokenName": "Tedarika-Test Mağaza",
  "senderAddressId": "addr_123456789",
  "providerServiceCode": "YURTICI_STANDART",
  "autoLabelEnabled": true,
  "integrationCompletedAt": "2026-01-20T12:05:00Z",
  "tokenMasked": "gel_****1234",
  "isSkipped": false
}
```

**Ne Yapar:**
1. Geliver Partner API üzerinden otomatik olarak **organizasyon** oluşturur
2. Geliver'da **API token** üretir
3. **Gönderici adresi** oluşturur
4. Entegrasyonu **aktif** eder ve tüm bilgileri sisteme kaydeder:
   - `OrganizationId`: Geliver organization ID
   - `OrganizationName`: Mağaza adı
   - `TokenName`: "Tedarika-{StoreName}" formatında
   - `ApiToken`: Geliver API token
   - `SenderAddressId`: Gönderici adres ID
   - `ProviderServiceCode`: Kargo servis kodu
5. Webhook'u otomatik kaydeder (eğer aktifse)

**Ön Koşullar:**
- Satıcının şirket bilgileri (Company) kayıtlı olmalı
- Şirket bilgilerinde şu alanlar dolu olmalı:
  - Email (satıcı email'i)
  - Telefon (satıcı telefonu)
  - Adres (şirket adresi)
  - Şehir (şirket şehri/il)
  - Ülke (şirket ülkesi)

**Hata Durumları:**
- `400 Bad Request`: Şirket bilgisi eksikse - "Geliver otomatik kayıt için şirket bilgisi gereklidir..."
- `400 Bad Request`: Email/Telefon eksikse - İlgili alan için hata mesajı
- `400 Bad Request`: Adres/Şehir eksikse - İlgili alan için hata mesajı
- `500 Internal Server Error`: DNS/API bağlantı hatası - "Geliver Partner API'ye bağlanılamadı..."
- `200 OK` (isSkipped: true): Zaten entegre edilmişse

---

### 3. Mevcut Hesap Eşleştirme (Yeni) ⭐

**POST** `/api/SellerGeliver/match-existing-account`

Satıcının zaten Geliver'da hesabı varsa, mevcut hesabı eşleştirmek için kullanılır.

#### Request Body
```json
{
  "apiToken": "geliver_api_token_buraya",
  "senderAddressId": "addr_123456789",
  "providerServiceCode": "YURTICI_STANDART",
  "autoLabelEnabled": true
}
```

**Alanlar:**
- `apiToken` (string, zorunlu): Geliver panelinden alınan API token
- `senderAddressId` (string, opsiyonel): Gönderici adres ID (opsiyonel ama önerilir)
- `providerServiceCode` (string, opsiyonel): Kargo servis kodu (opsiyonel ama önerilir)
- `autoLabelEnabled` (boolean, varsayılan: true): Otomatik etiket oluşturma aktif mi?

#### Response
```json
{
  "isValid": true,
  "organizationId": "org_123456789",
  "organizationName": "Test Mağaza",
  "email": "seller@example.com",
  "phone": "+90 5xx xxx xx xx",
  "message": "Geliver hesabı başarıyla eşleştirildi ve entegrasyon aktif edildi.",
  "integrationStatus": {
    "storeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "status": 1,
    "requestedAt": "2026-01-20T12:00:00Z",
    "approvedAt": "2026-01-20T12:10:00Z",
    "contactEmail": "seller@example.com",
    "contactPhone": "+90 5xx xxx xx xx",
    "notes": "Mağaza adı: Test Mağaza",
    "organizationId": "org_123456789",
    "organizationName": "Test Mağaza",
    "tokenName": null,
    "senderAddressId": "addr_123456789",
    "providerServiceCode": "YURTICI_STANDART",
    "autoLabelEnabled": true,
    "integrationCompletedAt": "2026-01-20T12:10:00Z",
    "tokenMasked": "gel_****1234",
    "isSkipped": false
  }
}
```

**Ne Yapar:**
1. Token'ı Geliver API'ye göndererek validate eder
2. Organization bilgilerini otomatik alır (OrganizationId, OrganizationName, Email, Phone)
3. Sender address ID ve provider service code kontrolü yapar
4. Entegrasyon kaydını oluşturur veya günceller
5. Webhook'u otomatik kaydeder (eğer aktifse)
6. Entegrasyonu `Active` durumuna geçirir

**Hata Durumları:**
- `400 Bad Request`: Token geçersiz - "Geliver API token geçersiz veya yetkilendirme başarısız..."
- `400 Bad Request`: Sender address ID eksik - Response'da `isValid: true` ama `message` alanında uyarı
- `400 Bad Request`: Provider service code eksik - Response'da `isValid: true` ama `message` alanında uyarı

**Notlar:**
- Token validation başarısız olursa `isValid: false` döner
- Sender address ID ve provider service code eksikse entegrasyon kaydedilir ama kullanılamaz durumda kalır

---

### 4. Entegrasyon Detaylarını Kaydetme (Manuel)

**POST** `/api/SellerGeliver/integration-details`

#### Request Body
```json
{
  "apiToken": "geliver_api_token_buraya",
  "senderAddressId": "addr_123456789",
  "providerServiceCode": "YURTICI_STANDART",
  "autoLabelEnabled": true
}
```

#### Response
```json
{
  "storeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "status": 1,
  "requestedAt": "2026-01-20T12:00:00Z",
  "approvedAt": "2026-01-20T12:15:00Z",
  "contactEmail": "seller@example.com",
  "contactPhone": "+90 5xx xxx xx xx",
  "notes": "Mağaza adı: Test Mağaza",
  "organizationId": "org_123456789",
  "organizationName": "Test Mağaza",
  "tokenName": null,
  "senderAddressId": "addr_123456789",
  "providerServiceCode": "YURTICI_STANDART",
  "autoLabelEnabled": true,
  "integrationCompletedAt": "2026-01-20T12:15:00Z",
  "tokenMasked": "gel_****1234",
  "isSkipped": false
}
```

**Notlar:**
- Token otomatik olarak validate edilir ve organization bilgileri alınır
- Daha önce token + senderAddressId + providerServiceCode kayıtlıysa **işlem atlanır**, `isSkipped = true` döner
- `tokenMasked` alanı token'ı maskeleyerek döner (frontend'de güvenli gösterim için)
- `organizationId` ve `organizationName` otomatik olarak token validation'dan alınır

---

### 5. Entegrasyon Bilgileri ve Anlaşmaları Görüntüleme

**GET** `/api/SellerGeliver/integration-details`

#### Request Body
**Yok** - Endpoint parametresiz çalışır, `storeId` otomatik olarak `SellerUserContextHelper` ile alınır.

#### Response
```json
{
  "integration": {
    "storeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "status": 1,
    "requestedAt": "2026-01-20T12:00:00Z",
    "approvedAt": "2026-01-20T13:00:00Z",
    "contactEmail": "seller@example.com",
    "contactPhone": "+90 5xx xxx xx xx",
    "notes": "Mağaza adı: Test Mağaza",
    "organizationId": "org_123456789",
    "organizationName": "Test Mağaza",
    "tokenName": "Tedarika-Test Mağaza",
    "senderAddressId": "addr_123456789",
    "providerServiceCode": "YURTICI_STANDART",
    "autoLabelEnabled": true,
    "integrationCompletedAt": "2026-01-20T13:00:00Z",
    "tokenMasked": "gel_****1234",
    "isSkipped": false
  },
  "agreements": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "carrierCompany": 0,
      "agreementFileUrl": "https://storage.example.com/agreements/agreement.pdf",
      "uploadedAt": "2026-01-20T14:00:00Z",
      "validFrom": "2026-01-01T00:00:00Z",
      "validUntil": "2027-01-01T00:00:00Z",
      "notes": "Yurtiçi Kargo anlaşması"
    }
  ]
}
```

**Notlar:**
- Entegrasyon kaydı yoksa, varsayılan bir `GeliverIntegrationStatusDto` döner (status: Pending, autoLabelEnabled: false)
- `agreements` listesi boş olabilir (henüz anlaşma yüklenmemişse)
- Bu endpoint satıcının entegrasyon durumunu ve tüm anlaşmalarını tek bir istekle görüntülemesini sağlar

---

### 6. Anlaşma Dosyası Yükleme

**POST** `/api/SellerGeliver/agreements`

#### Request (multipart/form-data)
```
carrierCompany: 0
validFrom: 2026-01-01T00:00:00Z
validUntil: 2027-01-01T00:00:00Z
notes: Yurtiçi Kargo anlaşması (opsiyonel - boş bırakılırsa mağaza adı ile otomatik doldurulur)
file: <dosya>
```

**Alanlar:**
- `carrierCompany` (int, zorunlu): Taşıyıcı şirket enum değeri
- `validFrom` (datetime, opsiyonel): Geçerlilik başlangıç tarihi
- `validUntil` (datetime, opsiyonel): Geçerlilik bitiş tarihi
- `notes` (string, opsiyonel): **Boş bırakılırsa mağaza adı ile otomatik doldurulur**
- `file` (dosya, zorunlu): Anlaşma PDF dosyası

#### Response
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "carrierCompany": 0,
  "agreementFileUrl": "https://storage.example.com/agreements/agreement.pdf",
  "uploadedAt": "2026-01-20T12:00:00Z",
  "validFrom": "2026-01-01T00:00:00Z",
  "validUntil": "2027-01-01T00:00:00Z",
  "notes": "Mağaza adı: Test Mağaza"
}
```

**Taşıyıcı Şirket Kodları (CarrierCompany Enum):**

| Enum Değeri (int) | Şirket Adı | Açıklama |
|-------------------|------------|----------|
| 0 | Yurtiçi | Yurtiçi Kargo |
| 1 | Aras | Aras Kargo |
| 2 | Mng | MNG Kargo |
| 3 | Sürat | Sürat Kargo |
| 4 | Ptt | PTT Kargo |
| 5 | HepsiJet | hepsiJET Kargo |
| 6 | TrendyolExpress | Trendyol Express |
| 7 | KolayGelsin | Kolay Gelsin Kargo |
| 8 | Kargoist | Kargoist |
| 9 | Jetizz | Jetizz |
| 10 | ShipEntegra | ShipEntegra |
| 11 | Scotty | Scotty |
| 12 | BitaksiExpress | Bitaksi Express |
| 13 | Octovan | Octovan |
| 14 | PaketTaxi | Paket Taxi Kurye |
| 15 | Cargon | Cargon |
| 16 | DHL | DHL Ecommerce |
| 17 | UPS | UPS |
| 18 | FedEx | FedEx |
| 19 | TNT | TNT |
| 20 | GLS | GLS |
| 21 | Aramex | Aramex |
| 22 | Ceva | Ceva Logistics |
| 23 | Horoz | Horoz Lojistik |
| 24 | Netlog | Netlog Lojistik |
| 25 | Ekol | Ekol Lojistik |
| 26 | BorusanLojistik | Borusan Lojistik |

---

### 7. Sipariş İçin Geliver Kargo Etiketi Kaydetme

**POST** `/api/SellerGeliver/orders/{orderId}/geliver-label`

#### Request Body
```json
{
  "labelUrl": "https://geliver.io/labels/label_123.pdf",
  "responsiveLabelUrl": "https://geliver.io/labels/label_123_a4.pdf",
  "shipmentId": "ship_123456789",
  "trackingNumber": "TRK123456789",
  "trackingUrl": "https://geliver.io/track/TRK123456789",
  "trackingStatus": "IN_TRANSIT",
  "trackingUpdatedAt": "2026-01-20T12:00:00Z",
  "contentType": "application/pdf"
}
```

#### Response
```json
{
  "orderId": 123,
  "fileName": "label_123.pdf",
  "fileUrl": "https://storage.example.com/labels/label_123.pdf",
  "shipmentId": "ship_123456789",
  "responsiveLabelUrl": "https://geliver.io/labels/label_123_a4.pdf",
  "trackingNumber": "TRK123456789",
  "trackingUrl": "https://geliver.io/track/TRK123456789",
  "trackingStatus": "IN_TRANSIT",
  "trackingUpdatedAt": "2026-01-20T12:00:00Z",
  "contentType": "application/pdf",
  "createdAt": "2026-01-20T12:00:00Z",
  "isSkipped": false
}
```

**Notlar:**
- Mağaza entegrasyonu aktif ve token kayıtlı değilse `400/500` hata dönebilir
- Etiket/Shipment bilgisi daha önce kaydedildiyse `isSkipped = true` döner

---

### 8. Sipariş Kargo Etiketi Yükleme (Manuel)

**POST** `/api/SellerGeliver/orders/{orderId}/label`

#### Request (multipart/form-data)
```
file: <dosya>
```

#### Response
```json
{
  "orderId": 123,
  "fileName": "label_123.pdf",
  "fileUrl": "https://storage.example.com/labels/label_123.pdf",
  "shipmentId": null,
  "responsiveLabelUrl": null,
  "trackingNumber": null,
  "trackingUrl": null,
  "trackingStatus": null,
  "trackingUpdatedAt": null,
  "contentType": "application/pdf",
  "createdAt": "2026-01-20T12:00:00Z",
  "isSkipped": false
}
```

**Notlar:**
- Var olan etiket dosyası silinip yenisi yüklenir

---

### 9. Sipariş Kargo Etiketi İndirme

**GET** `/api/SellerGeliver/orders/{orderId}/label`

#### Response
- Dosya stream (PDF veya uygun content-type)
- Content-Type: `application/pdf` veya `application/octet-stream`

---

### 10. Sipariş Kargo Takibi Görüntüleme

**GET** `/api/SellerGeliver/orders/{orderId}/tracking`

#### Response
```json
{
  "orderId": 123,
  "fileName": "label_123.pdf",
  "fileUrl": "https://storage.example.com/labels/label_123.pdf",
  "shipmentId": "ship_123456789",
  "responsiveLabelUrl": "https://geliver.io/labels/label_123_a4.pdf",
  "trackingNumber": "TRK123456789",
  "trackingUrl": "https://geliver.io/track/TRK123456789",
  "trackingStatus": "DELIVERED",
  "trackingUpdatedAt": "2026-01-21T10:00:00Z",
  "contentType": "application/pdf",
  "createdAt": "2026-01-20T12:00:00Z",
  "isSkipped": false
}
```

---

### 11. Kargo Takip Bilgisi Güncelleme

**POST** `/api/SellerGeliver/tracking`

#### Request Body
```json
{
  "shipmentId": "ship_123456789",
  "trackingNumber": "TRK123456789",
  "trackingUrl": "https://geliver.io/track/TRK123456789",
  "trackingStatus": "DELIVERED",
  "trackingUpdatedAt": "2026-01-21T10:00:00Z"
}
```

#### Response
```json
{
  "orderId": 123,
  "fileName": "label_123.pdf",
  "fileUrl": "https://storage.example.com/labels/label_123.pdf",
  "shipmentId": "ship_123456789",
  "responsiveLabelUrl": "https://geliver.io/labels/label_123_a4.pdf",
  "trackingNumber": "TRK123456789",
  "trackingUrl": "https://geliver.io/track/TRK123456789",
  "trackingStatus": "DELIVERED",
  "trackingUpdatedAt": "2026-01-21T10:00:00Z",
  "contentType": "application/pdf",
  "createdAt": "2026-01-20T12:00:00Z",
  "isSkipped": false
}
```

**Notlar:**
- `shipmentId` üzerinden kayıt güncellenir
- Takip numarası geldiğinde, siparişin `TrackingNumber` alanı da güncellenir
- Sipariş durumu otomatik olarak güncellenir (Shipped → Delivered)

---

## DTO Modelleri ve Örnekler

### GeliverIntegrationStatusDto

Entegrasyon durumunu temsil eder.

```json
{
  "storeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "status": 1,
  "requestedAt": "2026-01-20T12:00:00Z",
  "approvedAt": "2026-01-20T13:00:00Z",
  "contactEmail": "seller@example.com",
  "contactPhone": "+90 5xx xxx xx xx",
  "notes": "Mağaza adı: Test Mağaza",
  "organizationId": "org_123456789",
  "organizationName": "Test Mağaza",
  "tokenName": "Tedarika-Test Mağaza",
  "senderAddressId": "addr_123456789",
  "providerServiceCode": "YURTICI_STANDART",
  "autoLabelEnabled": true,
  "integrationCompletedAt": "2026-01-20T13:00:00Z",
  "tokenMasked": "gel_****1234",
  "isSkipped": false
}
```

**Alanlar:**
- `storeId` (Guid): Mağaza ID
- `status` (enum): Pending=0, Active=1, Rejected=2
- `requestedAt` (DateTime): Talep tarihi
- `approvedAt` (DateTime?): Onay tarihi
- `contactEmail` (string?): İletişim email'i
- `contactPhone` (string?): İletişim telefonu
- `notes` (string?): Notlar
- `organizationId` (string?): **Yeni** - Geliver organization ID
- `organizationName` (string?): **Yeni** - Organization adı
- `tokenName` (string?): **Yeni** - Token adı
- `senderAddressId` (string?): Gönderici adres ID
- `providerServiceCode` (string?): Kargo servis kodu
- `autoLabelEnabled` (bool): Otomatik etiket oluşturma aktif mi?
- `integrationCompletedAt` (DateTime?): Entegrasyon tamamlanma tarihi
- `tokenMasked` (string?): Maskeleme token (güvenli gösterim için)
- `isSkipped` (bool): İşlem atlandı mı?

---

### GeliverAccountMatchRequestDto

Mevcut hesap eşleştirme isteği.

```json
{
  "apiToken": "geliver_api_token_buraya",
  "senderAddressId": "addr_123456789",
  "providerServiceCode": "YURTICI_STANDART",
  "autoLabelEnabled": true
}
```

**Alanlar:**
- `apiToken` (string, zorunlu): Geliver API token
- `senderAddressId` (string?, opsiyonel): Gönderici adres ID
- `providerServiceCode` (string?, opsiyonel): Kargo servis kodu
- `autoLabelEnabled` (bool, varsayılan: true): Otomatik etiket oluşturma

---

### GeliverAccountMatchResponseDto

Mevcut hesap eşleştirme yanıtı.

```json
{
  "isValid": true,
  "organizationId": "org_123456789",
  "organizationName": "Test Mağaza",
  "email": "seller@example.com",
  "phone": "+90 5xx xxx xx xx",
  "message": "Geliver hesabı başarıyla eşleştirildi ve entegrasyon aktif edildi.",
  "integrationStatus": {
    // GeliverIntegrationStatusDto
  }
}
```

**Alanlar:**
- `isValid` (bool): Token geçerli mi?
- `organizationId` (string?): Organization ID
- `organizationName` (string?): Organization adı
- `email` (string?): Email
- `phone` (string?): Telefon
- `message` (string?): İşlem mesajı
- `integrationStatus` (GeliverIntegrationStatusDto?): Entegrasyon durumu

---

### OrderShippingLabelDto

Sipariş kargo etiketi bilgileri.

```json
{
  "orderId": 123,
  "fileName": "label_123.pdf",
  "fileUrl": "https://storage.example.com/labels/label_123.pdf",
  "shipmentId": "ship_123456789",
  "responsiveLabelUrl": "https://geliver.io/labels/label_123_a4.pdf",
  "trackingNumber": "TRK123456789",
  "trackingUrl": "https://geliver.io/track/TRK123456789",
  "trackingStatus": "DELIVERED",
  "trackingUpdatedAt": "2026-01-21T10:00:00Z",
  "contentType": "application/pdf",
  "createdAt": "2026-01-20T12:00:00Z",
  "isSkipped": false
}
```

---

### GeliverIntegrationDetailsDto

Entegrasyon detayları ve anlaşmalar.

```json
{
  "integration": {
    // GeliverIntegrationStatusDto
  },
  "agreements": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "carrierCompany": 0,
      "agreementFileUrl": "https://storage.example.com/agreements/agreement.pdf",
      "uploadedAt": "2026-01-20T14:00:00Z",
      "validFrom": "2026-01-01T00:00:00Z",
      "validUntil": "2027-01-01T00:00:00Z",
      "notes": "Yurtiçi Kargo anlaşması"
    }
  ]
}
```

---

## Kargo Maliyeti Entegrasyonu

### Genel Bakış

Geliver entegrasyonunda kargo maliyeti (`ShippingCost`) otomatik olarak tespit edilir ve siparişe eklenir.

### Akış

1. **Sipariş Oluşturulur**
   - `Order.TotalAmount` = Ürün toplamı
   - `Order.ShippingCost` = 0

2. **Geliver Shipment Oluşturulur**
   - Geliver API'den `offers` gelir
   - En ucuz offer (`cheapest`) seçilir
   - Offer kabul edilir (eğer label yoksa)
   - `Order.ShippingCost` = Offer'dan gelen `totalAmount`
   - `Order.TotalAmount` += `Order.ShippingCost`

3. **Payment Güncellenir**
   - `Payment.TotalAmount` = `Order.TotalAmount` (zaten shipping cost dahil)
   - Payment henüz completed değilse token temizlenir (yeniden initialize gerekir)

4. **Finance Payout**
   - `FinanceSellerPayout.ShippingCost` = `Order.ShippingCost` kaydedilir
   - Raporlama için kullanılabilir

### Entity Değişiklikleri

**Order Entity:**
```csharp
public decimal ShippingCost { get; set; }  // Yeni alan
public decimal TotalAmount { get; set; }    // Artık ürün + kargo toplamı
```

**FinanceSellerPayout Entity:**
```csharp
public decimal? ShippingCost { get; set; }  // Yeni alan
```

**OrderDto:**
```json
{
  "id": 123,
  "orderNumber": "ABC123",
  "totalAmount": 1500.00,      // Ürün + Kargo
  "shippingCost": 50.00,        // Yeni alan
  "currency": "TRY",
  // ...
}
```

### Önemli Notlar

- **Payment Token**: Shipping cost eklendikten sonra payment token temizlenir, kullanıcı yeniden ödeme sayfasına gidip yeni token almalıdır
- **Commission**: Commission hesaplaması `Order.OrderItems` üzerinden yapılır (shipping cost hariç) - Bu doğru
- **Seller Payout**: `SubMerchantPayoutAmount - ShippingCost` (manuel hesaplama gerekirse `FinanceSellerPayout.ShippingCost` kullanılabilir)

---

## Webhook Entegrasyonu

### Webhook Endpoint

**POST** `/api/geliver/webhook` (AllowAnonymous)

Geliver'dan gelen tracking güncellemelerini alır.

### Webhook Güvenliği

Webhook'lar şu yöntemlerle doğrulanır:
- **HMAC-SHA256 Signature**: `X-Geliver-Signature` header'ı ile
- **Secret Header**: `X-Geliver-Secret` header'ı ile (opsiyonel)

**Konfigürasyon:**
```json
{
  "Geliver": {
    "Webhook": {
      "Secret": "your_webhook_secret",
      "SignatureHeaderName": "X-Geliver-Signature",
      "SecretHeaderName": "X-Geliver-Secret"
    }
  }
}
```

### Webhook Payload

```json
{
  "type": "TRACK_UPDATED",
  "shipmentID": "ship_123456789",
  "trackingNumber": "TRK123456789",
  "trackingURL": "https://geliver.io/track/TRK123456789",
  "trackingUpdatedAt": "2026-01-21T10:00:00Z",
  "trackingStatus": {
    "trackingStatusCode": "DELIVERED",
    "trackingSubStatusCode": "DELIVERED_TO_RECIPIENT",
    "statusDetails": "Teslim edildi",
    "statusDate": "2026-01-21T10:00:00Z",
    "locationName": "İstanbul"
  }
}
```

### Otomatik Webhook Kaydı

Entegrasyon aktif edildiğinde webhook otomatik olarak kaydedilir (eğer `Geliver:WebhookRegistration:Enabled = true` ise).

**Konfigürasyon:**
```json
{
  "Geliver": {
    "WebhookRegistration": {
      "Enabled": true,
      "TargetUrl": "https://your-domain.com/api/geliver/webhook",
      "Type": "TRACK_UPDATED"
    }
  }
}
```

### Tracking Status Mapping

Geliver tracking status'leri otomatik olarak `OrderStatus`'e map edilir:

- `CREATED` → `Shipped`
- `IN_TRANSIT` → `Shipped`
- `OUT_FOR_DELIVERY` → `Shipped`
- `DELIVERED` → `Delivered`
- `RETURNED` → `RefundPending`
- `CANCELLED` → `Cancelled`

**Not:** Sipariş durumu geçişleri `OrderService` tarafından kontrol edilir (örneğin `Delivered` → `Shipped` geçişi yapılamaz).

---

## Frontend Kullanım Notları

### İlk Entegrasyon (Önerilen Akış)

**Yöntem 1: Otomatik Kayıt (Önerilen) ⭐**
1. `POST /api/SellerGeliver/auto-register` → Tek tıkla otomatik entegrasyon
   - Şirket bilgileri eksikse kullanıcıya uyarı göster
   - Başarılı olursa entegrasyon tamamlanır
   - DNS/API hatası varsa kullanıcıya bilgi ver ve manuel akışa yönlendir

**Yöntem 2: Mevcut Hesap Eşleştirme (Yeni) ⭐**
1. `POST /api/SellerGeliver/match-existing-account` → Mevcut Geliver hesabını eşleştir
   - Token validate edilir
   - Organization bilgileri otomatik alınır
   - Sender address ID ve provider service code ile entegrasyon tamamlanır

**Yöntem 3: Manuel Entegrasyon**
1. `POST /api/SellerGeliver/integration-request` → Parametresiz çağrılır
2. `POST /api/SellerGeliver/integration-details` → Geliver token ve adres bilgileri kaydedilir
   - Token otomatik validate edilir
   - Organization bilgileri otomatik alınır
3. `POST /api/SellerGeliver/agreements` → Anlaşma dosyası yüklenir (notes boşsa otomatik doldurulur)

### Entegrasyon Durumu ve Anlaşmaları Görüntüleme

- **Entegrasyon bilgileri**: `GET /api/SellerGeliver/integration-details` → Entegrasyon durumu ve tüm anlaşmaları birlikte getirir
  - Frontend'de entegrasyon sayfası açıldığında bu endpoint çağrılarak mevcut durum gösterilir
  - Entegrasyon kaydı yoksa varsayılan değerler döner

### Sipariş Kargo Etiketi

- **Otomatik oluşturma**: Sipariş oluşturulduğunda, entegrasyon aktif ve `autoLabelEnabled=true` ise worker servis tarafından otomatik olarak Geliver API'si çağrılarak kargo etiketi oluşturulur. Frontend'in ek bir işlem yapmasına gerek yoktur.
- **Manuel kayıt**: Geliver API çağrısı sonrası `orders/{orderId}/geliver-label` ile kaydedilir.
- **Manuel yükleme**: Satıcı paneli dosya yükleme için `orders/{orderId}/label`.

### Kargo Maliyeti Gösterimi

- Sipariş detaylarında `shippingCost` alanı gösterilir
- `totalAmount` = ürün toplamı + kargo maliyeti
- Payment sayfasında toplam tutar shipping cost dahil gösterilir

### Diğer Notlar

- **Sipariş ekranı**: `orders/{orderId}/tracking` ile güncel tracking bilgisi gösterilir.
- `isSkipped` **true** ise frontend, işlem sonucunu "zaten kayıtlı" olarak gösterebilir.
- **Hata yönetimi**: 
  - DNS/API bağlantı hatalarında kullanıcıya anlaşılır mesaj göster
  - Eksik bilgi hatalarında hangi alanın eksik olduğunu belirt
  - `auto-register` başarısız olursa manuel akışa yönlendir
  - Token validation başarısız olursa kullanıcıya token'ı kontrol etmesini söyle

---

## Konfigürasyon

### Partner API Konfigürasyonu

Otomatik kayıt için `appsettings.json`'da şu ayarlar gerekli:

```json
{
  "Geliver": {
    "PartnerApi": {
      "BaseUrl": "https://partner.geliver.io/api/v1",
      "ClientId": "YOUR_PARTNER_CLIENT_ID",
      "ClientSecret": "YOUR_PARTNER_CLIENT_SECRET",
      "MasterToken": "" // Alternatif olarak master token kullanılabilir
    },
    "Webhook": {
      "Secret": "your_webhook_secret",
      "SignatureHeaderName": "X-Geliver-Signature",
      "SecretHeaderName": "X-Geliver-Secret"
    },
    "WebhookRegistration": {
      "Enabled": true,
      "TargetUrl": "https://your-domain.com/api/geliver/webhook",
      "Type": "TRACK_UPDATED"
    },
    "SenderAddressDefaults": {
      "CityName": "İstanbul",
      "CityCode": "34",
      "DistrictName": "Kadıköy",
      "DistrictId": 1234,
      "Zip": "34700",
      "CountryCode": "TR"
    }
  }
}
```

### Tracking Reconciliation Worker

Periyodik olarak tracking durumlarını günceller:

```json
{
  "Workers": {
    "GeliverTrackingReconcile": {
      "ScanIntervalMinutes": 30,
      "StaleHours": 6,
      "BatchSize": 50
    }
  }
}
```

---

## Son Güncellemeler (2026-01-20)

### Yeni Özellikler

1. **Mevcut Hesap Eşleştirme**: `POST /api/SellerGeliver/match-existing-account` endpoint'i eklendi
2. **Token Validation**: Tüm entegrasyon metodlarında token otomatik validate ediliyor
3. **Organization Bilgileri**: `OrganizationId`, `OrganizationName`, `TokenName` otomatik kaydediliyor
4. **Kargo Maliyeti**: Shipping cost otomatik tespit edilip siparişe ekleniyor
5. **Webhook Entegrasyonu**: Otomatik webhook kaydı ve tracking güncellemeleri
6. **Tracking Refresh**: Buyer ve seller için tracking refresh endpoint'leri

### Düzeltmeler

1. **OrganizationId Kaydı**: Artık tüm entegrasyon metodlarında `OrganizationId` kaydediliyor
2. **OrganizationName Kaydı**: Token validation'dan gelen organization name kaydediliyor
3. **TokenName Kaydı**: Otomatik kayıt sırasında token name kaydediliyor
4. **SaveIntegrationDetailsAsync**: Token validation eklendi, organization bilgileri otomatik alınıyor

---

## Örnek Frontend Kullanım Senaryoları

### Senaryo 1: Yeni Satıcı - Otomatik Kayıt

```javascript
// 1. Otomatik kayıt dene
try {
  const response = await fetch('/api/SellerGeliver/auto-register', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (response.ok) {
    const data = await response.json();
    if (data.isSkipped) {
      // Zaten entegre edilmiş
      showMessage('Entegrasyon zaten tamamlanmış');
    } else {
      // Başarılı
      showMessage('Geliver entegrasyonu başarıyla tamamlandı!');
      // Organization bilgilerini göster
      console.log('Organization ID:', data.organizationId);
      console.log('Organization Name:', data.organizationName);
    }
  }
} catch (error) {
  // Hata durumunda manuel akışa yönlendir
  showError('Otomatik kayıt başarısız. Lütfen manuel olarak entegrasyon bilgilerinizi girin.');
  navigateToManualIntegration();
}
```

### Senaryo 2: Mevcut Geliver Hesabı Eşleştirme

```javascript
// 1. Kullanıcıdan token al
const apiToken = prompt('Geliver API token\'ınızı girin:');

// 2. Hesap eşleştirme
try {
  const response = await fetch('/api/SellerGeliver/match-existing-account', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      apiToken: apiToken,
      senderAddressId: senderAddressId, // Opsiyonel
      providerServiceCode: providerServiceCode, // Opsiyonel
      autoLabelEnabled: true
    })
  });
  
  const data = await response.json();
  
  if (data.isValid) {
    if (data.integrationStatus) {
      // Başarılı
      showMessage(data.message);
      console.log('Organization ID:', data.organizationId);
      console.log('Organization Name:', data.organizationName);
    } else {
      // Token geçerli ama eksik bilgiler var
      showWarning(data.message);
      // Sender address ID ve provider service code iste
      promptForAdditionalInfo();
    }
  } else {
    // Token geçersiz
    showError('Token geçersiz. Lütfen token\'ınızı kontrol edin.');
  }
} catch (error) {
  showError('Hesap eşleştirme başarısız.');
}
```

### Senaryo 3: Entegrasyon Durumu Görüntüleme

```javascript
// Entegrasyon sayfası açıldığında
const response = await fetch('/api/SellerGeliver/integration-details', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();

// Entegrasyon durumunu göster
if (data.integration.status === 1) {
  // Aktif
  showStatus('Aktif');
  showOrganizationInfo(data.integration.organizationId, data.integration.organizationName);
} else if (data.integration.status === 0) {
  // Beklemede
  showStatus('Beklemede');
  showActionButton('Entegrasyonu Tamamla');
} else {
  // Reddedildi
  showStatus('Reddedildi');
}

// Anlaşmaları listele
data.agreements.forEach(agreement => {
  showAgreement(agreement);
});
```

---

## Sorun Giderme

### Token Validation Hatası

**Sorun:** "Geliver API token geçersiz veya yetkilendirme başarısız"

**Çözüm:**
1. Token'ın Geliver panelinden doğru kopyalandığından emin olun
2. Token'ın aktif olduğunu kontrol edin
3. IP kısıtlaması varsa sunucu IP'sinin izinli olduğunu kontrol edin

### Organization Bilgileri Eksik

**Sorun:** `organizationId` veya `organizationName` null dönüyor

**Çözüm:**
1. Token validation'ın başarılı olduğundan emin olun
2. Geliver API'nin `/organizations/me` endpoint'ini kontrol edin
3. Token'ın organization'a erişim yetkisi olduğunu kontrol edin

### Shipping Cost Eksik

**Sorun:** Siparişte `shippingCost` 0 görünüyor

**Çözüm:**
1. Geliver shipment oluşturulduğunda `offers` geldiğini kontrol edin
2. `cheapest` offer'ın `totalAmount` değerini kontrol edin
3. Offer'ın kabul edildiğini kontrol edin

### Webhook Çalışmıyor

**Sorun:** Tracking güncellemeleri gelmiyor

**Çözüm:**
1. Webhook'un kayıtlı olduğunu kontrol edin
2. Webhook URL'inin erişilebilir olduğunu kontrol edin
3. Webhook secret'ın doğru yapılandırıldığını kontrol edin
4. Geliver panelinden webhook'u test edin

---

## İletişim ve Destek

Geliver entegrasyonu ile ilgili sorularınız için:
- Geliver Dokümantasyon: https://docs.geliver.io/docs/home
- Geliver GitHub: https://github.com/geliverapp

---

**Son Güncelleme:** 2026-01-20  
**Versiyon:** 2.0
