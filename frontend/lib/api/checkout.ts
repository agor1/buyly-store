import api from "./api";
import type { ShippingOption } from "@/lib/checkout-options";

interface CheckoutOptionsResponse {
  shippingOptions: ShippingOption[];
}

export const getCheckoutOptions = async (): Promise<CheckoutOptionsResponse> => {
  const response = await api.get<CheckoutOptionsResponse>("/checkout/options");

  return response.data;
};
