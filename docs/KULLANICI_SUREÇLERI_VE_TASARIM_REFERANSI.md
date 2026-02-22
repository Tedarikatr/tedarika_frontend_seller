# Tedarika Satıcı Paneli – Kullanıcı Süreçleri ve Tasarım Referansı

Bu doküman, **ilk kayıt / kayıtlı kullanıcı akışları**, **tasarım / CSS yapısı** ve **header / sayfa içerik yapısı**nı mobil referans için özetler.

**Mimari ve tasarım sözleşmesi:** Giriş öncesi/sonrası header, layout, klasör yapısı ve bileşen/CSS detayları için **`PROJE_MIMARISI_VE_TASARIM_SOZLESMESI.md`** dokümanına bakın. O doküman, projeyi okuyan bir yapay zekanın aynı mimariyi tasarlayabilmesi için yazılmıştır.

---

## 1. Kullanıcı Süreçleri (Kayıt ve Kayıtlı Kullanıcı)

### 1.1 Genel Akış Özeti

```
[Landing] → Kayıt Ol → [Login] → Giriş → [Dashboard]
                              ↓
                    Şirket yok mu? → [Şirket Oluştur] (Company Create)
                              ↓
                    [Dashboard] + (Mağaza yoksa uyarı)
                              ↓
                    Mağaza Oluştur → [Store Create] → [Profil#store]
```

### 1.2 İlk Kayıt (Yeni Kullanıcı)

| Adım | Sayfa / Aksiyon | Açıklama |
|------|------------------|----------|
| 1 | **Landing** (`/seller/landing`) | Kullanıcı "Kayıt Ol" ile kayıt sayfasına gider. |
| 2 | **Kayıt** (`/seller/register`) | Ad, soyad, e-posta, telefon, şifre alanları doldurulur. `registerSeller()` çağrılır. |
| 3 | Kayıt sonrası | Başarı mesajı gösterilir; ~1.5 saniye sonra **Giriş sayfasına** yönlendirilir. |
| 4 | **Giriş** (`/seller/login`) | E-posta/telefon ve şifre ile `loginSeller()` yapılır. Token ve `features` localStorage’a yazılır. |
| 5 | Giriş sonrası | `navigate("/seller/dashboard")` ile Dashboard’a gidilir. |
| 6 | **PrivateRoute + SellerRouteWrapper** | Token ve `UserType === "Seller"` kontrolü. Şirket yoksa **şirket oluşturma sayfasına** yönlendirilir. |
| 7 | **Şirket Oluştur** (`/seller/company/create`) | Layout **yok** (sidebar/topbar gösterilmez). Şirket adı, vergi no, vergi dairesi, il, adres, şirket tipi doldurulur. `createCompany()` sonrası `navigate("/seller/dashboard")`. |
| 8 | **Dashboard** (layout ile) | Şirket artık var. `getMyStore()` ile mağaza kontrol edilir. Mağaza yoksa **“Mağaza oluştur”** bildirimi (sarı banner) gösterilir. |
| 9 | **Mağaza Oluştur** (`/seller/store/create`) | Kullanıcı bildirimdeki "Mağaza Oluştur" veya Profil → Mağaza sekmesindeki "Mağaza Oluştur" ile bu sayfaya gider. Mağaza adı, açıklama, logo (zorunlu), banner, kategoriler doldurulur. `createStore()` sonrası `navigate("/seller/profile#store")`. |
| 10 | **Profil – Mağaza** (`/seller/profile#store`) | Mağaza bilgileri görüntülenir veya güncelleme yapılır. |

**Özet:** İlk kayıtta sıra: **Kayıt → Giriş → (Otomatik) Şirket Oluştur → Dashboard → (İsteğe bağlı) Mağaza Oluştur → Profil/Mağaza.**

### 1.3 Zorunlu / İstisna Yolları (SellerRouteWrapper)

