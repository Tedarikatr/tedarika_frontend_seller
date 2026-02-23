# SellerBrandController — API Gidiş-Dönüş Raporu

**Controller:** `API.Controllers.Brands.SellerBrandController`  
**Base route:** `api/SellerBrand`  
**Swagger group:** `seller`  
**Yetkilendirme:** `[Authorize]` — tüm endpoint'ler kimlik doğrulama gerektirir.

---

## İlgili Enum'lar

### BrandStatus
Marka onay / yayın durumu (admin onayı, red, askıya alma).

| Değer | Sayı | Açıklama     |
|-------|------|--------------|
| Pending   | 0 | Beklemede   |
| Approved  | 1 | Onaylı      |
| Suspended | 2 | Askıya alınmış |
| Rejected  | 3 | Reddedildi  |

### BrandOwnershipType
Marka sahiplik türü (sahip / yetkili satıcı).

| Değer             | Sayı | Açıklama        |
|-------------------|------|-----------------|
| Owner             | 0 | Sahip           |
| AuthorizedReseller| 1 | Yetkili satıcı  |

### BrandOwnershipStatus
Marka sahiplik talebi durumu.

| Değer    | Sayı | Açıklama      |
|----------|------|---------------|
| Pending  | 0 | Beklemede     |
| Approved | 1 | Onaylı        |
| Rejected | 2 | Reddedildi    |
| Revoked  | 3 | İptal         |
| Expired  | 4 | Süresi dolmuş |

### BrandLockStatus
Marka buybox kilit durumu (admin atama / kilitleme).

| Değer        | Sayı | Açıklama        |
|--------------|------|-----------------|
| None         | 0 | Kilit yok       |
| OwnerOnly    | 1 | Sadece sahip    |
| AdminOverride| 2 | Admin üzerine yazma |

---

## 1. Marka listesi (tüm marka adları)

**Method:** `GET`  
**Path:** `api/SellerBrand/list`

### İstek (Request)
- **Headers:** `Authorization: Bearer <token>` (zorunlu)
- **Body:** Yok
- **Query:** Yok

### Başarılı yanıt (200 OK)
Dönen tip: `IEnumerable<BrandNameDto>`

```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "Örnek Marka",
    "imageUrl": "https://cdn.example.com/brands/logo.png"
  },
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Başka Marka",
    "imageUrl": null
  }
]
```

| Alan     | Tip    | Açıklama        |
|----------|--------|-----------------|
| id       | guid   | Marka kimliği   |
| name     | string | Marka adı       |
| imageUrl | string?| Logo URL (opsiyonel) |

### Hata yanıtları
- **500 Internal Server Error**
```json
{
  "message": "Markalar listelenirken bir hata oluştu."
}
```

---

## 2. Mağazanın marka yetkileri (store brands)

**Method:** `GET`  
**Path:** `api/SellerBrand`

### İstek (Request)
- **Headers:** `Authorization: Bearer <token>` (zorunlu)
- **Body:** Yok
- **Query:** Yok  
StoreId, token’dan (`SellerUserContextHelper`) alınır.

### Başarılı yanıt (200 OK)
Dönen tip: `IEnumerable<BrandOwnershipDto>`

```json
[
  {
    "id": "b2c3d4e5-f6a7-8901-bcde-f23456789012",
    "brandId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "brandName": "Örnek Marka",
    "storeId": "c3d4e5f6-a7b8-9012-cdef-345678901234",
    "ownershipType": 0,
    "status": 1,
    "requestedAt": "2025-02-20T10:00:00Z",
    "approvedAt": "2025-02-21T14:30:00Z",
    "expiryDate": "2026-02-21T14:30:00Z",
    "notes": "Yetkili satıcı anlaşması"
  }
]
```

| Alan          | Tip    | Açıklama                          |
|---------------|--------|-----------------------------------|
| id            | guid   | Sahiplik kaydı kimliği           |
| brandId       | guid   | Marka kimliği                    |
| brandName     | string | Marka adı                        |
| storeId       | guid   | Mağaza kimliği                   |
| ownershipType | enum   | `BrandOwnershipType` (0=Owner, 1=AuthorizedReseller) |
| status        | enum   | `BrandOwnershipStatus` (0–4)     |
| requestedAt   | datetime | Talep tarihi                   |
| approvedAt    | datetime? | Onay tarihi                    |
| expiryDate    | datetime? | Bitiş tarihi                   |
| notes         | string | Notlar                           |

### Hata yanıtları
- **500 Internal Server Error**
```json
{
  "message": "Marka yetkileri alınırken bir hata oluştu."
}
```

---

## 3. Marka sahipliği başvuru durumları

**Method:** `GET`  
**Path:** `api/SellerBrand/get-ownership`

### İstek (Request)
- **Headers:** `Authorization: Bearer <token>` (zorunlu)
- **Body:** Yok
- **Query:** Yok

### Başarılı yanıt (200 OK)
Dönen tip: `IEnumerable<BrandOwnershipStatusDto>`

```json
[
  {
    "id": "d4e5f6a7-b8c9-0123-def0-456789012345",
    "brandId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "brandName": "Örnek Marka",
    "status": 0,
    "ownershipType": 1,
    "requestedAt": "2025-02-22T09:00:00Z",
    "approvedAt": null,
    "revokedAt": null,
    "expiryDate": null,
    "notes": "Yetkili satıcı başvurusu"
  }
]
```

