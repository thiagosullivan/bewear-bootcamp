"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFinishOrder } from "@/hooks/mutations/use-finish-order";

const FinishOrderButton = () => {
  const [sucessDialogIsOpen, setSucessDialogIsOpen] = useState(false);
  const finishOrderMutation = useFinishOrder();
  const handleFinishOrder = () => {
    finishOrderMutation.mutate();
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
      <Dialog open={sucessDialogIsOpen} onOpenChange={setSucessDialogIsOpen}>
        <DialogContent className="text-center">
          <Image
            src="/illustration.svg"
            alt="Sucess"
            width={300}
            height={300}
            className="mx-auto"
          />
          <DialogTitle className="text-2xl mt-4">Pedido efetuado!</DialogTitle>
          <DialogDescription className="font-medium">
            Seu pedido foi efetuado com sucesso. Você pode acompanhar o status
            na seção de “Meus Pedidos”.
          </DialogDescription>
          <DialogFooter>
            <Button className="rounded-full" size="lg">
              Ver meus pedidos
            </Button>
            <Button
              className="rounded-full"
              size="lg"
              variant="outline"
              asChild
            >
              <Link href="/">Voltar para a loja</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FinishOrderButton;
