# Marka Yönetimi — API Uyumluluk ve UX Analizi

**Tarih:** 22.02.2025  
**Referans:** `SellerBrandController.API.Report.md`

---

## 1. API Uyumluluğu

### Endpoint eşleşmeleri

| API Raporu | Frontend (`src/api/brandservice.js`) | Durum |
|------------|--------------------------------------|--------|
| `GET api/SellerBrand/list` | `getBrandList()` → `SellerBrand/list` | ✅ |
| `GET api/SellerBrand` | `getOwnedBrands()` → `SellerBrand` | ✅ |
| `GET api/SellerBrand/get-ownership` | `getBrandOwnership()` → `SellerBrand/get-ownership` | ✅ |
| `POST api/SellerBrand/ownership-request` | `requestBrandOwnership(data)` → `SellerBrand/ownership-request` | ✅ |
| `POST api/SellerBrand/create` (multipart) | `createBrand(formData)` → `SellerBrand/create` | ✅ |

### Veri modelleri

- **BrandNameDto:** `id`, `name`, `imageUrl` — liste sayfasında kullanılıyor. ✅  
- **BrandOwnershipDto / BrandOwnershipStatusDto:** `id`, `brandId`, `brandName`, `storeId`, `ownershipType`, `status`, `requestedAt`, `approvedAt`, `revokedAt`, `expiryDate`, `notes` — bileşenler bu alanlarla uyumlu. ✅  
- **ownership-request body:** `brandId`, `ownershipType`, `expiryDate?`, `notes?` — `OwnershipRequestModal` aynı yapıda gönderiyor. ✅  
- **create form-data:** Rapor `name`, `image` diyor; .NET tarafında genelde PascalCase (`Name`, `Image`) kullanıldığı için frontend `Name` ve `Image` gönderiyor. Backend PascalCase bekliyorsa uyumlu. ✅  

### Enum uyumu

- **BrandOwnershipStatus:** 0 Pending, 1 Approved, 2 Rejected, 3 Revoked, 4 Expired — `brandEnums.js` ve API aynı. ✅  
- **BrandOwnershipType:** 0 Owner, 1 AuthorizedReseller — aynı. ✅  
- **BrandStatus / BrandLockStatus:** Sabitler API ile uyumlu (marka detay/başka ekranlarda kullanılabilir). ✅  

**Sonuç:** Marka yönetimi akışı mevcut API ile uyumlu.

---

## 2. Onay / Red / Beklemede — Renk ve Etiketler (UX)

Kullanıcı deneyimi için tüm durumlar **Türkçe** ve **ortak renk paleti** ile gösteriliyor:

| Durum (API) | Türkçe etiket | Renk (badge/kart) |
|-------------|----------------|-------------------|
| 0 Pending   | **Beklemede**  | Amber/turuncu (`bg-amber-100 text-amber-800 border-amber-300`) |
| 1 Approved  | **Onaylı**     | Yeşil (`bg-green-100 text-green-800 border-green-300`) |
| 2 Rejected  | **Reddedildi** | Kırmızı (`bg-red-100 text-red-800 border-red-300`) |
| 3 Revoked   | **İptal**      | Gri (`bg-gray-100 text-gray-800 border-gray-300`) |
| 4 Expired   | **Süresi Dolmuş** | Turuncu (`bg-orange-100 text-orange-800 border-orange-300`) |

Sahiplik tipi:

- **Sahip** → mavi badge  
- **Yetkili Satıcı** → mor badge  

### Güncellenen bileşenler

1. **`src/constants/brandEnums.js`**  
   - `BrandOwnershipStatusDisplay`: Her status için Türkçe `label`, `color`, `colorCard`.  
   - `BrandOwnershipTypeTr`: Sahip / Yetkili Satıcı.  
   - `getBrandOwnershipStatusDisplay(status)`: Sayı veya string status’u normalize edip tek yerden renk ve etiket almak için.

2. **`BrandCard.jsx`**  
   - Durum: `getBrandOwnershipStatusDisplay` ile Türkçe etiket + renk.  
   - “Beklemede” başvurusu olan kartlarda buton amber/turuncu vurgulu.

3. **`OwnershipStatusSection.jsx`**  
   - Başvuru durumları listesinde her satır ilgili renkte badge ve Türkçe etiket.

4. **`OwnedBrandsSection.jsx`**  
   - “Sahip Olduklarım” kartları duruma göre renkli arka plan (`colorCard`): Onaylı = yeşil, Beklemede = amber, Reddedildi = kırmızı, vb.  
   - Kart ikonu rengi de duruma göre (yeşil/amber/kırmızı/gri).

5. **`OwnershipRequestModal.jsx`**  
   - Sahiplik tipi seçenekleri Türkçe: “Sahip”, “Yetkili Satıcı”.

---

## 3. Kısa Özet

- **API:** Mevcut marka yönetimi endpoint’leri ve veri modelleri frontend ile uyumlu.  
- **UX:** Onay (yeşil), red (kırmızı), beklemede (amber), iptal (gri), süresi dolmuş (turuncu) tutarlı ve Türkçe etiketlerle kullanılıyor; “Sahip Olduklarım” kartları da duruma göre renklendirildi.

İstersen bir sonraki adımda belirli bir ekran veya akışı (örn. sadece başvuru listesi veya sadece kartlar) birlikte gözden geçirebiliriz.
