# Giriş Sonrası Header (Topbar) – Tasarım Yapısı

**Dosya:** `src/components/layout/Topbar.jsx`

Giriş (login) sonrası ekranda görünen üst çubuk **Topbar**'dır. Bu dokümanda yalnızca bu header'ın **içerik düzeni**, **hizalama**, **ana başlık** ve **alt başlık** yapısı anlatılır.

**İlişkili doküman:** `PROJE_MIMARISI_VE_TASARIM_SOZLESMESI.md` (genel mimari, CSS detayları, Sidebar, UserMenu).

---

## 1. Genel Yapı ve Hizalama

- **Tek satır:** Header tek bir yatay satırdan oluşur; içerik `flex items-center justify-between` ile **sol blok** ve **sağ blok** olarak ikiye ayrılır.
- **Dikey hizalama:** Tüm öğeler `items-center` ile satır ortasında hizalıdır.
- **Yatay boşluk:** Dış padding `px-3 sm:px-4 md:px-5`, dikey `py-2.5 sm:py-3 md:py-4` (ekran büyüdükçe artar).
- **Sol blok:** `flex-1` ve `min-w-0` ile kalan alanı kaplar, taşan metin kesilir.
- **Sağ blok:** `flex-shrink-0` ile küçülmez; içerik sığdığı kadar yer kaplar.

---

## 2. Sol Blok İçeriği (Sıra ve Hizalama)

Soldan sağa sıra:

1. **Menü butonu** (sadece mobil, `md:hidden`)  
   - Hamburger ikonu.  
   - Hizalama: Sol kenara yapışık, diğer öğelerle `gap-2 sm:gap-3 md:gap-4`.

2. **Logo/ikon kutusu** (`hidden sm:flex`)  
   - Kare kutu: `w-8 h-8 sm:w-10 sm:h-10`, `rounded-xl`, gradient arka plan, içinde "T".  
   - Başlıkla aynı hizada; arasında `gap-2 sm:gap-3`.

3. **Başlık alanı** (ana + alt başlık)  
   - Tek bir `div` içinde **dikey** hizalı iki metin:
     - **Ana başlık:** "Satıcı Paneli"
     - **Alt başlık:** "Profesyonel Satış Yönetimi"

---

## 3. Ana Başlık ("Satıcı Paneli")

- **Metin:** Sabit: **Satıcı Paneli**.
- **Görünüm:** Beyaz tonunda gradient metin: `bg-gradient-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent`.
- **Tipografi:**  
  - `font-extrabold`, `tracking-tight`, `select-none`, `drop-shadow-lg`.  
  - Responsive boyut: `text-lg sm:text-xl md:text-2xl lg:text-3xl` (ekran büyüdükçe büyür).
- **Taşma:** `truncate` ile uzun metin tek satırda kesilir; kutu `min-w-0` ile daralabilir.
- **Hizalama:** Sol blokta, logo/ikonun hemen sağında; blok içinde sola hizalı (default).

---

## 4. Alt Başlık ("Profesyonel Satış Yönetimi")

- **Metin:** Sabit: **Profesyonel Satış Yönetimi**.
- **Görünürlük:** Sadece orta ve büyük ekran: `hidden md:block` (mobil ve küçük tablette **gösterilmez**).
- **Tipografi:** `text-xs`, `font-medium`, renk `text-emerald-200/80`.
- **Konum:** Ana başlığın hemen altında; `mt-0.5` ile ana başlıktan kısa boşluk.
- **Hizalama:** Ana başlıkla aynı sol hizada; iki satır birlikte dikey blok oluşturur.

Özet: Ana başlık her zaman (sm ve üzeri) görünür; alt başlık yalnızca **md ve üzeri** breakpoint'te, ana başlığın altında tek satır olarak yer alır.

---

## 5. Sağ Blok İçeriği (Sıra ve Hizalama)

Sağdan sola (içerik sırası):

1. **"Başvuru Yap" linki**  
   - Yalnızca token yoksa gösterilir.  
   - Sağ blokta ilk öğe; diğer öğelerle `gap-2 sm:gap-3 md:gap-4`.

2. **Bildirim alanı** (`NotificationDropdown`)  
   - Token varken gösterilir.  
   - `flex-shrink-0` ile sabit genişlik.

3. **Kullanıcı metin bilgisi** (sadece büyük ekran)  
   - `hidden lg:flex flex-col leading-tight text-right`:  
     - Üst satır: kullanıcı adı (`font-bold text-white text-sm md:text-base`).  
     - Alt satır: e-posta (`text-xs text-emerald-200/80 font-medium`).  
   - **Hizalama:** `text-right` ile metinler sağa hizalı; avatar'ın solunda.

4. **UserMenu (avatar / dropdown)**  
   - Mağaza logosu veya initials ile avatar; tıklanınca menü açılır.  
   - Sağ blokta en sağda; `flex-shrink-0`.

Sağ blokta öğeler sağa doğru hizalı; avatar her zaman en sağ kenarda.

---

## 6. Özet: Header Tasarım Sözleşmesi

| Öğe | Konum | Hizalama | Görünürlük |
|-----|--------|----------|------------|
| Menü butonu | Sol, en baş | Dikey orta | Sadece mobil (`md:hidden`) |
| Logo/ikon | Sol, menüden sonra | Dikey orta | sm ve üzeri |
| **Ana başlık** | Sol, logodan sonra | Sola hizalı, dikey orta | Her zaman (sm+) |
| **Alt başlık** | Sol, ana başlığın altında | Sola hizalı | Sadece md ve üzeri |
| Başvuru Yap | Sağ | Sağa hizalı | Token yoksa |
| Bildirim | Sağ | Sağa hizalı | Token varken |
| Kullanıcı adı / e-posta | Sağ, avatarın solunda | **Sağa hizalı** (`text-right`) | Sadece lg ve üzeri |
| UserMenu (avatar) | Sağ, en sağ | Sağ kenar | Token varken |

Ana başlık ve alt başlık solda, tek bir blokta; sağ taraftaki metinler (kullanıcı adı, e-posta) sağa hizalıdır.
