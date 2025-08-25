"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import z from "zod";

import { getCart } from "@/actions/get-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { shippingAddressTable } from "@/db/schema";
import { useCreateShippingAddress } from "@/hooks/mutations/use-create-shipping-address";
import { useUpdateCartShippingAddress } from "@/hooks/mutations/use-update-cart-shipping-address";
import { useCart } from "@/hooks/queries/use-cart";
import { useShippingAddresses } from "@/hooks/queries/use-shipping-addresses";

import { formatAddress } from "../../helpers/address";

const addressFormSchema = z.object({
  email: z.string().email("Email inválido"),
  fullName: z.string().min(1, "Nome completo é obrigatório"),
  cpf: z.string().min(14, "CPF é obrigatório"),
  phone: z.string().min(15, "Celular é obrigatório"),
  cep: z.string().min(9, "CEP é obrigatório"),
  address: z.string().min(1, "Endereço é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

interface AddressProps {
  userShippingAddresses: (typeof shippingAddressTable.$inferSelect)[];
  defaultShippingAddressId: string | null;
}

const Addresses = ({
  userShippingAddresses,
  defaultShippingAddressId,
}: AddressProps) => {
  const router = useRouter();

  const [selectedAddress, setSelectedAddress] = useState<string | null>(
    defaultShippingAddressId || null
  );
  const [isAddressUpdated, setIsAddressUpdated] = useState(
    !!defaultShippingAddressId
  );
  const createShippingAddressMutation = useCreateShippingAddress();
  const updateCartShippingAddressMutation = useUpdateCartShippingAddress();
  const { data: shippingAddresses, isLoading } = useShippingAddresses({
    initialData: userShippingAddresses,
  });

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      email: "",
      fullName: "",
      cpf: "",
      phone: "",
      cep: "",
      address: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  const onSubmit = async (values: AddressFormValues) => {
    try {
      const newAddress = await createShippingAddressMutation.mutateAsync(
        values
      );
      if (newAddress?.id) {
        await updateCartShippingAddressMutation.mutateAsync(newAddress.id);
        setIsAddressUpdated(true);
        setSelectedAddress(newAddress.id);
      }
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleExistingAddressSelect = async (addressId: string) => {
    try {
      await updateCartShippingAddressMutation.mutateAsync(addressId);
      setIsAddressUpdated(true);
    } catch (error) {
      console.error("Error updating cart shipping address:", error);
      setIsAddressUpdated(false);
    }
  };

  const handlePaymentRedirect = () => {
    if (!selectedAddress || selectedAddress === "add_new") return;

    try {
      toast.success("Endereço selecionado para entrega!");
      router.push("/cart/confirmation");
    } catch (error) {
      toast.error("Erro ao selecionar endereço. Tente novamente.");
      console.log(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identificação</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4 text-muted-foreground">
            Carregando endereços...
          </div>
        ) : (
          <RadioGroup
            value={selectedAddress}
            onValueChange={(value) => {
              setSelectedAddress(value);
              if (value && value !== "add_new") {
                setIsAddressUpdated(true);
                handleExistingAddressSelect(value);
              } else {
                setIsAddressUpdated(false);
              }
            }}
          >
            {shippingAddresses && shippingAddresses.length > 0 ? (
              shippingAddresses.map((address) => (
                <Card key={address.id} className="mb-3">
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={address.id} id={address.id} />
                      <Label htmlFor={address.id} className="cursor-pointer">
                        <p className="text-sm">{formatAddress(address)}</p>
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Nenhum endereço cadastrado
              </div>
            )}

            <Card>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="add_new" id="add_new" />
                  <Label htmlFor="add_new" className="cursor-pointer">
                    Adicionar novo endereço
                  </Label>
                </div>
              </CardContent>
            </Card>
          </RadioGroup>
        )}
        {selectedAddress === "add_new" && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Novo Endereço</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite seu email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome completo</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Digite seu nome completo"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cpf"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPF</FormLabel>
                          <FormControl>
                            <PatternFormat
                              format="###.###.###-##"
                              mask="_"
                              placeholder="000.000.000-00"
                              customInput={Input}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Celular</FormLabel>
                          <FormControl>
                            <PatternFormat
                              format="(##) #####-####"
                              mask="_"
                              placeholder="(11) 99999-9999"
                              customInput={Input}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cep"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CEP</FormLabel>
                          <FormControl>
                            <PatternFormat
                              customInput={Input}
                              format="#####-###"
                              mask="_"
                              placeholder="00000-000"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Endereço</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite o endereço" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite o número" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="complement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Complemento (opcional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Digite o complemento"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="neighborhood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bairro</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite o bairro" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite a cidade" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite o estado" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={createShippingAddressMutation.isPending}
                    >
                      {createShippingAddressMutation.isPending ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Salvar Endereço"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {selectedAddress && selectedAddress !== "add_new" && (
          <div className="flex mt-4">
            <Button
              onClick={handlePaymentRedirect}
              disabled={updateCartShippingAddressMutation.isPending}
              className="w-full"
            >
              {updateCartShippingAddressMutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Ir para pagamento"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Addresses;
