# Profil Sayfası: Tasarım ve İşlevsel Yapı Rehberi

Bu belge, satıcı panelindeki **Profil** bölümünün hem **tasarım yapısını** hem de **işlevsel yapısını** tanımlar. Aynı yapıyı başka bir frontend projesinde kurmak isteyen ekipler için referans dokümandır.

---

## 1. Tasarım Yapısı (Design Structure)

### 1.1 Genel Sayfa Düzeni

- **Sayfa konteyneri:** Tam genişlik, açık arka plan (`bg-[#f9fafa]` veya `from-gray-50 via-white to-gray-100`), yatay/dikey padding (`px-4 sm:px-6 lg:px-8 xl:px-16`, `py-6 sm:py-8 lg:py-10`).
- **İçerik genişliği:** Ana içerik `max-w-6xl mx-auto` ile ortalanır.
- **Bileşen hiyerarşisi:**
  1. **Hero / Başlık alanı** (üstte, gradient, tek blok)
  2. **Sekme navigasyonu** (hero içinde veya hemen altında)
  3. **İçerik alanı** (seçilen sekmeye göre tek bir “kart” bileşeni)

### 1.2 Hero Başlık Alanı

- **Görsel:** Gradient arka plan (`from-emerald-600 via-teal-600 to-green-600`), yuvarlatılmış köşeler (`rounded-2xl sm:rounded-3xl`), gölge (`shadow-2xl`).
- **Dekoratif öğeler:** Blur daireler (`bg-white/10 rounded-full blur-3xl`) sağ üst / sol alt gibi köşelerde; `pointer-events-none` ile tıklamayı engellemez.
- **İçerik:**
  - Ortada ikon (ör. `Award`) sarı-turuncu gradient kutu içinde.
  - Ana başlık: büyük, beyaz, kalın (`text-2xl` … `text-5xl`, `font-extrabold text-white`).
  - Alt açıklama: daha açık ton (`text-emerald-100`), tek satır veya kısa paragraf.
- **Sekmeler:** Hero’nun **içinde**, alt kısımda; butonlar yatay ve wrap olacak şekilde (`flex flex-wrap gap-2 sm:gap-3`).

### 1.3 Sekme (Tab) Navigasyonu

- **Görünüm:** Her sekme bir **buton**; ikon + metin.
- **Aktif sekme:** Beyaz arka plan, koyu metin (`bg-white text-emerald-700`), hafif büyütme (`scale-105`), gölge; isteğe bağlı sağda onay ikonu (`CheckCircle`).
- **Pasif sekme:** Yarı saydam beyaz (`bg-white/20`), beyaz metin, hover’da `bg-white/30`, `hover:scale-105`.
- **Responsive:** Küçük ekranda sadece ilk kelime gösterilebilir (`sm:hidden` / `hidden sm:inline`).
- **Stil sınıfları (örnek):**  
  `px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300`

### 1.4 İçerik Kartları (Tab Content)

- **Konteyner:** Her sekme için tek bir kart; `bg-white`, `border border-gray-200`, `rounded-2xl`, `shadow-sm`, `p-6`.
- **Kart başlığı:** Üstte border-bottom; sol tarafta ikon (küçük kutu içinde) + başlık + kısa açıklama; sağ tarafta aksiyon butonu (örn. “Bilgileri Güncelle”).
- **Alan gösterimi:** Grid (`grid-cols-1 sm:grid-cols-2`), label + value çiftleri; label gri küçük (`text-gray-500 text-sm`), value koyu (`text-gray-800`).
- **Durum etiketleri:** Yeşil/kırmızı/mavi/amber `rounded-full` badge’ler (`text-xs font-semibold px-2 py-1`).
- **Boş / hata durumu:** Çerçeveli kutu, ikon + mesaj, CTA butonu (örn. “Mağaza Oluştur”).
- **Alt bölümler:** Kart içinde `border-t pt-6` ile ayrılmış bloklar (örn. “Ekstra Bilgiler”, “Belgeler”).

### 1.5 Sidebar’da Profil Erişimi

- **Menü grubu:** “HESAP” gibi bir başlık altında.
- **Link:** `Settings` (veya benzeri) ikon + “Profil” metni, `/seller/profile` veya ilgili path’e gider.

