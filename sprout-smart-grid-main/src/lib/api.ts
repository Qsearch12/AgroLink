const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const API_BASE_URL = configuredApiUrl
  ? configuredApiUrl.replace(/\/+$/, "")
  : "/api/v1";

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "An error occurred" }));
    let errorMessage = "An error occurred";
    
    if (typeof errorData.detail === "string") {
      errorMessage = errorData.detail;
    } else if (Array.isArray(errorData.detail)) {
      errorMessage = errorData.detail.map((err: any) => `${err.loc.join(".")}: ${err.msg}`).join(", ");
    } else if (errorData.message) {
      errorMessage = errorData.message;
    }
    
    throw new Error(errorMessage || response.statusText);
  }

  return response.json();
}

export const authApi = {
  login: (credentials: { username: string; password: string }) =>
    apiRequest("/auth/login/access-token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(credentials).toString(),
    }),
  register: (userData: any) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  getMe: () => apiRequest("/auth/me"),
};

export const cropsApi = {
  getAll: () => apiRequest("/crops/"),
  getMyCrops: () => apiRequest("/crops/my-crops"),
  getSavedCrops: () => apiRequest("/crops/saved"),
  toggleSave: (id: string | number) =>
    apiRequest(`/crops/${id}/save`, {
      method: "POST",
    }),
  getMarketStats: () => apiRequest("/crops/market-prices/stats"),
  getById: (id: string | number) => apiRequest(`/crops/${id}`),
  create: (cropData: any) =>
    apiRequest("/crops/", {
      method: "POST",
      body: JSON.stringify(cropData),
    }),
  update: (id: string | number, cropData: any) =>
    apiRequest(`/crops/${id}`, {
      method: "PUT",
      body: JSON.stringify(cropData),
    }),
  delete: (id: string | number) =>
    apiRequest(`/crops/${id}`, {
      method: "DELETE",
    }),
};

export const messagesApi = {
  createRequest: (requestData: any) =>
    apiRequest("/messages/requests", {
      method: "POST",
      body: JSON.stringify(requestData),
    }),
  getFarmerRequests: () => apiRequest("/messages/requests/farmer"),
  getBuyerRequests: () => apiRequest("/messages/requests/buyer"),
  getConversations: () => apiRequest("/messages/conversations"),
  updateRequestStatus: (requestId: number, status: string) =>
    apiRequest(`/messages/requests/${requestId}/status?status=${status}`, {
      method: "PATCH",
    }),
  sendMessage: (messageData: any) =>
    apiRequest("/messages/chat", {
      method: "POST",
      body: JSON.stringify(messageData),
    }),
  getChatHistory: (otherUserId: number | string) =>
    apiRequest(`/messages/chat/${otherUserId}`),
};

export const aiApi = {
  getRecommendation: (farmData: any) =>
    apiRequest("/ai/recommend", {
      method: "POST",
      body: JSON.stringify(farmData),
    }),
};

export const adminApi = {
  getStats: () => apiRequest("/admin/stats"),
  getRecentUsers: (limit: number = 5) => apiRequest(`/admin/recent-users?limit=${limit}`),
  getUnverifiedBuyers: () => apiRequest("/admin/unverified-buyers"),
  verifyBuyer: (buyerId: number) =>
    apiRequest(`/admin/verify-buyer/${buyerId}`, {
      method: "POST",
    }),
  getUnverifiedFarmers: () => apiRequest("/admin/unverified-farmers"),
  verifyFarmer: (farmerId: number) =>
    apiRequest(`/admin/verify-farmer/${farmerId}`, {
      method: "POST",
    }),
};

export const recommendationsApi = {
  getFarmerRecommendations: () => apiRequest("/recommendations/farmer"),
  getBuyerRecommendations: () => apiRequest("/recommendations/buyer"),
};
