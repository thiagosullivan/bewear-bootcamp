"use server";

import { headers } from "next/headers";

import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const getShippingAddresses = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const shippingAddresses = await db.query.shippingAddressTable.findMany({
    where: (shippingAddress, { eq }) =>
      eq(shippingAddress.userId, session.user.id),
    orderBy: (shippingAddress, { desc }) => [desc(shippingAddress.createdAt)],
  });

  return shippingAddresses;
};
