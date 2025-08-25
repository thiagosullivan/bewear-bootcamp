import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { db } from "@/db";
import { cartTable, shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import CartSummary from "../components/cart-summary";
import Addresses from "./components/addresses";

const IdentificationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    redirect("/");
  }

  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    redirect("/");
  }

  const userShippingAddresses = await db.query.shippingAddressTable.findMany({
    where: eq(shippingAddressTable.userId, session.user.id),
  });

  const cartTotalInCents = cart.items.reduce(
    (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
    0
  );

  return (
    <div className="space-y-12">
      <Header />
      <div className="px-5 space-y-4">
        <Addresses
          userShippingAddresses={userShippingAddresses}
          defaultShippingAddressId={cart.shippingAddress?.id || null}
        />
        <CartSummary
          subtotalInCents={cartTotalInCents}
          totalInCents={cartTotalInCents}
          products={cart.items.map((item) => ({
            id: item.productVariant.id,
            name: item.productVariant.name,
            variantName: item.productVariant.product.name,
            quantity: item.quantity,
            princeInCents: item.productVariant.priceInCents,
            imageUrl: item.productVariant.imageUrl,
          }))}
        />
      </div>
      <Footer />
    </div>
  );
};

export default IdentificationPage;
