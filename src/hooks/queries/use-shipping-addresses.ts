import { useQuery } from "@tanstack/react-query";

import { getShippingAddresses } from "@/actions/get-shipping-addresses";

export const shippingAddressesQueryKey = () => ["shipping-addresses"] as const;

export const useShippingAddresses = () => {
  return useQuery({
    queryKey: shippingAddressesQueryKey(),
    queryFn: async () => {
      return getShippingAddresses();
    },
  });
};
