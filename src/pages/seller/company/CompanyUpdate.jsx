// src/pages/seller/company/CompanyUpdate.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyCompany, updateCompany } from "@/api/sellerCompanyService";
import TaxOfficeSelect from "@/components/seller/TaxOfficeSelect";
import { Building2, Loader2, CheckCircle, AlertTriangle, Sparkles, FileText } from "lucide-react";
import { motion } from "framer-motion";

// Raporda type number: 1=Şahıs, 2=Limited, 3=Anonim, 4=Kooperatif, 5=Şube, 6=Yabancı, 99=Diğer
const COMPANY_TYPE_SAHIS = 1;

const companyTypeOptions = [
  { value: 1, label: "Şahıs Şirketi" },
  { value: 2, label: "Limited Şirket" },
  { value: 3, label: "Anonim Şirket" },
  { value: 4, label: "Kooperatif" },
  { value: 5, label: "Şube" },
  { value: 6, label: "Yabancı Şirket" },
  { value: 99, label: "Diğer" },
];

const Field = ({ label, required, children, hint }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
      <FileText className="w-4 h-4 text-emerald-600" />
      {label} {required && <span className="text-rose-600">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-500 italic">{hint}</p>}
  </div>
);

export default function CompanyUpdate() {
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyCompany();
        // API type number döner; string gelirse 1=Şahıs vb. map ile sayıya çevir
        const str2num = { SoleProprietorship: 1, Limited: 2, JointStock: 3, Cooperative: 4, BranchOffice: 5, ForeignCompany: 6, Other: 99 };
        const uiType =
          typeof data.type === "number"
            ? data.type
            : typeof data.type === "string"
            ? str2num[data.type] ?? ""
            : "";

        setForm({
          id: data.id,
          name: data.name || "",
          taxNumber: data.taxNumber || "",
          tckn: data.tckn ?? "",
          taxOffice: data.taxOffice || "",
          country: data.country || "TR",
          province: data.province || "",
          address: data.address || "",
          type: uiType,
        });
      } catch (err) {
        setMessage("❌ Şirket bilgileri alınamadı.");
      } finally {
        setInitializing(false);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isSahis = Number(form?.type) === COMPANY_TYPE_SAHIS;

  const requiredOk = useMemo(() => {
    if (!form) return false;
    const taxNum = (form.taxNumber ?? "").trim();
    // Her tip için VKN 10 hane zorunlu
    if (!taxNum || taxNum.length !== 10 || !/^\d{10}$/.test(taxNum)) return false;
    // Şahıs (type=1) ise TCKN 11 hane zorunlu, ilk hane 0 olamaz
    if (isSahis) {
      const tcknVal = (form.tckn ?? "").trim();
      if (!tcknVal || tcknVal.length !== 11 || !/^[1-9]\d{10}$/.test(tcknVal)) return false;
    }
    return (
      form.name?.trim() &&
      form.taxOffice?.trim() &&
      form.country?.trim() &&
      form.province?.trim() &&
      form.address?.trim() &&
      (form.type !== "" && form.type !== null && form.type !== undefined)
    );
  }, [form, isSahis]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!requiredOk) {
      setMessage("❌ Lütfen zorunlu alanları doldurun.");
      setLoading(false);
      return;
    }

    const taxNum = form.taxNumber.trim();
    if (taxNum.length !== 10 || !/^\d{10}$/.test(taxNum)) {
      setMessage("⚠️ Vergi numarası (VKN) 10 haneli rakamlardan oluşmalıdır.");
      setLoading(false);
      return;
    }
    if (isSahis) {
      const tcknVal = (form.tckn ?? "").trim();
      if (!tcknVal || tcknVal.length !== 11 || !/^[1-9]\d{10}$/.test(tcknVal)) {
        setMessage("⚠️ Şahıs firması için T.C. Kimlik No (TCKN) 11 haneli olmalı ve 0 ile başlamamalıdır.");
        setLoading(false);
        return;
      }
    }

    try {
      // CompanyUpdateDto: id, name, taxNumber, taxOffice, country, province, address, type, tckn (şahıs için zorunlu)
      const typeNum = Number(form.type);
      const payload = {
        id: form.id,
        name: form.name.trim(),
        taxNumber: taxNum,
        taxOffice: form.taxOffice.trim(),
        country: (form.country || "TR").trim(),
        province: form.province.trim(),
        address: form.address.trim(),
        type: typeNum,
      };
      if (typeNum === COMPANY_TYPE_SAHIS) {
        payload.tckn = (form.tckn ?? "").trim();
      }
      await updateCompany(payload);

      // Ayarlar (profil) sayfasındaki Şirket sekmesine yönlendir; bildirim orada gösterilecek
      navigate("/seller/profile#company", { state: { companyUpdated: true }, replace: false });
    } catch (err) {
      setMessage("❌ " + (err?.message || "Güncelleme sırasında bir hata oluştu."));
    } finally {
      setLoading(false);
    }
  };

  if (initializing || !form) {
    return (
      <div className="px-4 sm:px-6 py-6 sm:py-10">
        <div className="max-w-6xl mx-auto bg-white border rounded-2xl p-6 shadow-sm animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded" />
            ))}
            <div className="md:col-span-2 h-12 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const fields = [
    { name: "name", label: "Şirket Adı", required: true },
    { name: "taxNumber", label: "Vergi Numarası (VKN, 10 hane)", required: true, maxLength: 10, isTax: true },
    { name: "country", label: "Ülke", required: true },
    { name: "province", label: "Şehir", required: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50">
      {/* Hero Header */}
      <motion.header 
        className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
          <motion.div 
            className="flex items-center gap-4"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm text-white shadow-lg">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 flex items-center gap-3">
                Şirket Bilgileriniz
                <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
              </h1>
              <p className="text-emerald-100 text-lg">Zorunlu alanları doldurun ve bilgilerinizi güncel tutun</p>
            </div>
          </motion.div>
        </div>
      </motion.header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-gray-200 p-4 sm:p-6 lg:p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Text Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fields.map((f) => (
              <Field key={f.name} label={f.label} required={f.required}>
                <input
                  name={f.name}
                  value={form[f.name]}
                  onChange={f.isTax ? (e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, f.maxLength);
                    setForm((prev) => ({ ...prev, [f.name]: v }));
                  } : handleChange}
                  placeholder={f.label}
                  required={f.required}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                  {...(f.isTax && {
                    maxLength: f.maxLength,
                    pattern: "\\d{10}",
                    title: "Vergi numarası 10 haneli olmalıdır"
                  })}
                />
              </Field>
            ))}
          </div>

          {/* T.C. Kimlik No – sadece Şahıs firması (type=1) için */}
          {isSahis && (
            <div>
              <Field label="T.C. Kimlik Numarası (TCKN, 11 hane)" required>
                <input
                  name="tckn"
                  value={form.tckn ?? ""}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 11);
                    setForm((prev) => ({ ...prev, tckn: v }));
                  }}
                  placeholder="TCKN - 11 haneli (0 ile başlamaz)"
                  required
                  maxLength={11}
                  pattern="[1-9]\\d{10}"
                  title="Şahıs firması için TCKN 11 haneli olmalı ve 0 ile başlamamalıdır"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                />
              </Field>
            </div>
          )}

          {/* Adres */}
          <div>
            <Field label="Adres" required>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Detaylı adres bilginizi girin"
                required
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all resize-none"
              />
            </Field>
          </div>

          {/* Vergi Dairesi & Şirket Türü */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Field label="Vergi Dairesi" required>
              <TaxOfficeSelect
                name="taxOffice"
                value={form.taxOffice}
                onChange={handleChange}
                required
              />
            </Field>

            <Field label="Şirket Türü" required>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all bg-white"
              >
                <option value="">Seçiniz</option>
                {companyTypeOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <motion.button
              type="submit"
              disabled={loading || !requiredOk}
              className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:via-teal-700 hover:to-green-700 text-white font-bold py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:hover:scale-100 text-lg"
              whileHover={{ scale: loading || !requiredOk ? 1 : 1.02 }}
              whileTap={{ scale: loading || !requiredOk ? 1 : 0.98 }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Güncelleniyor...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Bilgileri Güncelle
                </span>
              )}
            </motion.button>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-center text-sm font-bold p-4 rounded-xl ${
                  message.startsWith("✅") ? "text-emerald-800 bg-emerald-100 border-2 border-emerald-300" : "text-rose-800 bg-rose-100 border-2 border-rose-300"
                }`}
              >
                {message}
              </motion.div>
            )}

            {!requiredOk && (
              <motion.div 
                className="flex items-start gap-3 text-amber-800 bg-amber-50 p-4 rounded-xl border-2 border-amber-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm font-semibold">
                  {isSahis
                    ? "Lütfen tüm zorunlu alanları doldurun. Vergi numarası 10, T.C. Kimlik No 11 haneli olmalıdır (TCKN 0 ile başlamaz)."
                    : "Lütfen tüm zorunlu alanları doldurun ve vergi numarasının 10 haneli olduğundan emin olun."}
                </p>
              </motion.div>
            )}
          </div>
        </motion.form>
      </main>
    </div>
  );
}