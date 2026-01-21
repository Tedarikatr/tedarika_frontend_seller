import React, { useEffect, useMemo, useState } from "react";
import {
  createGeliverIntegrationRequest,
  getGeliverIntegrationDetails,
  autoRegisterGeliver,
  saveGeliverIntegrationDetails,
  uploadGeliverAgreement,
  matchExistingGeliverAccount,
} from "@/api/sellerGeliverService";
import { CARRIER_COMPANY_ENUMS } from "@/constants/carrierCompanies";
import {
  Link2,
  ShieldCheck,
  Upload,
  FileText,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  Zap,
  ChevronDown,
  ChevronUp,
  LogIn,
  UserPlus,
} from "lucide-react";

const STATUS_META = {
  0: {
    label: "Beklemede",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  1: {
    label: "Aktif",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  2: {
    label: "Reddedildi",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
  },
};

const toIso = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

export default function SellerGeliverIntegrationCard() {
  const [status, setStatus] = useState(null);
  const [agreements, setAgreements] = useState([]);
  const [agreementInfo, setAgreementInfo] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [initialLoading, setInitialLoading] = useState(true);

  const [requestLoading, setRequestLoading] = useState(false);
  const [autoRegisterLoading, setAutoRegisterLoading] = useState(false);
  const [matchAccountLoading, setMatchAccountLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [agreementLoading, setAgreementLoading] = useState(false);
  const [showIntegrationDetails, setShowIntegrationDetails] = useState(false);
  const [showAgreementForm, setShowAgreementForm] = useState(false);
  const [showMatchAccountForm, setShowMatchAccountForm] = useState(false);

  const [detailsForm, setDetailsForm] = useState({
    apiToken: "",
    senderAddressId: "",
    providerServiceCode: "",
    autoLabelEnabled: true,
  });

  const [matchAccountForm, setMatchAccountForm] = useState({
    apiToken: "",
    senderAddressId: "",
    providerServiceCode: "",
    autoLabelEnabled: true,
  });

  const [agreementForm, setAgreementForm] = useState({
    carrierCompany: "",
    validFrom: "",
    validUntil: "",
    notes: "",
    file: null,
  });

  const statusMeta = status ? STATUS_META[status.status] || null : null;
  const carrierLabelMap = useMemo(
    () =>
      CARRIER_COMPANY_ENUMS.reduce((acc, item) => {
        acc[item.value] = item.label;
        return acc;
      }, {}),
    []
  );

  const hasIntegrationInfo = Boolean(
    status &&
      (status.status === 1 ||
        status.integrationCompletedAt ||
        status.senderAddressId ||
        status.providerServiceCode ||
        status.tokenMasked)
  );

  const loadIntegrationDetails = async () => {
    setInitialLoading(true);
    try {
      const data = await getGeliverIntegrationDetails();
      const integration = data?.integration || data;
      if (integration) {
        setStatus(integration);
        setDetailsForm((prev) => ({
          ...prev,
          senderAddressId: integration.senderAddressId || prev.senderAddressId,
          providerServiceCode: integration.providerServiceCode || prev.providerServiceCode,
          autoLabelEnabled:
            typeof integration.autoLabelEnabled === "boolean"
              ? integration.autoLabelEnabled
              : prev.autoLabelEnabled,
        }));
      }
      if (Array.isArray(data?.agreements)) {
        setAgreements(data.agreements);
      }
    } catch (err) {
      setMessageType("error");
      setMessage(err?.message || "Entegrasyon bilgileri alınamadı.");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadIntegrationDetails();
  }, []);

  const handleRequest = async () => {
    setRequestLoading(true);
    setMessage("");
    setMessageType("success");
    try {
      const data = await createGeliverIntegrationRequest();
      setStatus(data);
      setMessage("Entegrasyon talebi başarıyla oluşturuldu/güncellendi.");
    } catch (err) {
      setMessageType("error");
      setMessage(`Talep oluşturulamadı: ${err?.message || "Bilinmeyen hata"}`);
    } finally {
      setRequestLoading(false);
    }
  };

  const handleAutoRegister = async () => {
    setAutoRegisterLoading(true);
    setMessage("");
    setMessageType("success");
    try {
      const data = await autoRegisterGeliver();
      setStatus(data);
      await loadIntegrationDetails();
      setMessage(
        data?.isSkipped
          ? "Geliver otomatik kayıt zaten tamamlanmış."
          : "Geliver otomatik kayıt tamamlandı ve entegrasyon aktif edildi."
      );
    } catch (err) {
      setMessageType("error");
      setMessage(err?.message || "Otomatik kayıt başarısız. Manuel entegrasyona geçebilirsiniz.");
    } finally {
      setAutoRegisterLoading(false);
    }
  };

  const handleMatchAccountChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMatchAccountForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMatchExistingAccount = async (e) => {
    e.preventDefault();
    setMatchAccountLoading(true);
    setMessage("");
    setMessageType("success");
    try {
      const payload = {
        apiToken: matchAccountForm.apiToken.trim(),
        senderAddressId: matchAccountForm.senderAddressId.trim() || undefined,
        providerServiceCode: matchAccountForm.providerServiceCode.trim() || undefined,
        autoLabelEnabled: Boolean(matchAccountForm.autoLabelEnabled),
      };
      const data = await matchExistingGeliverAccount(payload);
      if (data?.isValid && data?.integrationStatus) {
        setStatus(data.integrationStatus);
        await loadIntegrationDetails();
        setMessage(data?.message || "Geliver hesabı başarıyla eşleştirildi ve entegrasyon aktif edildi.");
        setShowMatchAccountForm(false);
      } else {
        setMessageType("error");
        setMessage(data?.message || "Hesap eşleştirme başarısız. Token'ı kontrol edin.");
      }
    } catch (err) {
      setMessageType("error");
      setMessage(err?.message || "Hesap eşleştirme başarısız. Token'ı kontrol edin.");
    } finally {
      setMatchAccountLoading(false);
    }
  };

  const handleDetailsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDetailsForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setDetailsLoading(true);
    setMessage("");
    setMessageType("success");
    try {
      const payload = {
        apiToken: detailsForm.apiToken.trim(),
        senderAddressId: detailsForm.senderAddressId.trim(),
        providerServiceCode: detailsForm.providerServiceCode.trim(),
        autoLabelEnabled: Boolean(detailsForm.autoLabelEnabled),
      };
      const data = await saveGeliverIntegrationDetails(payload);
      setStatus(data);
      await loadIntegrationDetails();
      setMessage(data?.isSkipped ? "Mevcut entegrasyon bilgileri zaten kayıtlı." : "Entegrasyon bilgileri kaydedildi.");
    } catch (err) {
      setMessageType("error");
      setMessage(`Entegrasyon kaydı başarısız: ${err?.message || "Bilinmeyen hata"}`);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleAgreementChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setAgreementForm((prev) => ({ ...prev, file: files?.[0] || null }));
      return;
    }
    setAgreementForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadAgreement = async (e) => {
    e.preventDefault();
    if (!agreementForm.file || !agreementForm.carrierCompany) {
      setMessageType("error");
      setMessage("Lütfen taşıyıcı şirket kodu ve anlaşma dosyasını seçin.");
      return;
    }

    setAgreementLoading(true);
    setMessage("");
    setMessageType("success");
    try {
      const formData = new FormData();
      formData.append("carrierCompany", String(agreementForm.carrierCompany));
      const validFromIso = toIso(agreementForm.validFrom);
      const validUntilIso = toIso(agreementForm.validUntil);
      if (validFromIso) {
        formData.append("validFrom", validFromIso);
      }
      if (validUntilIso) {
        formData.append("validUntil", validUntilIso);
      }
      if (agreementForm.notes?.trim()) {
        formData.append("notes", agreementForm.notes.trim());
      }
      formData.append("file", agreementForm.file);
      const data = await uploadGeliverAgreement(formData);
      setAgreementInfo(data);
      if (data) {
        setAgreements((prev) => [data, ...prev]);
      }
      setMessage("Anlaşma dosyası başarıyla yüklendi.");
      setAgreementForm((prev) => ({ ...prev, file: null }));
    } catch (err) {
      setMessageType("error");
      setMessage(`Anlaşma yüklenemedi: ${err?.message || "Bilinmeyen hata"}`);
    } finally {
      setAgreementLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 w-full">
      <div className="mb-6 border-b pb-4 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
          <Link2 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Geliver Kargo Entegrasyonu</h2>
          <p className="text-sm text-gray-500 mt-1">
            Entegrasyon talebi, token ve anlaşma işlemlerini bu panelden yönetebilirsiniz.
          </p>
        </div>
      </div>

      {initialLoading && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          Entegrasyon bilgileri yükleniyor...
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

      {/* Entegrasyon Durumu */}
      <div className="rounded-2xl border border-gray-200 p-5 mb-6 bg-gradient-to-br from-white to-gray-50">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">Entegrasyon Durumu</h3>
          </div>
          {!hasIntegrationInfo && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleRequest}
                disabled={requestLoading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-semibold hover:bg-emerald-100 transition disabled:opacity-50"
              >
                {requestLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Talep Oluştur / Durumu Getir
              </button>
            </div>
          )}
        </div>

        {status ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div className="flex flex-col gap-1">
              <span className="text-gray-500">Durum</span>
              {statusMeta ? (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}>
                  {statusMeta.label}
                </span>
              ) : (
                <span className="text-gray-700">Bilinmiyor</span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500">İletişim E-posta</span>
              <span className="font-medium text-gray-900">{status.contactEmail || "-"}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500">İletişim Telefon</span>
              <span className="font-medium text-gray-900">{status.contactPhone || "-"}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500">Mağaza Notu</span>
              <span className="font-medium text-gray-900">{status.notes || "-"}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500">Token (Maskeli)</span>
              <span className="font-medium text-gray-900">{status.tokenMasked || "-"}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500">Otomatik Etiket</span>
              <span className="font-medium text-gray-900">{status.autoLabelEnabled ? "Açık" : "Kapalı"}</span>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            Henüz talep oluşturulmadı. Yukarıdaki buton ile entegrasyon talebi başlatabilirsiniz.
          </div>
        )}
      </div>

      {hasIntegrationInfo && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Mevcut entegrasyon bilgileri bulundu. Başvuru süreçleri kapatıldı.
        </div>
      )}

      {/* Geliver Hesap Seçenekleri - Sadece kayıt bilgileri yoksa göster */}
      {!hasIntegrationInfo && (
        <div className="mb-6 rounded-2xl border border-gray-200 p-5 bg-gradient-to-br from-white to-gray-50">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-sky-600" />
            <h3 className="text-lg font-semibold text-gray-900">Geliver Entegrasyonu</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Geliver kargo entegrasyonunu başlatmak için aşağıdaki seçeneklerden birini seçin:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setShowMatchAccountForm(!showMatchAccountForm)}
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 text-sm font-semibold hover:bg-sky-100 hover:border-sky-300 transition-all"
            >
              <LogIn className="w-5 h-5" />
              Mevcut Geliver Hesabına Giriş Yap
            </button>
            <button
              type="button"
              onClick={handleAutoRegister}
              disabled={autoRegisterLoading}
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-semibold hover:bg-emerald-100 hover:border-emerald-300 transition-all disabled:opacity-50"
            >
              {autoRegisterLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <UserPlus className="w-5 h-5" />
              )}
              Geliver Kargo'da Yeni Hesap Aç
            </button>
          </div>

          {/* Mevcut Hesap Giriş Formu */}
          {showMatchAccountForm && (
            <div className="mt-6 rounded-xl border border-sky-200 bg-sky-50 p-5">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Mevcut Geliver Hesabı Bilgileri</h4>
              <form onSubmit={handleMatchExistingAccount} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  label="Geliver API Token"
                  name="apiToken"
                  value={matchAccountForm.apiToken}
                  onChange={handleMatchAccountChange}
                  placeholder="geliver_api_token"
                  required
                />
                <Field
                  label="Gönderici Adres ID (Opsiyonel)"
                  name="senderAddressId"
                  value={matchAccountForm.senderAddressId}
                  onChange={handleMatchAccountChange}
                  placeholder="address_id"
                />
                <Field
                  label="Servis Kodu (Opsiyonel)"
                  name="providerServiceCode"
                  value={matchAccountForm.providerServiceCode}
                  onChange={handleMatchAccountChange}
                  placeholder="YURTICI_STANDART"
                />
                <div className="flex items-center gap-2 mt-2">
                  <input
                    id="matchAutoLabelEnabled"
                    name="autoLabelEnabled"
                    type="checkbox"
                    checked={matchAccountForm.autoLabelEnabled}
                    onChange={handleMatchAccountChange}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="matchAutoLabelEnabled" className="text-sm text-gray-700">
                    Otomatik etiket oluşturma aktif olsun
                  </label>
                </div>
                <div className="md:col-span-2 flex items-center gap-3 mt-2">
                  <button
                    type="submit"
                    disabled={matchAccountLoading}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 text-white text-sm font-semibold hover:shadow-lg transition disabled:opacity-50"
                  >
                    {matchAccountLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Hesabı Eşleştir
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMatchAccountForm(false)}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Entegrasyon Bilgileri */}
      <div className="rounded-2xl border border-gray-200 p-5 mb-6">
        <button
          type="button"
          onClick={() => setShowIntegrationDetails(!showIntegrationDetails)}
          className="w-full flex items-center justify-between gap-2 mb-4"
        >
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-sky-600" />
            <h3 className="text-lg font-semibold text-gray-900">Entegrasyon Bilgileri</h3>
          </div>
          {showIntegrationDetails ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        {showIntegrationDetails && (
          <form onSubmit={handleSaveDetails} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Geliver API Token"
            name="apiToken"
            value={detailsForm.apiToken}
            onChange={handleDetailsChange}
            placeholder="geliver_token"
            required
            disabled={hasIntegrationInfo}
          />
          <Field
            label="Gönderici Adres ID"
            name="senderAddressId"
            value={detailsForm.senderAddressId}
            onChange={handleDetailsChange}
            placeholder="address_id"
            required
            disabled={hasIntegrationInfo}
          />
          <Field
            label="Servis Kodu"
            name="providerServiceCode"
            value={detailsForm.providerServiceCode}
            onChange={handleDetailsChange}
            placeholder="service_code"
            required
            disabled={hasIntegrationInfo}
          />
          <div className="flex items-center gap-2 mt-2">
            <input
              id="autoLabelEnabled"
              name="autoLabelEnabled"
              type="checkbox"
              checked={detailsForm.autoLabelEnabled}
              onChange={handleDetailsChange}
              disabled={hasIntegrationInfo}
              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="autoLabelEnabled" className="text-sm text-gray-700">
              Otomatik etiket oluşturma aktif olsun
            </label>
          </div>
          <div className="md:col-span-2 flex items-center gap-3 mt-2">
            <button
              type="submit"
              disabled={detailsLoading || hasIntegrationInfo}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold hover:shadow-lg transition disabled:opacity-50"
            >
              {detailsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Kaydet
            </button>
            {status?.isSkipped && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                Zaten kayıtlı
              </span>
            )}
          </div>
        </form>
        )}
      </div>

      {/* Anlaşma Yükleme */}
      <div className="rounded-2xl border border-gray-200 p-5">
        <button
          type="button"
          onClick={() => setShowAgreementForm(!showAgreementForm)}
          className="w-full flex items-center justify-between gap-2 mb-4"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Taşıyıcı Anlaşması Yükle</h3>
          </div>
          {showAgreementForm ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        {showAgreementForm && (
          <>
            <form onSubmit={handleUploadAgreement} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                label="Taşıyıcı Şirket"
                name="carrierCompany"
                value={agreementForm.carrierCompany}
                onChange={handleAgreementChange}
                required
                options={CARRIER_COMPANY_ENUMS}
              />
              <Field
                label="Geçerlilik Başlangıcı"
                name="validFrom"
                value={agreementForm.validFrom}
                onChange={handleAgreementChange}
                type="datetime-local"
              />
              <Field
                label="Geçerlilik Bitişi"
                name="validUntil"
                value={agreementForm.validUntil}
                onChange={handleAgreementChange}
                type="datetime-local"
              />
              <Field
                label="Notlar (opsiyonel)"
                name="notes"
                value={agreementForm.notes}
                onChange={handleAgreementChange}
                placeholder="Not bırakabilirsiniz"
              />
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Anlaşma Dosyası (PDF)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    name="file"
                    accept="application/pdf"
                    onChange={handleAgreementChange}
                    className="flex-1 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={agreementLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition disabled:opacity-50"
                  >
                    {agreementLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    Yükle
                  </button>
                </div>
              </div>
            </form>

            {agreementInfo && (
              <div className="mt-4 rounded-xl border border-purple-100 bg-purple-50 px-4 py-3 text-sm text-purple-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600" />
                Anlaşma yüklendi: {agreementInfo.agreementFileUrl ? "Dosya bağlantısı hazır." : "Kayıt tamamlandı."}
              </div>
            )}
          </>
        )}
      </div>

      {/* Anlaşmalar */}
      {agreements.length > 0 && (
        <div className="mt-6 rounded-2xl border border-gray-200 p-5 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Yüklenmiş Anlaşmalar</h3>
          <div className="space-y-3 text-sm">
            {agreements.map((agreement) => (
              <div
                key={agreement.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3"
              >
                <div className="space-y-1">
                  <div className="font-semibold text-gray-800">
                    {carrierLabelMap[agreement.carrierCompany] ||
                      agreement.carrierCompany}
                  </div>
                  <div className="text-xs text-gray-500">
                    {agreement.notes || "Not belirtilmemiş"}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {agreement.validFrom
                    ? new Date(agreement.validFrom).toLocaleDateString("tr-TR")
                    : "-"}{" "}
                  →{" "}
                  {agreement.validUntil
                    ? new Date(agreement.validUntil).toLocaleDateString("tr-TR")
                    : "-"}
                </div>
                {agreement.agreementFileUrl && (
                  <a
                    href={agreement.agreementFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-100 transition"
                  >
                    <FileText className="w-4 h-4" />
                    Dosyayı Aç
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex items-start gap-2 text-xs text-gray-500">
        <XCircle className="w-4 h-4 text-gray-400" />
        <span>
          Not: Otomatik kayıt çalışmazsa manuel entegrasyon bilgileri ile devam edebilirsiniz.
        </span>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, placeholder, required, type = "text", disabled }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-rose-600">*</span>}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        required={required}
        type={type}
        disabled={disabled}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, required, options }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-rose-600">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
      >
        <option value="">Seçiniz...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label} ({opt.value})
          </option>
        ))}
      </select>
    </div>
  );
}