### 1.6 Üst Bar Kullanıcı Menüsü (UserMenu)

- **Tetikleyici:** Avatar (mağaza logosu veya baş harfler), yuvarlak, hover’da hafif büyüme.
- **Dropdown:** Sağa hizalı, beyaz arka plan, gölge, yuvarlatılmış köşeler; üstte gradient header (kullanıcı adı + e-posta).
- **Profil alt menüsü:** Her profil bölümü bir satır (ikon + label + ChevronRight); tıklanınca ilgili sayfaya veya hash’e gider (örn. `#company`, `#store`).
- **Aktif öğe:** Arka plan ve sol border ile vurgu (`bg-emerald-50 border-l-4 border-emerald-600`).
- **En altta:** “Çıkış Yap” butonu, kırmızı vurgulu.

---

## 2. İşlevsel Yapı (Functional Structure)

### 2.1 Rota (Routing) Yapısı

| Rota | Bileşen | Açıklama |
|------|---------|----------|
| `/seller/profile` | `SellerProfilePage` | Ana profil sayfası; hash ile sekme seçimi |
| `/seller/profile#seller` | (aynı sayfa) | Varsayılan: Satıcı sekmesi |
| `/seller/profile#company` | (aynı sayfa) | Şirket sekmesi |
| `/seller/profile#store` | (aynı sayfa) | Mağaza sekmesi |
| `/seller/profile#subscription` | (aynı sayfa) | Abonelik sekmesi |
| `/seller/profile#finance` | (aynı sayfa) | Ödeme sekmesi |
| `/seller/profile#cargo` | (aynı sayfa) | Kargo Ayarları sekmesi |
| `/seller/profile#notifications` | (aynı sayfa) | İletişim Tercihleri sekmesi |
| `/seller/profile/extra-info` | `SellerExtraInfoPage` | Şirket ek bilgileri (ayrı sayfa) |
| `/seller/company-profile` | `CompanyUpdate` | Şirket bilgileri düzenleme formu |
| `/seller/company-documents` | `SellerCompanyDocuments` | Şirket belgeleri yönetimi |
| `/seller/store/create` | `StoreCreate` | Mağaza oluşturma |
| `/seller/store/update` | `StoreUpdate` | Mağaza güncelleme |

Profil sayfası **tek rota** (`/seller/profile`); sekme bilgisi **URL hash** ile taşınır (`#company`, `#store` vb.).

### 2.2 Sekme Tanımları ve Bileşen Eşlemesi

Sabit bir **TABS** dizisi kullanılır; her öğe: `key`, `label`, `icon`.

| key | label | Gösterilen bileşen |
|-----|--------|---------------------|
| `seller` | Satıcı | `SellerInfoCard` |
| `company` | Şirket | `CompanyInfoCard` |
| `store` | Mağaza | `StoreInfoCard` |
| `subscription` | Abonelik | `SubscriptionPlans` |
| `finance` | Ödeme | `SellerFinanceInfoCard` |
| `cargo` | Kargo Ayarları | `ShippingSettingsCard` |
| `notifications` | İletişim Tercihleri | `BulletinPreferencesCard` |

Sayfa state’inde **activeTab** (string) tutulur; `renderActiveCard()` veya benzeri bir fonksiyon `activeTab`’a göre yukarıdaki bileşenlerden birini döner.

### 2.3 Hash ile Sekme Senkronizasyonu

- **Sayfa yüklendiğinde / hash değiştiğinde:** `location.hash` okunur, `#` kaldırılır; kalan değer TABS içinde varsa `activeTab` buna set edilir.
- **Sekme butonuna tıklanınca:** Önce `setActiveTab(tab.key)`; sonra `window.history.replaceState(null, "", \`/seller/profile#${tab.key}\`)` ile URL güncellenir (sayfa yenilenmeden).
- **Dışarıdan link (örn. UserMenu):** `/seller/profile#company` gibi bir path + hash ile navigate; sayfa açıldıktan sonra hash’e göre sekme zaten seçilir. İsteğe bağlı: sayfa zaten açıksa **CustomEvent** ile `profile-tab-change` tetiklenir, `detail.tab` ile doğru sekme seçilir.

