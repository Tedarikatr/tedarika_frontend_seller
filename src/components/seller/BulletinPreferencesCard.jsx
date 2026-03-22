import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Mail, MessageSquare, Phone, Save, Loader2 } from "lucide-react";
import TedarikaLoader from "@/components/ui/TedarikaLoader";
import { getSellerBulletinPreferences, updateSellerBulletinPreferences } from "@/api/sellerBulletinService";

const BulletinPreferencesCard = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    allowMail: true,
    allowSms: false,
    allowWp: true,
  });

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const data = await getSellerBulletinPreferences();
      setPreferences({
        allowMail: data.allowMail ?? true,
        allowSms: data.allowSms ?? false,
        allowWp: data.allowWp ?? true,
      });
    } catch (error) {
      console.error("Tercihler yüklenemedi:", error);
      toast.error("İletişim tercihleri yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateSellerBulletinPreferences(preferences);
      toast.success("İletişim tercihleri güncellendi");
    } catch (error) {
      console.error("Tercihler kaydedilemedi:", error);
      toast.error("Tercihler kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center py-12">
          <TedarikaLoader variant="compact" />
        </div>
      </div>
    );
  }

  const notificationOptions = [
    {
      key: "allowMail",
      icon: Mail,
      title: "E-posta Bildirimleri",
      description: "Önemli güncellemeler, sipariş bildirimleri ve kampanyalar hakkında e-posta alın",
      color: "from-blue-500 to-blue-600",
    },
    {
      key: "allowSms",
      icon: MessageSquare,
      title: "SMS Bildirimleri",
      description: "Acil siparişler ve önemli güncellemeler için SMS bildirimleri alın",
      color: "from-purple-500 to-purple-600",
    },
    {
      key: "allowWp",
      icon: Phone,
      title: "WhatsApp Bildirimleri",
      description: "WhatsApp üzerinden sipariş güncellemeleri ve destek mesajları alın",
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">İletişim Tercihleri</h2>
            <p className="text-sm text-gray-600">İletişim kanallarınızı yönetin</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {notificationOptions.map((option) => {
          const Icon = option.icon;
          const isEnabled = preferences[option.key];

          return (
            <div
              key={option.key}
              className="flex items-start gap-4 p-5 rounded-xl border-2 border-gray-200 hover:border-emerald-200 transition-all duration-200 bg-gray-50 hover:bg-white"
            >
              {/* Icon */}
              <div className={`w-12 h-12 bg-gradient-to-br ${option.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                <Icon className="w-6 h-6 text-white" strokeWidth={2} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{option.title}</h3>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => handleToggle(option.key)}
                className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                  isEnabled ? "bg-emerald-600" : "bg-gray-300"
                }`}
                role="switch"
                aria-checked={isEnabled}
              >
                <span
                  className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer with Save Button */}
      <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Değişiklikler anında uygulanmaz. Kaydetmeyi unutmayın.
          </p>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Kaydet
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulletinPreferencesCard;
