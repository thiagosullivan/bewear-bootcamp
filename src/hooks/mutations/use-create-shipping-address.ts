import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createShippingAddress } from "@/actions/create-shipping-address";
import type { CreateShippingAddressSchema } from "@/actions/create-shipping-address/schema";
import { shippingAddressesQueryKey } from "@/hooks/queries/use-shipping-addresses";

export const createShippingAddressMutationKey = () =>
  ["create-shipping-address"] as const;

export const useCreateShippingAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: createShippingAddressMutationKey(),
    mutationFn: async (data: CreateShippingAddressSchema) => {
      return createShippingAddress(data);
    },
    onSuccess: () => {
      toast.success("Endereço criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: shippingAddressesQueryKey() });
    },
    onError: (error) => {
      toast.error("Erro ao criar endereço. Tente novamente.");
      console.error("Error creating shipping address:", error);
    },
  });
};