- **Şirket kontrolü:** `hasCompany()` false ise kullanıcı **`/seller/company/create`** sayfasına yönlendirilir.
- **İstisna yollar (yönlendirme yapılmaz):**
  - `/seller/company/create`
  - `/seller/profile/extra-info`sadas
  - `/seller/company-documents`
- **Layout’suz sayfa:** Sadece `/seller/company/create` — bu sayfada Sidebar ve Topbar **gösterilmez**.

### 1.4 Kayıtlı Kullanıcı (Şirket + Mağaza Var)

| Durum | Davranış |
|-------|----------|
| Giriş | Token geçerli, `UserType === "Seller"` → Dashboard veya istediği korumalı sayfaya gidebilir. |
| Şirket var | SellerRouteWrapper şirket oluşturmaya yönlendirmez; layout (Sidebar + Topbar) ile sayfalar açılır. |
| Mağaza var | “Mağaza oluştur” bildirimi çıkmaz. |
| Mağaza yok | Layout üstünde sarı uyarı: “Henüz bir mağazanız yok. Satışa başlayabilmek için bir mağaza oluşturmalısınız.” → "Mağaza Oluştur" ile `/seller/store/create`. |
| Abonelik / sistem aktif değil | Layout’ta içerik soluklaştırılır; tam ekran overlay ile “Erişiminiz Sınırlı” mesajı ve “Profil Sayfasına Git” butonu gösterilir. Profil sayfası erişilebilir kalır. |

### 1.5 Abonelik (SemiPrivateRoute)

- **Rota:** `/seller/subscription`
- Giriş yoksa → `/seller/login`.
- Giriş var ama abonelik **aktifse** → `/seller/dashboard`’a yönlendirilir.
- Sadece giriş yapmış ve aboneliği olmayan kullanıcı abonelik sayfasını görür.

### 1.6 Özet Tablo (Yönlendirmeler)

| Olay | Hedef |
|------|--------|
| Kayıt başarılı | `/seller/login` |
| Giriş başarılı | `/seller/dashboard` |
| Şirket yok (koruma altındaki sayfada) | `/seller/company/create` |
| Şirket oluşturuldu | `/seller/dashboard` |
| Mağaza oluşturuldu | `/seller/profile#store` |
| Token yok / Seller değil | `/seller/login` (state: sessionExpired) |

---

## 2. Tasarım ve CSS Yapısı

### 2.1 Teknolojiler

- **Tailwind CSS** (utility-first)
- **tailwindcss-animate** eklentisi
- **Global stiller:** `src/index.css` (Tailwind base/components/utilities + özel sınıflar)

### 2.2 Tailwind Konfigürasyonu

```js
// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [require("tailwindcss-animate")],
};
```

Tema genişletmesi yok; renk ve spacing doğrudan utility sınıfları ile (örn. `emerald-600`, `teal-600`, `#003131`) kullanılıyor.

### 2.3 Renk Paleti (Projede Kullanılan)

| Kullanım | Sınıf / Değer | Açıklama |
|----------|----------------|----------|
| Marka koyu | `#003131`, `#003032`, `#002829`, `#001e1e` | Header, sidebar, buton arka planı |
| Marka yeşil | `emerald-500/600/700`, `teal-600` | Vurgu, butonlar, aktif durum |
| Arka plan (açık) | `from-indigo-50 via-purple-50 to-white`, `bg-[#f9fafa]` | Sayfa arka planı |
| Form / kart | `bg-[#0e1a2b]`, `bg-[#13263d]`, `from-[#003b4a] to-[#00292f]` | Company Create koyu tema |
| Başarı / bilgi | `green-100`, `emerald-100` | Badge, ikon arka planı |
| Uyarı | `yellow-400/500`, `yellow-100` | Mağaza uyarı banner’ı |
| Hata / iptal | `red-500`, `rose-600` | Hata mesajı, çıkış butonu |

### 2.4 Global CSS (index.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Genel input stili */
.input {
  @apply w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500;
}

/* Animasyon: yukarıdan aşağı fade */
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-down {
  animation: fadeInDown 200ms ease-out;
}

