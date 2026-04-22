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

/**
 * POST api/seller/orders/{orderId}/shipping/label/auto
 * Geliver ile otomatik kargo etiketi üretir (boş body).
 * @returns {Promise<{ status: number, data: object }>} status 201 = yeni, 200 = zaten vardı
 */
export const triggerAutoShippingLabel = async (orderId) => {
  const base = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
  const path = `${BASE_ORDER_SHIPPING(orderId)}/label/auto`.replace(/^\/+/, "");
  const url = `${base}/${path}`;
  const token = localStorage.getItem("sellerToken");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      Accept: "application/json",
    },
  });
  const text = await response.text().catch(() => "");
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }
  if (!response.ok) {
    const msg =
      data.message ||
      data.title ||
      data.error ||
      (response.status === 404
        ? "Sipariş bulunamadı."
        : "Kargo etiketi oluşturulamadı.");
    const err = new Error(msg);
    err.status = response.status;
    throw err;
  }
  return { status: response.status, data };
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
    } catch {
      if (text) msg = text;
    }
    throw new Error(msg);
  }
  return await response.blob();
};
