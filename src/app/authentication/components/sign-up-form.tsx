'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
    name: z.string("Nome inválido.").trim().min(1, 'Nome é obrigatório.'),
    email: z.email("Email inválido."),
    password: z.string("Esse campo não pode estar vazio.").min(8, "A senha precisa ter ao menos 8 caracteres."),
    passwordConformation: z.string("Esse campo não pode estar vazio.").min(8, "A senha precisa ter ao menos 8 caracteres."),
}).refine((data) => {
    return data.password === data.passwordConformation;
}, {
    error: "As senhas não coincidem.",
    path: ["passwordConformation"]
})

type FormValues = z.infer<typeof formSchema>

const SignUpForm = () => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            passwordConformation: '',
        },
    })

    function onSubmit(values: FormValues) {
        console.log('FORMULÁRIO VALIDO E ENVIADO')
        console.log(values)
    }
      
    return (
        <>
            <Card>
                <CardHeader>
                <CardTitle>Criar conta</CardTitle>
                <CardDescription>
                    Crie sua conta para continuar
                </CardDescription>
                </CardHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <CardContent className="grid gap-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input placeholder="Digite seu nome" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
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
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Senha</FormLabel>
                                <FormControl>
                                    <Input placeholder="Digite sua senha" {...field} type="password"/>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="passwordConformation"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Confirmar Senha</FormLabel>
                                <FormControl>
                                    <Input placeholder="Digite novamente sua senha" {...field} type="password"/>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Criar Conta</Button>
                    </CardFooter>
                    </form>
                </Form>
            </Card>
        </>
    );
}
 
export default SignUpForm;