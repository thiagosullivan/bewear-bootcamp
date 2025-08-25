import z from "zod";

export const finishOrderSchema = z.object({
  shippingAddressId: z.uuid(),
  items: z.array(
    z.object({
      productVariantId: z.uuid(),
      quantity: z.number().min(1),
    })
  ),
});
