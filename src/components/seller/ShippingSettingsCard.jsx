import React, { useEffect, useState } from "react";
import { getSenderAddress, putSenderAddress } from "@/api/sellerShippingService";
import { TURKEY_PROVINCES } from "@/constants/turkeyProvinces";
import CargoAgreementsAccordion from "./CargoAgreementsAccordion";
import {
  Truck,
  MapPin,
  Loader2,
  CheckCircle,
  XCircle,
  Save,
} from "lucide-react";

const defaultForm = {
  name: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  cityCode: "",
  cityName: "",
  districtId: "",
  districtName: "",
  streetName: "",
  zip: "",
  countryCode: "TR",
  countryName: "Türkiye",
  isDefaultSenderAddress: true,
  isDefaultReturnAddress: true,
};

export default function ShippingSettingsCard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [form, setForm] = useState(defaultForm);
  const [hasAddress, setHasAddress] = useState(false);

  const loadSenderAddress = async () => {
    setLoading(true);
    setMessage("");
    try {
      const data = await getSenderAddress();
      setHasAddress(true);
      setForm({
        name: data.name ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        address1: data.address1 ?? "",
        address2: data.address2 ?? "",
        cityCode: data.cityCode ?? "",
        cityName: data.cityName ?? "",
        districtId: data.districtId ?? "",
        districtName: data.districtName ?? "",
        streetName: data.streetName ?? "",
        zip: data.zip ?? "",
        countryCode: data.countryCode ?? "TR",
        countryName: data.countryName ?? "Türkiye",
        isDefaultSenderAddress: data.isDefaultSenderAddress !== false,
        isDefaultReturnAddress: data.isDefaultReturnAddress !== false,
      });
    } catch (err) {
      if (err?.message?.includes("404") || err?.message?.toLowerCase?.().includes("tanımlı değil")) {
        setHasAddress(false);
        setForm(defaultForm);
      } else {
        setMessageType("error");
        setMessage(err?.message || "Gönderici adresi yüklenemedi.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSenderAddress();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCitySelect = (e) => {
    const code = e.target.value;
    const province = TURKEY_PROVINCES.find((p) => p.code === code);
    setForm((prev) => ({
      ...prev,
      cityCode: code,
      cityName: province?.name ?? prev.cityName,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name?.trim() || !form.phone?.trim() || !form.address1?.trim()) {
      setMessageType("error");
      setMessage("Ad/ünvan, telefon ve adres satırı 1 zorunludur.");
      return;
    }
    setSaving(true);
    setMessage("");
    setMessageType("success");
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email?.trim() || undefined,
        phone: form.phone.trim(),
        address1: form.address1.trim(),
        address2: form.address2?.trim() || undefined,
        cityCode: form.cityCode?.trim() || undefined,
        cityName: form.cityName?.trim() || undefined,
        districtId: form.districtId ? Number(form.districtId) : undefined,
        districtName: form.districtName?.trim() || undefined,
        streetName: form.streetName?.trim() || undefined,
        zip: form.zip?.trim() || undefined,
        countryCode: form.countryCode?.trim() || "TR",
        countryName: form.countryName?.trim() || undefined,
        isDefaultSenderAddress: Boolean(form.isDefaultSenderAddress),
        isDefaultReturnAddress: Boolean(form.isDefaultReturnAddress),
      };
      await putSenderAddress(payload);
      setHasAddress(true);
      setMessage("Gönderici adresi kaydedildi.");
      await loadSenderAddress();
    } catch (err) {
      setMessageType("error");
      setMessage(err?.message || "Kayıt başarısız.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 w-full">
      <div className="mb-6 border-b pb-4 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
          <Truck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Kargo Ayarları</h2>
          <p className="text-sm text-gray-500 mt-1">
            Gönderici adresinizi tanımlayın. Kargo teklifi almak ve etiket oluşturmak için gereklidir.
          </p>
        </div>
      </div>

      {loading && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          Gönderici adresi yükleniyor...
        </div>
      )}

      {message && (
        <div
          className={`mb-6 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
            messageType === "error"
              ? "border-rose-200 bg-rose-50 text-rose-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {messageType === "error" ? (
            <XCircle className="w-4 h-4" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          {message}
        </div>
      )}

      {!loading && (
        <div className="rounded-2xl border border-gray-200 p-5 mb-6 bg-gradient-to-br from-white to-gray-50">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-sky-600" />
            <h3 className="text-lg font-semibold text-gray-900">Gönderici Adresi</h3>
            {hasAddress && (
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                Kayıtlı
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Kargo etiketi ve teklifleri için kullanılacak gönderici adresinizi girin. Mağaza numaranız otomatik kısa ad olarak kullanılır.
          </p>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Ad / Ünvan"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Mağaza Adı Tic. Ltd. Şti."
              required
            />
            <Field
              label="E-posta"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="magaza@example.com"
            />
            <Field
              label="Telefon"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+905551234567"
              required
            />
            <Field
              label="Adres satırı 1"
              name="address1"
              value={form.address1}
              onChange={handleChange}
              placeholder="Mahalle, sokak, no"
              required
              className="md:col-span-2"
            />
            <Field
              label="Adres satırı 2"
              name="address2"
              value={form.address2}
              onChange={handleChange}
              placeholder="Bina, daire (opsiyonel)"
              className="md:col-span-2"
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                İl <span className="text-rose-600">*</span>
              </label>
              <select
                name="cityCode"
                value={form.cityCode}
                onChange={handleCitySelect}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="">Seçiniz...</option>
                {TURKEY_PROVINCES.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <Field
              label="İlçe adı"
              name="districtName"
              value={form.districtName}
              onChange={handleChange}
              placeholder="İlçe"
            />
            <Field
              label="İlçe ID (Geliver)"
              name="districtId"
              value={form.districtId}
              onChange={handleChange}
              type="number"
              placeholder="Opsiyonel"
            />
            <Field
              label="Sokak adı"
              name="streetName"
              value={form.streetName}
              onChange={handleChange}
              placeholder="Opsiyonel"
            />
            <Field
              label="Posta kodu"
              name="zip"
              value={form.zip}
              onChange={handleChange}
              placeholder="34020"
            />
            <Field
              label="Ülke kodu"
              name="countryCode"
              value={form.countryCode}
              onChange={handleChange}
              placeholder="TR"
            />
            <Field
              label="Ülke adı"
              name="countryName"
              value={form.countryName}
              onChange={handleChange}
              placeholder="Türkiye"
            />
            <div className="md:col-span-2 flex flex-wrap gap-6 mt-2">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isDefaultSenderAddress"
                  checked={form.isDefaultSenderAddress}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">Varsayılan gönderici adresi</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isDefaultReturnAddress"
                  checked={form.isDefaultReturnAddress}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">Varsayılan iade adresi</span>
              </label>
            </div>
            <div className="md:col-span-2 flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold hover:shadow-lg transition disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {hasAddress ? "Güncelle" : "Kaydet"}
              </button>
            </div>
          </form>
        </div>
      )}

      <CargoAgreementsAccordion />
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
  className = "",
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-rose-600">*</span>}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        type={type}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
      />
    </div>
  );
}
