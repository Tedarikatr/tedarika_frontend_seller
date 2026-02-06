import { apiRequest } from "./apiRequest";

// Backend: api/seller/shipping, api/seller/orders/{orderId}/shipping
const BASE_SHIPPING = "seller/shipping";
const BASE_ORDER_SHIPPING = (orderId) => `seller/orders/${orderId}/shipping`;

// ----- SellerShippingController (api/seller/shipping) -----

/** GET api/seller/shipping/sender-address - Gönderici adresini getir */
export const getSenderAddress = async () => {
  return await apiRequest(`${BASE_SHIPPING}/sender-address`, "GET", null, true);
};

/** PUT api/seller/shipping/sender-address - Gönderici adresini oluştur / güncelle */
export const putSenderAddress = async (body) => {
  return await apiRequest(`${BASE_SHIPPING}/sender-address`, "PUT", body, true);
};

// ----- SellerShippingOrderController (api/seller/orders/{orderId}/shipping) -----

/** POST api/seller/orders/{orderId}/shipping/offers - Gönderi oluştur, kargo tekliflerini al */
export const getShippingOffers = async (orderId, body = null) => {
  return await apiRequest(
    `${BASE_ORDER_SHIPPING(orderId)}/offers`,
    "POST",
    body && Object.keys(body).length ? body : {},
    true
  );
};

/** GET api/seller/orders/{orderId}/shipping/offers?providerShipmentId=... - Teklifleri yenile (aynı gönderi) */
export const refreshShippingOffers = async (orderId, providerShipmentId) => {
  const path = `${BASE_ORDER_SHIPPING(orderId)}/offers?providerShipmentId=${encodeURIComponent(providerShipmentId)}`;
  return await apiRequest(path, "GET", null, true);
};

/** POST api/seller/orders/{orderId}/shipping/accept-offer - Teklif kabul & etiket oluştur */
export const acceptShippingOffer = async (orderId, body) => {
  return await apiRequest(
    `${BASE_ORDER_SHIPPING(orderId)}/accept-offer`,
    "POST",
    body,
    true
  );
};

/** GET api/seller/orders/{orderId}/shipping/label - Kargo etiketi meta bilgisi */
export const getShippingLabel = async (orderId) => {
  return await apiRequest(
    `${BASE_ORDER_SHIPPING(orderId)}/label`,
    "GET",
    null,
    true
  );
};

/** GET api/seller/orders/{orderId}/shipping/label/download - Etiket dosyasını indir (blob) */
export const downloadShippingLabel = async (orderId) => {
  const base = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
  const path = `${BASE_ORDER_SHIPPING(orderId)}/label/download`.replace(/^\/+/, "");
  const url = `${base}/${path}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("sellerToken")}`,
    },
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    let msg = "Kargo etiketi indirilemedi.";
    try {
      const j = JSON.parse(text);
      msg = j.message || j.title || msg;
    } catch (_) {
      if (text) msg = text;
    }
    throw new Error(msg);
  }
  return await response.blob();
};