| Alan          | Tip      | Açıklama                          |
|---------------|----------|-----------------------------------|
| id            | guid     | Sahiplik kaydı kimliği           |
| brandId       | guid     | Marka kimliği                    |
| brandName     | string   | Marka adı                        |
| status        | enum     | `BrandOwnershipStatus` (0–4)     |
| ownershipType | enum     | `BrandOwnershipType` (0–1)       |
| requestedAt   | datetime | Talep tarihi                     |
| approvedAt    | datetime?| Onay tarihi                      |
| revokedAt     | datetime?| İptal tarihi                     |
| expiryDate    | datetime?| Bitiş tarihi                     |
| notes         | string   | Notlar                           |

### Hata yanıtları
- **500 Internal Server Error**
```json
{
  "message": "Marka sahipliği başvuru durumları alınırken bir hata oluştu."
}
```

---

## 4. Marka sahiplik talebi oluşturma

**Method:** `POST`  
**Path:** `api/SellerBrand/ownership-request`  
**Content-Type:** `application/json`

### İstek (Request)
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body:** `BrandOwnershipRequestCreateDto`

```json
{
  "brandId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "ownershipType": 1,
  "expiryDate": "2026-12-31T23:59:59Z",
  "notes": "Yetkili satıcı sözleşmesi kapsamında başvuru"
}
```

| Alan          | Tip      | Zorunlu | Açıklama                          |
|---------------|----------|--------|-----------------------------------|
| brandId       | guid     | Evet   | Talep edilen marka kimliği       |
| ownershipType | enum     | Evet   | `BrandOwnershipType` (0=Owner, 1=AuthorizedReseller) |
| expiryDate    | datetime?| Hayır  | Yetki bitiş tarihi               |
| notes         | string   | Hayır  | Not (max 1000 karakter)          |

### Başarılı yanıt (200 OK)
```json
{
  "message": "Marka sahiplik talebiniz alındı."
}
```

### Hata yanıtları
- **400 Bad Request** — Model doğrulama hatası
```json
{
  "brandId": ["BrandId alanı zorunludur."],
  "ownershipType": ["OwnershipType alanı zorunludur."]
}
```

- **404 Not Found** — Marka bulunamadı
```json
{
  "message": "Belirtilen marka bulunamadı."
}
```

- **500 Internal Server Error**
```json
{
  "message": "Marka sahiplik talebi oluşturulurken bir hata oluştu."
}
```

---

## 5. Yeni marka oluşturma

**Method:** `POST`  
**Path:** `api/SellerBrand/create`  
**Content-Type:** `multipart/form-data`

### İstek (Request)
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- **Body (form-data):** `BrandCreateFormDto`

| Alan  | Tip        | Zorunlu | Açıklama              |
|-------|------------|--------|------------------------|
| name  | string     | Evet   | Marka adı (max 200)   |
| image | IFormFile? | Hayır  | Marka logosu (dosya)  |

**Örnek (curl):**
```bash
curl -X POST "https://api.example.com/api/SellerBrand/create" \
  -H "Authorization: Bearer <token>" \
  -F "name=Yeni Marka" \
  -F "image=@logo.png"
```

### Başarılı yanıt (201 Created)
Location header: ilgili kaynağa referans. Body: `BrandDto`

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "Yeni Marka",
  "slug": "yeni-marka",
  "status": 0,
  "lockStatus": 0,
  "defaultOwnerStoreId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "trademarkNumber": null,
  "imageUrl": "https://cdn.example.com/brands/3fa85f64.png",
  "verifiedAt": null,
  "createdAt": "2025-02-22T12:00:00Z",
  "updatedAt": null
}
```

| Alan                | Tip      | Açıklama                    |
|---------------------|----------|-----------------------------|
| id                  | guid     | Marka kimliği               |
| name                | string   | Marka adı                   |
| slug                | string   | URL slug                    |
| status              | enum     | `BrandStatus` (0=Pending)   |
| lockStatus          | enum     | `BrandLockStatus` (0=None)  |
| defaultOwnerStoreId | guid?    | Varsayılan sahip mağaza Id  |
| trademarkNumber     | string?  | Tescilli marka no           |
| imageUrl            | string?  | Logo URL                    |
| verifiedAt          | datetime?| Doğrulanma tarihi           |
| createdAt           | datetime | Oluşturulma tarihi         |
| updatedAt           | datetime?| Güncellenme tarihi         |

### Hata yanıtları
- **400 Bad Request** — Ad boş veya doğrulama/iş kuralı hatası
```json
{
  "message": "Marka adı boş bırakılamaz."
}
```

- **404 Not Found** — Mağaza bulunamadı
```json
{
  "message": "Mağaza bulunamadı."
}
```

- **500 Internal Server Error**
```json
{
  "message": "Marka oluşturulurken bir hata oluştu."
}
```

---

## Özet tablo

| # | Method | Path                          | Açıklama                          |
|---|--------|-------------------------------|------------------------------------|
| 1 | GET    | /api/SellerBrand/list         | Tüm marka adları listesi          |
| 2 | GET    | /api/SellerBrand              | Mağazanın marka yetkileri         |
| 3 | GET    | /api/SellerBrand/get-ownership| Mağazanın sahiplik başvuru durumları |
| 4 | POST   | /api/SellerBrand/ownership-request | Marka sahiplik talebi oluşturma |
| 5 | POST   | /api/SellerBrand/create       | Yeni marka oluşturma (multipart)  |

---

*Rapor, `SellerBrandController.cs` ve `Data.Dtos.Brands` / `Entity.Brands` tiplerine göre üretilmiştir.*
