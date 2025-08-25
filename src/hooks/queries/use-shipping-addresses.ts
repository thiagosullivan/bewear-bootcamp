import { useQuery } from "@tanstack/react-query";

import { getShippingAddresses } from "@/actions/get-shipping-addresses";
import { shippingAddressTable } from "@/db/schema";

export const shippingAddressesQueryKey = () => ["shipping-addresses"] as const;

export const useShippingAddresses = (params?: {
  initialData?: (typeof shippingAddressTable.$inferSelect)[];
}) => {
  return useQuery({
    queryKey: shippingAddressesQueryKey(),
    queryFn: getShippingAddresses,
    initialData: params?.initialData,
  });
};
