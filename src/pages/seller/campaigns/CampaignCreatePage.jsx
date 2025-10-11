import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { initialCampaignPayload } from "./_initialPayload";
import SellerCampaignService from "@/api/sellerCampaignService";
import StepCampaignInfo from "@/components/campaignWizard/StepCampaignInfo";
import StepProductSelect from "@/components/campaignWizard/StepProductSelect";
import StepCriteria from "@/components/campaignWizard/StepCriteria";
import StepPreview from "@/components/campaignWizard/StepPreview";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function CampaignCreatePage() {
  const [step, setStep] = useState(0);
  const [payload, setPayload] = useState(initialCampaignPayload);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ show: false, type: "", message: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const res = await SellerCampaignService.getMetadata();
        setMetadata(res);
      } catch {
        setModal({
          show: true,
          type: "error",
          message: "Metadata yüklenemedi. API’yi kontrol edin.",
        });
      } finally {
        setLoading(false);
      }
    };
    loadMetadata();
  }, []);

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  const showModal = (type, message, redirect = false) => {
    setModal({ show: true, type, message });
    if (redirect) {
      setTimeout(() => {
        navigate("/seller/campaigns");
      }, 1800);
    } else {
      setTimeout(() => setModal({ show: false, type: "", message: "" }), 2200);
    }
  };

  const submit = async () => {
    const b = payload.basics;
    const c = payload.criteria;

    if (!b.name) return showModal("error", "Kampanya adı zorunlu!");
    if (!b.startsAt || !b.endsAt)
      return showModal("error", "Tarihleri giriniz!");
    if (new Date(b.startsAt) >= new Date(b.endsAt))
      return showModal("error", "Başlangıç tarihi bitiş tarihinden önce olmalı!");
    if (!(Number(c.amountOff) > 0 || Number(c.percentOff) > 0))
      return showModal("error", "Tutar veya yüzde indirim girin!");
    if (b.requiresCoupon && !b.couponCode)
      return showModal("error", "Kupon kodu gerekli!");

    try {
      await SellerCampaignService.create(payload);
      showModal("success", "Kampanya başarıyla oluşturuldu!", true);
    } catch (e) {
      showModal("error", e?.message || "Kampanya oluşturulamadı!");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-gray-500 text-lg">
        Metadata yükleniyor...
      </div>
    );

  if (!metadata)
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-red-500 text-lg">
        Metadata alınamadı.
      </div>
    );

  const steps = metadata.workflow;
  const stepKey = steps[step]?.key;
  const StepComp =
    stepKey === "basics"
      ? StepCampaignInfo
      : stepKey === "targeting"
      ? StepProductSelect
      : stepKey === "criteria"
      ? StepCriteria
      : StepPreview;

  return (
    <div className="w-full max-w-6xl mx-auto px-8 py-10 space-y-8 animate-fadeIn">
      <Progress steps={steps} activeStep={step} />

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-10">
        <StepComp
          data={payload}
          setData={setPayload}
          next={next}
          prev={prev}
          submit={submit}
          metadata={metadata}
        />
      </div>

      {modal.show && <Modal type={modal.type} message={modal.message} />}
    </div>
  );
}

/* 🔶 İlerleme Çubuğu */
function Progress({ steps, activeStep }) {
  return (
    <div className="relative mb-8">
      <div className="flex justify-between items-center">
        {steps.map((s, i) => (
          <div key={s.key} className="flex-1 text-center">
            <div
              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-semibold transition-all ${
                activeStep === i
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {i + 1}
            </div>
            <p
              className={`mt-2 text-sm ${
                activeStep === i
                  ? "text-orange-600 font-semibold"
                  : "text-gray-500"
              }`}
            >
              {s.title}
            </p>
          </div>
        ))}
      </div>
      <div className="absolute top-4 left-0 right-0 h-[2px] bg-gray-200">
        <div
          className="h-[2px] bg-orange-500 transition-all duration-500"
          style={{
            width: `${(activeStep / (steps.length - 1)) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
}

/* 🌟 Şık Modal (Glassmorphism Style) */
function Modal({ type, message }) {
  const isSuccess = type === "success";
  const icon = isSuccess ? (
    <CheckCircle2 className="text-green-500 w-10 h-10" />
  ) : (
    <AlertCircle className="text-red-500 w-10 h-10" />
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeInFast">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      <div className="relative bg-white/80 backdrop-blur-md border border-gray-200 shadow-2xl rounded-2xl p-8 w-[90%] max-w-md text-center animate-scaleIn">
        <div className="flex flex-col items-center gap-4">
          {icon}
          <p
            className={`text-lg font-medium ${
              isSuccess ? "text-green-700" : "text-red-700"
            }`}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