/* Modal / overlay blur */
.modal-backdrop-blur {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

/* Belirsiz progress bar */
.progress-indeterminate::after {
  /* ... gradient bar, translateX animasyonu */
}

/* Tablo / yatay kaydırma (mobil touch) */
.table-scroll-touch {
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}

/* Scrollbar gizle (mobil nav vb.) */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

### 2.5 Sayfa Yapısı Örnekleri (Mobil Uyumlu)

**Hero / sayfa başlığı (Profil, Mağaza Oluştur vb.):**

```jsx
<header className="mb-6 sm:mb-8 relative bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-2xl sm:rounded-3xl shadow-2xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 text-center overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
  <div className="relative z-10">
    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
      Sayfa Başlığı
    </h1>
    <p className="text-emerald-100 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
      Açıklama metni
    </p>
  </div>
</header>
```

**İçerik sarmalayıcı (padding / max-width):**

```jsx
<div className="min-h-screen bg-[#f9fafa] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
  <main className="max-w-6xl mx-auto">
    {/* sayfa içeriği */}
  </main>
</div>
```

**Kart (beyaz, gölge, yuvarlak köşe):**

```jsx
<div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
  {/* kart içeriği */}
</div>
```

**Form input (marka renkleri):**

```jsx
<div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#f0fdfa] border border-[#bde7e3] focus-within:ring-2 ring-[#00d18c] transition">
  <input
    className="w-full bg-transparent outline-none text-[#003636] placeholder-[#7aa5a2]"
    placeholder="..."
  />
</div>
```

**Birincil buton:**

```jsx
<button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition">
  Kaydet
</button>
```

**Mobil: touch alanı ve font boyutu:**

- Butonlar: `min-h-[44px]`, `min-w-[44px]` veya `py-3` gibi yeterli tıklanır alan.
- Metin: `text-sm sm:text-base`, `text-xs sm:text-sm` ile kırılım.

---

## 3. Header ve Sayfa İçerik Yapısı

### 3.1 İki Header Türü

| Konum | Bileşen | Kullanıldığı Yer |
|-------|---------|-------------------|
| Landing / Login / Register | `SellerHeader` | `src/components/sellerLanding/SellerHeader.jsx` |
| Satıcı paneli (giriş sonrası) | `Topbar` | `src/components/layout/Topbar.jsx` |

### 3.2 SellerHeader (Landing / Public Sayfalar)

- **Arka plan:** `bg-[#003032]`, `border-b border-white/10`
- **İçerik:**
  - Logo (sol), masaüstünde nav (Anasayfa, Fiyatlar, Satıcı Merkezi dropdown, Destek dropdown), sağda “Kayıt Ol” / “Giriş Yap”
  - Mobilde: hamburger menü (`lg:hidden`), açılınca tam ekran overlay + panel (logo altından, `mt-[72px]`)
- **Mobil menü:** `min-h-[48px]` link/butonlar, `touch-manipulation`, `safe-area-inset-bottom` ile alt boşluk.

### 3.3 Topbar (Satıcı Paneli – Giriş Sonrası)

- **Konum:** `SellerLayout` içinde, sabit üst: `sticky top-0 z-50`
- **Stil:** `bg-gradient-to-r from-[#003131] via-[#004040] to-[#003131]`, `border-b-2 border-emerald-500/30`
- **Sol:**
  - Mobil: Menü butonu (`md:hidden`) → Sidebar’ı açar.
  - Logo/ikon (T) + “Satıcı Paneli” başlığı; masaüstünde alt satırda “Profesyonel Satış Yönetimi”.
- **Sağ:**
  - Token yoksa: “Başvuru Yap” linki (`/seller/apply`).
  - Token varsa: `NotificationDropdown`, kullanıcı adı/e-posta (lg’de), `UserMenu` (avatar: mağaza logosu veya initials).

**UserMenu dropdown:**

- Mağaza logosu veya initials ile tetiklenir.
- Öğeler: Satıcı Bilgileri, Şirket Bilgileri, Mağaza Bilgileri, Abonelik, Ödeme, Kargo Ayarları, İletişim Tercihleri (hepsi `/seller/profile` veya `#hash`), sonra “Çıkış Yap”.
- Hash ile tab değişimi: `profile-tab-change` custom event ile Profil sayfasında ilgili sekme açılır.

### 3.4 Sidebar (Satıcı Paneli)

- **Stil:** `bg-gradient-to-b from-[#003131] to-[#001e1e]`, `text-white`
- **Mobil:** `fixed`, sol dışarıda; açıkken `translate-x-0`, kapalıyken `-translate-x-full`. `md:` ve üzeri normal akışta (`static`).
- **İçerik grupları:**
  - Anasayfa → `/seller/dashboard`
  - MAĞAZA YÖNETİMİ: Lokasyonlarım, Markalarım
  - ÜRÜNLER: Ürünlerim, Ürün Kataloğu, Ürün Yükleme
  - İŞLEMLER: Siparişler, İade Talepleri, Teklifler, Kampanyalarım, Yorumlar
  - RAPORLAR: Satış Raporları
  - HESAP: Profil
  - Alt: Çıkış butonu
- **Collapse:** Masaüstünde sidebar daraltılabilir (`w-64` ↔ `w-20`); dar modda sadece ikonlar görünür.

### 3.5 Ana İçerik Alanı (Layout)

```jsx
<main
  ref={mainRef}
  className="flex-1 overflow-y-auto px-4 md:px-6 py-4 bg-white/60 backdrop-blur-2xl rounded-tl-2xl shadow-inner ..."
>
  <Outlet />
</main>
```

- Kısıtlı erişimde: `pointer-events-none opacity-40 blur-sm` ile soluklaştırma; üstte overlay ve “Profil Sayfasına Git” butonu.

### 3.6 Sayfa İçerik Kalıbı (Mobil Referans)

1. **Üst boşluk:** `py-6 sm:py-8` veya `py-4` (sayfaya göre).
2. **Yatay boşluk:** `px-4 sm:px-6 lg:px-8` (container’da).
3. **Başlık bloğu:** Hero isteniyorsa gradient header (yukarıdaki örnek); değilse `text-2xl sm:text-3xl font-bold text-gray-800`.
4. **İçerik:** `max-w-6xl` veya `max-w-4xl mx-auto` ile ortalama.
5. **Liste / tablo:** Yatay kaydırma için `overflow-x-auto`, `table-scroll-touch` veya `scrollbar-hide`.
6. **Sabit bildirim (mağaza uyarısı):** `fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[9999] w-[95%] sm:w-90% max-w-lg` — mobilde tam genişlik değil, yanlardan boşluk bırakılır.

---

## 4. Mobil Referans Özeti

| Konu | Öneri |
|------|--------|
| Dokunma alanı | Buton/link: en az `min-h-[44px]` veya eşdeğer padding. |
| Font | Küçük metin: `text-xs sm:text-sm`; gövde: `text-sm sm:text-base`. |
| Header (Topbar) | Sol: menü + başlık; sağ: bildirim + avatar. Mobilde kullanıcı adı/e-posta `hidden lg:flex` ile gizlenir. |
| Sidebar | Mobilde overlay + panel; kapatma X veya dışarı tıklama. |
| Sayfa padding | `px-4 sm:px-6`, `py-4` veya `py-6 sm:py-8`. |
| Tablolar | `overflow-x-auto` + `table-scroll-touch` veya `scrollbar-hide`. |
| Profil sekmeleri | Küçük ekranda `flex-wrap gap-2`, kısa etiket kullanımı (örn. “Satıcı” tek kelime). |
| UserMenu dropdown | Genişlik: `w-[calc(100vw-2rem)] sm:w-64` — mobilde neredeyse tam genişlik. |

Bu doküman, mevcut koda göre hazırlanmıştır; yeni sayfa veya bileşen eklerken aynı rota kuralları, layout ve sınıf kalıpları kullanılarak mobil deneyim tutarlı tutulabilir.
