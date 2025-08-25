"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function updateCartShippingAddress(shippingAddressId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado");
  }

  try {
    await db
      .update(cartTable)
      .set({ shippingAddressId })
      .where(eq(cartTable.userId, session.user.id));

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar endereço do carrinho:", error);
    throw new Error("Erro ao atualizar endereço do carrinho");
  }
}
