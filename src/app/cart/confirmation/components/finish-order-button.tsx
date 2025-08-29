"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";
import { useState } from "react";

import { createCheckoutSession } from "@/actions/create-checkout-session";
import { Button } from "@/components/ui/button";
import { useFinishOrder } from "@/hooks/mutations/use-finish-order";

const FinishOrderButton = () => {
  const [sucessDialogIsOpen, setSucessDialogIsOpen] = useState(false);
  const finishOrderMutation = useFinishOrder();
  const handleFinishOrder = async () => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      throw new Error("Stripe publishable key if not set");
    }
    const { orderId } = await finishOrderMutation.mutateAsync();
    const checkoutSession = await createCheckoutSession({
      orderId,
    });

    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    );
    if (!stripe) {
      throw new Error("Failed to load stripe");
    }

    await stripe.redirectToCheckout({
      sessionId: checkoutSession.id,
    });

    setSucessDialogIsOpen(true);
  };

  return (
    <>
      <Button
        className="w-full rounded-full"
        size="lg"
        onClick={handleFinishOrder}
        disabled={finishOrderMutation.isPending}
      >
        {finishOrderMutation.isPending && (
          <Loader2 className="animate-spin h-4 w-4" />
        )}
        Finalizar compra
      </Button>
    </>
  );
};

export default FinishOrderButton;
