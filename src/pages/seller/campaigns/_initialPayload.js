// src/pages/seller/campaigns/_initialPayload.js
export const initialCampaignPayload = {
  basics: {
    name: "",
    kind: "BasketAmountOff",
    startsAt: "",
    endsAt: "",
    requiresCoupon: false,
    couponCode: "",
    priority: 0,
    status: "Draft",
  },
  targeting: {
    scope: "AllProducts",
    items: [],
  },
  criteria: {
    amountOff: 0,
    percentOff: 0,
    currency: "TRY",
    perOrderRepeatLimit: 0,
    totalOrderUsageLimit: 0,
    premiumOnly: false,
    perCustomerOnce: false,
    advancedCriterias: [],
  },
};
