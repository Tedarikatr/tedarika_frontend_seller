# Seller Product Draft API - Frontend Değişiklik Raporu

## 📋 İçindekiler
1. [Genel Bakış](#genel-bakış)
2. [Yeni Özellikler](#yeni-özellikler)
3. [Entity Değişiklikleri](#entity-değişiklikleri)
4. [Yeni Endpoint](#yeni-endpoint)
5. [Tüm Seller Endpoint'leri](#tüm-seller-endpointleri)
6. [Request/Response Örnekleri](#requestresponse-örnekleri)
7. [Breaking Changes](#breaking-changes)

---

## 🎯 Genel Bakış

Bu güncelleme ile aşağıdaki özellikler eklendi ve mevcut yapılar iyileştirildi:

- ✅ **Manuel Ürün Yükleme**: Excel, JSON, XML olmadan tek tek veya toplu ürün yükleme
- ✅ **Yeni Ürün Alanları**: Ana ürün kodu, stok kodu, kritik stok seviyesi
- ✅ **Paket Boyutları**: En, boy, yükseklik, ağırlık, desi bilgileri
- ✅ **Renk Varyantları**: Ürünlere renk varyantları ekleme desteği
- ✅ **Property İsimleri**: Tüm Türkçe property isimleri İngilizce'ye çevrildi

---

## 🆕 Yeni Özellikler

### 1. Manuel Ürün Yükleme
Artık Excel, JSON veya XML dosyası olmadan doğrudan API üzerinden ürün yüklenebilir. Bu özellik özellikle tek ürün veya az sayıda ürün yüklerken kullanışlıdır.

### 2. Gelişmiş Ürün Bilgileri
- **MainProductCode**: Ana ürün kodu
- **StockCode**: Stok kodu
- **CriticalStock**: Kritik stok seviyesi (stok bu seviyenin altına düştüğünde uyarı)

### 3. Detaylı Paket Boyutları
- **Width**: En (cm)
- **Length**: Boy (cm)
- **Height**: Yükseklik (cm)
- **Weight**: Ağırlık (kg)
- **VolumeWeight**: Desi (hacimsel ağırlık)

### 4. Renk Varyantları
Ürünlere birden fazla renk varyantı eklenebilir. Varyantlar sıralı bir şekilde saklanır.

---

## 🔄 Entity Değişiklikleri

### StoreProduct Entity
**Eski Property İsimleri → Yeni Property İsimleri:**
- `AnaUrunKodu` → `MainProductCode`
- `StokKodu` → `StockCode`
- `KritikStok` → `CriticalStock`

### StoreProductPackageDimension Entity
**Kaldırılan Property'ler:**
- `WeightKg`
- `WidthCm`
- `HeightCm`
- `LengthCm`

**Yeni Property'ler (Tümü nullable):**
- `Width` (decimal?)
- `Length` (decimal?)
- `Height` (decimal?)
- `Weight` (decimal?)
- `VolumeWeight` (decimal?)

---

## 🆕 Yeni Endpoint

### POST `/api/SellerProductDraft/add-product-manual`

Manuel olarak ürün taslakları oluşturur. Excel, JSON veya XML dosyası gerektirmez.

**Request Body:**
```json
{
  "draftName": "Manuel Ürün Yükleme - 2024",
  "products": [
    {
      "name": "Örnek Ürün",
      "sku": "SKU-001",
      "ean": "1234567890123",
      "brandId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "brandName": "Örnek Marka",
      "categoryId": 1,
      "categorySubId": 10,
      "gtip": "123456789012",
      "description": "Ürün açıklaması",
      "preparationTime": "2024-01-15T10:00:00Z",
      "expirationDate": "2025-01-15T10:00:00Z",
      "store": {
        "unitType": 0,
        "stockQuantity": 100,
        "minOrderQuantity": 1,
        "maxOrderQuantity": 50,
        "unitPrice": 150.50,
        "currencyCode": "TRY",
        "mainProductCode": "MAIN-001",
        "stockCode": "STOCK-001",
        "criticalStock": 20,
        "width": 30.5,
        "length": 40.0,
        "height": 25.0,
        "weight": 2.5,
        "volumeWeight": 3.2
      },
      "imageUrls": [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg"
      ],
      "colorVariants": [
        "Renk Beyaz",
        "Renk Siyah",
        "Renk Gri"
      ]
    }
  ]
}
```

**Response (200 OK):**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "draftId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "storeId": "8d4e6679-7425-40de-944b-e07fc1f90ae8",
    "productId": null,
    "name": "Örnek Ürün",
    "sku": "SKU-001",
    "ean": "1234567890123",
    "brandId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "brandName": "Örnek Marka",
    "categoryId": 1,
    "categorySubId": 10,
    "gtip": "123456789012",
    "description": "Ürün açıklaması",
    "preparationTime": "2024-01-15T10:00:00Z",
    "expirationDate": "2025-01-15T10:00:00Z",
    "stores": [
      {
        "id": "9e5f6679-7425-40de-944b-e07fc1f90ae9",
        "storeId": "8d4e6679-7425-40de-944b-e07fc1f90ae8",
        "storeProductId": null,
        "unitType": 0,
        "stockQuantity": 100,
        "minOrderQuantity": 1,
        "maxOrderQuantity": 50,
        "unitPrice": 150.50,
        "currencyCode": "TRY",
        "mainProductCode": "MAIN-001",
        "stockCode": "STOCK-001",
        "criticalStock": 20,
        "width": 30.5,
        "length": 40.0,
        "height": 25.0,
        "weight": 2.5,
        "volumeWeight": 3.2
      }
    ],
    "imageUrls": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "colorVariants": [
      "Renk Beyaz",
      "Renk Siyah",
      "Renk Gri"
    ],
    "status": 0,
    "rejectReason": "",
    "createdAt": "2024-01-15T10:00:00Z",
    "reviewedAt": null
  }
]
```

**Error Response (400 Bad Request):**
```json
{
  "error": "En az bir ürün bilgisi gereklidir."
}
```

---

## 📡 Tüm Seller Endpoint'leri

### Product Draft Endpoints

#### 1. GET `/api/SellerProductDraft/list-drafts`
Taslak konteynerlerini listeler.

**Response:**
```json
[
  {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "storeId": "8d4e6679-7425-40de-944b-e07fc1f90ae8",
    "name": "Manuel Ürün Yükleme - 2024",
    "productCount": 5,
    "createdAt": "2024-01-15T10:00:00Z"
  }
]
```

#### 2. GET `/api/SellerProductDraft/draft/{draftId}/products`
Belirli bir taslak içindeki ürünleri listeler.

**Response:**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "draftId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "storeId": "8d4e6679-7425-40de-944b-e07fc1f90ae8",
    "name": "Örnek Ürün",
    "brandName": "Örnek Marka",
    "categoryId": 1,
    "categorySubId": 10,
    "sku": "SKU-001",
    "ean": "1234567890123",
    "status": 0,
    "createdAt": "2024-01-15T10:00:00Z",
    "reviewedAt": null
  }
]
```

#### 3. GET `/api/SellerProductDraft/draft-product/{productDraftId}`
Ürün taslağının detaylarını getirir.

**Response:**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "draftId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "storeId": "8d4e6679-7425-40de-944b-e07fc1f90ae8",
  "productId": null,
  "name": "Örnek Ürün",
  "sku": "SKU-001",
  "ean": "1234567890123",
  "brandId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "brandName": "Örnek Marka",
  "categoryId": 1,
  "categorySubId": 10,
  "gtip": "123456789012",
  "description": "Ürün açıklaması",
  "preparationTime": "2024-01-15T10:00:00Z",
  "expirationDate": "2025-01-15T10:00:00Z",
  "stores": [
    {
      "id": "9e5f6679-7425-40de-944b-e07fc1f90ae9",
      "storeId": "8d4e6679-7425-40de-944b-e07fc1f90ae8",
      "storeProductId": null,
      "unitType": 0,
      "stockQuantity": 100,
      "minOrderQuantity": 1,
      "maxOrderQuantity": 50,
      "unitPrice": 150.50,
      "currencyCode": "TRY",
      "mainProductCode": "MAIN-001",
      "stockCode": "STOCK-001",
      "criticalStock": 20,
      "width": 30.5,
      "length": 40.0,
      "height": 25.0,
      "weight": 2.5,
      "volumeWeight": 3.2
    }
  ],
  "imageUrls": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "colorVariants": [
    "Renk Beyaz",
    "Renk Siyah",
    "Renk Gri"
  ],
  "status": 0,
  "rejectReason": "",
  "createdAt": "2024-01-15T10:00:00Z",
  "reviewedAt": null
}
```

#### 4. POST `/api/SellerProductDraft/add-product-json`
JSON formatında toplu ürün yükleme.

**Request Body:**
```json
[
  {
    "name": "Ürün 1",
    "sku": "SKU-001",
    "ean": "1234567890123",
    "stores": [
      {
        "unitType": 0,
        "stockQuantity": 100,
        "unitPrice": 150.50,
        "currencyCode": "TRY"
      }
    ]
  }
]
```

#### 5. POST `/api/SellerProductDraft/add-product-excel`
Excel dosyası ile toplu ürün yükleme.

**Request:** `multipart/form-data`
- `excelFile`: Excel dosyası (.xlsx, .xls)
- `uploadName`: (Opsiyonel) Yükleme adı

#### 6. POST `/api/SellerProductDraft/add-product-xml`
XML dosyası ile toplu ürün yükleme.

**Request:** `multipart/form-data`
- `xmlFile`: XML dosyası
- `uploadName`: (Opsiyonel) Yükleme adı

#### 7. POST `/api/SellerProductDraft/add-product-xml-from-url`
URL'den XML dosyası ile toplu ürün yükleme.

**Request Body:**
```json
{
  "xmlUrl": "https://example.com/products.xml",
  "uploadName": "Ürün XML Yükleme"
}
```

#### 8. POST `/api/SellerProductDraft/add-product-manual` ⭐ YENİ
Manuel ürün yükleme (Excel, JSON, XML gerektirmez).

**Request Body:** (Yukarıdaki "Yeni Endpoint" bölümüne bakın)

---

### Store Product Endpoints

#### 9. GET `/api/SellerStoreProduct/product-database-list-all`
Tüm ürün veritabanını listeler.

#### 10. GET `/api/SellerStoreProduct/my-products`
Satıcıya ait mağaza ürünlerini listeler.

**Response:**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "Örnek Ürün",
    "description": "Ürün açıklaması",
    "brandId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "brandName": "Örnek Marka",
    "unitTypes": 0,
    "unitType": 0,
    "unitTypeName": "Adet",
    "productNumber": "PROD-001",
    "sku": "SKU-001",
    "ean": "1234567890123",
    "gtipCode": "123456789012",
    "unitPrice": 150.50,
    "stockQuantity": 100,
    "minOrderQuantity": 1,
    "maxOrderQuantity": 50,
    "categoryId": 1,
    "categoryName": "Kategori",
    "categorySubId": 10,
    "categorySubName": "Alt Kategori",
    "isOnSale": true,
    "isActive": true,
    "productImageUrls": [],
    "storeProductImagesUrls": [],
    "packageDimension": {
      "width": 30.5,
      "length": 40.0,
      "height": 25.0,
      "weight": 2.5,
      "volumeWeight": 3.2
    },
    "prices": [],
    "priceTiers": []
  }
]
```

#### 11. POST `/api/SellerStoreProduct/{productId}/add`
Ürünü mağazaya ekler.

**Response:**
```json
{
  "message": "Ürün mağazaya başarıyla eklendi."
}
```

#### 12. PUT `/api/SellerStoreProduct/set-on-sale`
Ürünün satış durumunu günceller.

**Request Body:**
```json
{
  "storeProductId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "isOnSale": true
}
```

#### 13. PUT `/api/SellerStoreProduct/set-quantity-limits`
Min/Max sipariş miktarını günceller.

**Request Body:**
```json
{
  "storeProductId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "minQty": 1,
  "maxQty": 50
}
```

#### 14. PUT `/api/SellerStoreProduct/update-stock`
Stok miktarını günceller.

---

### Store Product Price Endpoints

#### 15. POST `/api/SellerStoreProductPrices/{storeProductId}/prices`
Ürün fiyatı oluşturur veya günceller.

**Request Body:**
```json
{
  "unitPrice": 150.50,
  "currencyCode": "TRY",
  "countryCode": "TR"
}
```

#### 16. GET `/api/SellerStoreProductPrices/{storeProductId}/prices`
Ürün fiyatlarını listeler.

#### 17. PUT `/api/SellerStoreProductPrices/{storeProductId}/prices/{storeProductPriceId}`
Ürün fiyatını günceller.

#### 18. DELETE `/api/SellerStoreProductPrices/{storeProductId}/prices/{storeProductPriceId}`
Ürün fiyatını siler.

---

### Store Product Price Tier Endpoints

#### 19. POST `/api/SellerStoreProductPriceTiers/{storeProductId}/prices/{storeProductPriceId}/tiers`
Fiyat kademelerini oluşturur veya günceller.

**Request Body:**
```json
[
  {
    "minQuantity": 10,
    "maxQuantity": 50,
    "unitPrice": 140.00
  },
  {
    "minQuantity": 51,
    "maxQuantity": 100,
    "unitPrice": 130.00
  }
]
```

#### 20. GET `/api/SellerStoreProductPriceTiers/{storeProductId}/prices/{storeProductPriceId}/tiers`
Fiyat kademelerini listeler.

---

## 📝 Request/Response Örnekleri

### Toplu Manuel Ürün Yükleme Örneği

**Request:**
```json
{
  "draftName": "Yeni Koleksiyon Ürünleri",
  "products": [
    {
      "name": "Klasik Gömlek",
      "sku": "GOMLEK-001",
      "ean": "1234567890123",
      "brandId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "categoryId": 1,
      "categorySubId": 10,
      "description": "Klasik kesim, %100 pamuk",
      "store": {
        "unitType": 0,
        "stockQuantity": 50,
        "minOrderQuantity": 1,
        "maxOrderQuantity": 20,
        "unitPrice": 299.99,
        "currencyCode": "TRY",
        "mainProductCode": "MAIN-GOMLEK-001",
        "stockCode": "STOCK-GOMLEK-001",
        "criticalStock": 10,
        "width": 35.0,
        "length": 45.0,
        "height": 3.0,
        "weight": 0.3,
        "volumeWeight": 0.5
      },
      "imageUrls": [
        "https://example.com/gomlek-1.jpg",
        "https://example.com/gomlek-2.jpg"
      ],
      "colorVariants": [
        "Renk Beyaz",
        "Renk Siyah",
        "Renk Mavi",
        "Renk Gri"
      ]
    },
    {
      "name": "Pantolon",
      "sku": "PANTOLON-001",
      "ean": "1234567890124",
      "brandId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "categoryId": 1,
      "categorySubId": 11,
      "description": "Klasik kesim pantolon",
      "store": {
        "unitType": 0,
        "stockQuantity": 30,
        "minOrderQuantity": 1,
        "maxOrderQuantity": 15,
        "unitPrice": 499.99,
        "currencyCode": "TRY",
        "mainProductCode": "MAIN-PANTOLON-001",
        "stockCode": "STOCK-PANTOLON-001",
        "criticalStock": 5,
        "width": 40.0,
        "length": 50.0,
        "height": 5.0,
        "weight": 0.5,
        "volumeWeight": 0.8
      },
      "imageUrls": [
        "https://example.com/pantolon-1.jpg"
      ],
      "colorVariants": [
        "Renk Siyah",
        "Renk Mavi",
        "Renk Kahverengi"
      ]
    }
  ]
}
```

**Response:**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "draftId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "storeId": "8d4e6679-7425-40de-944b-e07fc1f90ae8",
    "name": "Klasik Gömlek",
    "sku": "GOMLEK-001",
    "stores": [
      {
        "mainProductCode": "MAIN-GOMLEK-001",
        "stockCode": "STOCK-GOMLEK-001",
        "criticalStock": 10,
        "width": 35.0,
        "length": 45.0,
        "height": 3.0,
        "weight": 0.3,
        "volumeWeight": 0.5
      }
    ],
    "colorVariants": [
      "Renk Beyaz",
      "Renk Siyah",
      "Renk Mavi",
      "Renk Gri"
    ],
    "status": 0
  },
  {
    "id": "4fa85f64-5717-4562-b3fc-2c963f66afa7",
    "draftId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "storeId": "8d4e6679-7425-40de-944b-e07fc1f90ae8",
    "name": "Pantolon",
    "sku": "PANTOLON-001",
    "stores": [
      {
        "mainProductCode": "MAIN-PANTOLON-001",
        "stockCode": "STOCK-PANTOLON-001",
        "criticalStock": 5,
        "width": 40.0,
        "length": 50.0,
        "height": 5.0,
        "weight": 0.5,
        "volumeWeight": 0.8
      }
    ],
    "colorVariants": [
      "Renk Siyah",
      "Renk Mavi",
      "Renk Kahverengi"
    ],
    "status": 0
  }
]
```

---

## ⚠️ Breaking Changes

### Property İsim Değişiklikleri

Aşağıdaki property isimleri değiştirilmiştir. Frontend kodlarında güncelleme yapılmalıdır:

#### StoreProduct Entity
```javascript
// ❌ ESKİ
{
  anaUrunKodu: "MAIN-001",
  stokKodu: "STOCK-001",
  kritikStok: 20
}

// ✅ YENİ
{
  mainProductCode: "MAIN-001",
  stockCode: "STOCK-001",
  criticalStock: 20
}
```

#### StoreProductPackageDimension Entity
```javascript
// ❌ ESKİ (Kaldırıldı)
{
  weightKg: 2.5,
  widthCm: 30.5,
  heightCm: 25.0,
  lengthCm: 40.0,
  en: 30.5,
  boy: 40.0,
  yukseklik: 25.0,
  agirlik: 2.5,
  desi: 3.2
}

// ✅ YENİ
{
  width: 30.5,        // En
  length: 40.0,       // Boy
  height: 25.0,       // Yükseklik
  weight: 2.5,        // Ağırlık
  volumeWeight: 3.2   // Desi
}
```

### Response Yapısı Değişiklikleri

Tüm draft product response'larında artık `colorVariants` array'i bulunmaktadır:

```javascript
// ✅ YENİ
{
  "id": "...",
  "name": "Ürün Adı",
  "colorVariants": [
    "Renk Beyaz",
    "Renk Siyah"
  ],
  "stores": [
    {
      "mainProductCode": "...",
      "stockCode": "...",
      "criticalStock": 20,
      "width": 30.5,
      "length": 40.0,
      "height": 25.0,
      "weight": 2.5,
      "volumeWeight": 3.2
    }
  ]
}
```

---

## 🔧 Migration Kılavuzu

### 1. Property İsimlerini Güncelleme

```javascript
// Önceki kod
const product = {
  anaUrunKodu: data.anaUrunKodu,
  stokKodu: data.stokKodu,
  kritikStok: data.kritikStok
};

// Yeni kod
const product = {
  mainProductCode: data.mainProductCode,
  stockCode: data.stockCode,
  criticalStock: data.criticalStock
};
```

### 2. Paket Boyutlarını Güncelleme

```javascript
// Önceki kod
const dimensions = {
  en: data.en,
  boy: data.boy,
  yukseklik: data.yukseklik,
  agirlik: data.agirlik,
  desi: data.desi
};

// Yeni kod
const dimensions = {
  width: data.width,
  length: data.length,
  height: data.height,
  weight: data.weight,
  volumeWeight: data.volumeWeight
};
```

### 3. Renk Varyantlarını Ekleme

```javascript
// Yeni özellik
const product = {
  name: "Ürün Adı",
  colorVariants: [
    "Renk Beyaz",
    "Renk Siyah",
    "Renk Gri"
  ]
};
```

---

## 📊 Veri Tipleri

### UnitType Enum
```typescript
enum StoreProductUnitTypes {
  Adet = 0,
  Kg = 1,
  Litre = 2,
  Metre = 3,
  // ... diğer tipler
}
```

### ProductDraftStatus Enum
```typescript
enum ProductDraftStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  DuplicateEanSkipped = 3
}
```

---

## 🎨 Frontend Kullanım Örnekleri

### React/TypeScript Örneği

```typescript
interface DraftProductManualCreate {
  name: string;
  sku?: string;
  ean?: string;
  brandId?: string;
  brandName?: string;
  categoryId?: number;
  categorySubId?: number;
  gtip?: string;
  description?: string;
  preparationTime?: string;
  expirationDate?: string;
  store: {
    unitType: number;
    stockQuantity: number;
    minOrderQuantity: number;
    maxOrderQuantity?: number;
    unitPrice: number;
    currencyCode: string;
    mainProductCode?: string;
    stockCode?: string;
    criticalStock?: number;
    width?: number;
    length?: number;
    height?: number;
    weight?: number;
    volumeWeight?: number;
  };
  imageUrls?: string[];
  colorVariants?: string[];
}

interface DraftProductManualCreateRequest {
  draftName?: string;
  products: DraftProductManualCreate[];
}

// API çağrısı
const createManualDraft = async (request: DraftProductManualCreateRequest) => {
  const response = await fetch('/api/SellerProductDraft/add-product-manual', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(request)
  });
  
  if (!response.ok) {
    throw new Error('Ürün yükleme başarısız');
  }
  
  return await response.json();
};
```

### Vue.js Örneği

```javascript
// Component
export default {
  data() {
    return {
      product: {
        name: '',
        sku: '',
        store: {
          unitType: 0,
          stockQuantity: 0,
          minOrderQuantity: 1,
          unitPrice: 0,
          currencyCode: 'TRY',
          mainProductCode: '',
          stockCode: '',
          criticalStock: null,
          width: null,
          length: null,
          height: null,
          weight: null,
          volumeWeight: null
        },
        colorVariants: []
      }
    }
  },
  methods: {
    async submitProduct() {
      try {
        const response = await this.$http.post(
          '/api/SellerProductDraft/add-product-manual',
          {
            draftName: 'Manuel Yükleme',
            products: [this.product]
          }
        );
        this.$toast.success('Ürün başarıyla yüklendi');
      } catch (error) {
        this.$toast.error('Ürün yüklenirken hata oluştu');
      }
    }
  }
}
```

---

## 📌 Notlar

1. **Tüm yeni property'ler opsiyoneldir** (nullable), ancak bazıları iş mantığı açısından önemlidir.
2. **Renk varyantları** sıralı bir şekilde saklanır, frontend'de bu sırayı korumak önemlidir.
3. **Paket boyutları** kargo hesaplamaları için kullanılabilir.
4. **Kritik stok seviyesi** stok yönetimi için önemlidir.
5. **Manuel yükleme** endpoint'i Excel, JSON, XML yükleme limitlerinden bağımsızdır.

---

## 🔗 İlgili Dokümantasyon

- [Entity Değişiklikleri](./ENTITY_CHANGES.md)
- [API Swagger Dokümantasyonu](./swagger.json)
- [Migration Rehberi](./MIGRATION_GUIDE.md)

---

**Son Güncelleme:** 2024-01-15  
**Versiyon:** 2.0.0
