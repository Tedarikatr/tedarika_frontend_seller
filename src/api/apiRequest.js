const BASE_URL = "https://tedarikamarketplaces-dea5htdedkb6hsgv.eastus-01.azurewebsites.net/api";

export async function apiRequest(endpoint, method = "GET", data = null, useAuth = false) {
  const headers = {
    Accept: "*/*",
  };

  if (useAuth) {
    const token = localStorage.getItem("sellerToken");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const config = { method, headers };

  // 🔧 Eğer data varsa ve FormData değilse JSON.stringify et
  if (data) {
    if (data instanceof FormData) {
      config.body = data;
      // ❌ Content-Type setleme — tarayıcı kendisi ayarlıyor
    } else {
      headers["Content-Type"] = "application/json";
      config.body = JSON.stringify(data);
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = "Sunucu hatası.";

    try {
      const json = JSON.parse(errorText);
      console.error("API JSON Error:", json);
      errorMessage = json.title || json.message || json.error || errorText;
    } catch {
      console.error("API Text Error:", errorText);
      errorMessage = errorText;
    }

    throw new Error(errorMessage);
  }

  try {
    return await response.json();
  } catch (jsonError) {
    console.warn("⚠️ Yanıt JSON değil:", jsonError);
    return {};
  }
}
