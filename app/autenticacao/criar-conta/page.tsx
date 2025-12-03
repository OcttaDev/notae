"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormControl,
} from "@/app/_components/ui/form";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/app/_components/ui/card";

import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";

import Image from "next/image";
import { Loader2, X, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/app/_lib/auth-client";

const signUpSchema = z
    .object({
        firstName: z.string().min(2, "Nome muito curto"),
        lastName: z.string().min(2, "Sobrenome muito curto"),
        email: z.string().email("Email inválido"),
        password: z.string().min(6, "Senha no mínimo 6 caracteres"),
        confirmPassword: z.string(),
        image: z.any().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
    });

export default function SignUp() {
    const router = useRouter();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            image: undefined,
        },
    });

    async function onSubmit(values: z.infer<typeof signUpSchema>) {
        try {
            const imageBase64 = values.image
                ? await convertImageToBase64(values.image)
                : "";

            await signUp.email({
                email: values.email,
                password: values.password,
                name: `${values.firstName} ${values.lastName}`,
                image: imageBase64,
                callbackURL: "/autenticacao/entrar",
                fetchOptions: {
                    onRequest: () => {
                        toast.loading("Criando conta...");
                    },
                    onSuccess: () => {
                        toast.success("Conta criada!");
                        router.push("/autenticacao/entrar");
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message);
                    },
                },
            });
        } catch (err) {
            toast.error("Erro ao criar conta" + err);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 p-6">
            <Card className="z-50 rounded-2xl max-w-md bg-white/5 border border-slate-800 shadow-2xl backdrop-blur-md">
                <CardHeader>
                    <CardTitle className="text-lg md:text-xl bg-clip-text text-transparent bg-linear-to-r from-cyan-300 to-violet-400">Criar conta</CardTitle>
                    <CardDescription className="text-xs md:text-sm text-neutral-300">Crie sua conta segura e comece a usar o Notae — privacidade e performance</CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                            {/* Nome + Sobrenome */}
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome</FormLabel>
                                            <FormControl>
                                                <Input placeholder="João" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sobrenome</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Silva" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>E-mail</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="usuario@exemplo.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Senha */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <FormLabel>Senha</FormLabel>
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((s) => !s)}
                                                className="text-sm text-neutral-400 hover:text-neutral-200"
                                                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>

                                        <FormControl>
                                            <Input type={showPassword ? "text" : "password"} placeholder="Senha" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Confirmar senha */}
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <FormLabel>Confirmar senha</FormLabel>
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword((s) => !s)}
                                                className="text-sm text-neutral-400 hover:text-neutral-200"
                                                aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                                            >
                                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>

                                        <FormControl>
                                            <Input type={showConfirmPassword ? "text" : "password"} placeholder="Confirmar senha" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Upload de imagem */}
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Imagem de perfil (opcional)</FormLabel>

                                        <div className="flex items-end gap-4">
                                            {imagePreview && (
                                                <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                                                    <Image src={imagePreview} alt="preview" fill className="object-cover" />
                                                </div>
                                            )}

                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        field.onChange(file);

                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => setImagePreview(reader.result as string);
                                                            reader.readAsDataURL(file);
                                                        } else {
                                                            setImagePreview(null);
                                                        }
                                                    }}
                                                />
                                            </FormControl>

                                            {imagePreview && (
                                                <X className="cursor-pointer" onClick={() => { field.onChange(undefined); setImagePreview(null); }} />
                                            )}
                                        </div>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full">
                                {form.formState.isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Criar conta"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>

                <CardFooter>
                    <div className="flex justify-center w-full border-t py-4">
                        <p className="text-center text-xs text-neutral-400">Protegido por <span className="text-cyan-300">better-auth</span></p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

async function convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
