import { useEffect, useMemo, useState } from "react";
import { getMyCompany } from "@/api/sellerCompanyService";
import { addExtraInfo, getMyExtraInfo } from "@/api/sellerCompanyExtraInfoService";
import { AlertTriangle, CheckCircle, Shield, Info } from "lucide-react";

const EMPTY = {
  mersisNumber: "",
  kepAddress: "",
  website: "",
  authorizedPersonName: "",
  authorizedPersonPhone: "",
  tradeRegistryNumber: "",
  chamberOfCommerce: "",
  foundationYear: "",
  naceCode: "",
  activityCode: "",
  companyScale: "",
};

// Boş değerleri payload'dan çıkar
const compact = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== "" && v !== null && v !== undefined)
  );

// Telefonu sadele (boşluk/tire sil, sadece + ve rakam)
const normalizePhone = (val = "") =>
  val.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, ""); // ortadaki +'ları temizle

export default function SellerExtraInfoPage() {
  const [company, setCompany] = useState(null);
  const [existing, setExisting] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const c = await getMyCompany();
        setCompany(c);
      } catch {}

      try {
        const info = await getMyExtraInfo();
        if (info && (info.id || info.companyId)) setExisting(info); // tek seferlik
      } catch {
        /* bilgi yok */
      }
    })();
  }, []);

  const requiredOk = useMemo(() => {
    const f = existing || form;
    return !!f.kepAddress?.trim() && !!f.authorizedPersonName?.trim() && !!f.authorizedPersonPhone?.trim();
  }, [existing, form]);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (existing) return;                 // güvenlik
    if (!company?.id) return setMsg("Şirket bulunamadı.");
    if (!requiredOk) return setMsg("Lütfen zorunlu alanları doldurun.");

    setMsg("Kaydediliyor...");

    try {
      const payload = {
        companyId: Number(company.id),
        kepAddress: form.kepAddress.trim(),
        authorizedPersonName: form.authorizedPersonName.trim(),
        authorizedPersonPhone: normalizePhone(form.authorizedPersonPhone),
        ...compact({
          mersisNumber: form.mersisNumber?.trim(),
          website: form.website?.trim(),
          tradeRegistryNumber: form.tradeRegistryNumber?.trim(),
          chamberOfCommerce: form.chamberOfCommerce?.trim(),
          foundationYear: form.foundationYear?.trim(), // API string bekliyor
          naceCode: form.naceCode?.trim(),
          activityCode: form.activityCode?.trim(),
          companyScale: form.companyScale?.trim(),
        }),
      };

      await addExtraInfo(payload);
      const info = await getMyExtraInfo();
      setExisting(info);
      setMsg("✔️ Ekstra bilgiler kaydedildi. Düzenleme kapatıldı.");
    } catch (err) {
      setMsg(`❌ ${err.message || "Kayıt sırasında hata oluştu."}`);
    }
  };

  const readOnly = !!existing;
  const model = existing || form;

  // Yardımcı UI bileşeni: Etiket + Input kapsayıcısı
  const Field = ({ label, required, children, hint }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700 select-none">
        {label} {required && <span className="text-rose-600">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );

  return (
    <div className="w-full py-6">
      {/* Üst başlık çubuğu - tam genişlik */}
      <div className="px-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-600/10 text-emerald-700">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Şirket Ekstra Bilgileri</h1>
            <p className="text-sm text-gray-600">Bir defaya mahsus doldurulur. Kayıt sonrası kilitlenir.</p>
          </div>
        </div>
      </div>

      {/* Bilgi kutusu */}
      <div className="px-6 mt-4">
        {!readOnly ? (
          <div className="flex items-start gap-2 text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <AlertTriangle className="w-5 h-5 mt-0.5" />
            <p>
              Bu bilgiler <b>tek seferlik</b> girilir ve kaydedildikten sonra <b>düzenlenemez</b>. Zorunlu alanlar:
              <i> KEP Adresi</i>, <i>Yetkili Kişi Adı</i>, <i>Yetkili Telefonu</i>.
            </p>
          </div>
        ) : (
          <div className="flex items-start gap-2 text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
            <CheckCircle className="w-5 h-5 mt-0.5" />
            <p>Bilgileriniz kaydedildi ve yalnızca görüntülenebilir.</p>
          </div>
        )}
      </div>

      {/* Form alanı – tam genişlik, kenardan kenara */}
      <form onSubmit={onSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-6">
        {/* Zorunlu alanlar */}
        <Field label="KEP Adresi" required>
          <input
            name="kepAddress"
            type="email"
            value={model.kepAddress || ""}
            onChange={onChange}
            placeholder="ornek@kep.tr"
            required
            disabled={readOnly}
            className={`input ${readOnly ? "bg-gray-100" : ""}`}
          />
        </Field>

        <Field label="Yetkili Kişi Adı" required>
          <input
            name="authorizedPersonName"
            value={model.authorizedPersonName || ""}
            onChange={onChange}
            placeholder="Ad Soyad"
            required
            disabled={readOnly}
            className={`input ${readOnly ? "bg-gray-100" : ""}`}
          />
        </Field>

        <Field label="Yetkili Telefonu" required hint="Uluslararası format önerilir: +905321234567">
          <input
            name="authorizedPersonPhone"
            type="tel"
            value={model.authorizedPersonPhone || ""}
            onChange={onChange}
            placeholder="+905xxxxxxxxx"
            required
            disabled={readOnly}
            className={`input ${readOnly ? "bg-gray-100" : ""}`}
          />
        </Field>

        {/* Opsiyonel alanlar */}
        <Field label="MERSİS No">
          <input name="mersisNumber" value={model.mersisNumber || ""} onChange={onChange} placeholder="1234567890123456" disabled={readOnly} className={`input ${readOnly ? "bg-gray-100" : ""}`} />
        </Field>

        <Field label="Web Sitesi">
          <input name="website" type="url" value={model.website || ""} onChange={onChange} placeholder="https://..." disabled={readOnly} className={`input ${readOnly ? "bg-gray-100" : ""}`} />
        </Field>

        <Field label="Ticaret Sicil No">
          <input name="tradeRegistryNumber" value={model.tradeRegistryNumber || ""} onChange={onChange} placeholder="Sicil No" disabled={readOnly} className={`input ${readOnly ? "bg-gray-100" : ""}`} />
        </Field>

        <Field label="Ticaret Odası">
          <input name="chamberOfCommerce" value={model.chamberOfCommerce || ""} onChange={onChange} placeholder="İl/oda" disabled={readOnly} className={`input ${readOnly ? "bg-gray-100" : ""}`} />
        </Field>

        <Field label="Kuruluş Yılı">
          <input name="foundationYear" value={model.foundationYear || ""} onChange={onChange} placeholder="örn: 2018" disabled={readOnly} className={`input ${readOnly ? "bg-gray-100" : ""}`} />
        </Field>

        <Field label="NACE Kodu">
          <input name="naceCode" value={model.naceCode || ""} onChange={onChange} placeholder="örn: 62.01" disabled={readOnly} className={`input ${readOnly ? "bg-gray-100" : ""}`} />
        </Field>

        <Field label="Faaliyet Kodu">
          <input name="activityCode" value={model.activityCode || ""} onChange={onChange} placeholder="Faaliyet Kodu" disabled={readOnly} className={`input ${readOnly ? "bg-gray-100" : ""}`} />
        </Field>

        <Field label="Şirket Ölçeği" hint="Örn: Mikro / Küçük / Orta / Büyük">
          <input name="companyScale" value={model.companyScale || ""} onChange={onChange} placeholder="Ölçek" disabled={readOnly} className={`input ${readOnly ? "bg-gray-100" : ""}`} />
        </Field>

        {/* Aksiyon satırı – tam genişlik */}
        {!readOnly && (
          <div className="xl:col-span-3 md:col-span-2 col-span-1 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 transition text-white py-3 rounded-xl disabled:opacity-60"
              disabled={!requiredOk}
            >
              Kaydet (Tek Seferlik)
            </button>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Info className="w-4 h-4" /> Kaydetmeden önce bilgilerinizi kontrol ediniz. Kayıt sonrası düzenleme yapılamaz.
            </p>
          </div>
        )}
      </form>

      {msg && (
        <div className="px-6">
          <p className="mt-4 text-sm text-gray-700">{msg}</p>
        </div>
      )}
    </div>
  );
}