### 2.4 Dış Navigasyon ve Geri Bildirim

- **Şirket güncellemeden dönüş:** `CompanyUpdate` işlem sonrası `navigate("/seller/profile#company", { state: { companyUpdated: true }, replace: true })` yapar. Profil sayfasında `location.state?.companyUpdated` kontrol edilir; true ise toast/success mesajı gösterilir, `company` sekmesi açılır, state temizlenir (`replace: true` ile).
- **UserMenu’den sekme seçimi:** Menü öğesi `path: "/seller/profile#company"` gibi. Tıklanınca `navigate(path)`; path’te `#` varsa navigate sonrası `window.location.hash = hash` ve `window.dispatchEvent(new CustomEvent("profile-tab-change", { detail: { tab: hash } }))` ile profil sayfasındaki `activeTab` güncellenir.

### 2.5 Kart Bileşenlerinin Sorumlulukları

- **SellerInfoCard:** Satıcı profil API’sinden veri çeker; salt okunur alanlar (ad, e-posta, telefon, şirket/mağaza/abonelik durumu) gösterir.
- **CompanyInfoCard:** Şirket + ek bilgi + belge listesi API’lerini çağırır; “Bilgileri Güncelle” → `/seller/company-profile`, “Ekstra Bilgiler” → `/seller/profile/extra-info`, “Tüm Belgeleri Yönet” → `/seller/company-documents`.
- **StoreInfoCard:** Mağaza API’sinden veri çeker; mağaza yoksa “Mağaza Oluştur” ile `/seller/store/create`, varsa “Bilgileri Güncelle” ile `/seller/store/update`.
- **SellerFinanceInfoCard:** Ödeme profili getir/kaydet; IBAN vb. alanlar; mağaza yoksa yönlendirme veya mesaj.
- **ShippingSettingsCard:** Gönderici adresi getir/kaydet; form + kaydet butonu; mağaza yoksa bilgi/CTA.
- **BulletinPreferencesCard:** İletişim tercihleri (e-posta, SMS, WhatsApp) getir/güncelle; toggle’lar + “Kaydet”.
- **SubscriptionPlans:** Abonelik planları listesi ve seçim/kurulum (içerik projeye özel).

### 2.6 Ortak Veri ve Erişim

- **Auth:** Profil sayfası ve kartlar korumalı rota altındadır; kullanıcı oturumu varsayılır.
- **API servisleri:** Her kart kendi servisini import eder (örn. `getSellerProfile`, `getMyCompany`, `getMyStore`, `getPayoutProfile`, `getSellerBulletinPreferences`, `getSenderAddress`). Veri kendi state’inde (useState); yükleme/hata durumları kart içinde yönetilir.
- **Layout:** Profil sayfası, satıcı paneli layout’u (sidebar + header) içinde render edilir; layout’ta UserMenu ve Sidebar’daki “Profil” linki bu yapıyı kullanır.

---

## 3. Başka Bir Projede Uygulama Özeti

1. **Tek profil sayfası** tanımla; üstte hero + sekme navigasyonu, altta tek bir içerik alanı.
2. **Sekmeleri** sabit bir diziden oku; her sekme için bir **key** ve bir **kart bileşeni** eşle.
3. **URL hash** ile sekme seçimini senkronize et; sayfa yüklemede ve sekme tıklamada hash’i güncelle.
4. **UserMenu / sidebar** ile `/seller/profile#<key>` linklerini kullan; gerekirse CustomEvent ile açık olan profil sayfasında sekme değiştir.
5. **Kart bileşenlerini** modüler tut: her biri kendi API çağrıları ve yerel state’i; güncelleme için ayrı sayfalara (company-profile, store/update vb.) yönlendir.
6. **Tasarım token’ları** (renk, yuvarlaklık, gölge, spacing) yukarıdaki örnek sınıflarla uyumlu tutarak aynı görsel dili kurabilirsiniz.

Bu yapı hem tasarım hem işlev olarak tek sayfa üzerinde sekme tabanlı profil deneyimini tanımlar; kullanıcı, şirket, mağaza, ödeme, kargo ve bildirim tercihleri tek yerden erişilir ve hash ile doğrudan linklenebilir.
