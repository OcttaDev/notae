"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/app/_components/ui/form";

import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export default function Home() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    // Simular requisição (substitua pelo seu fluxo real)
    try {
      console.log("Login submit =>", { ...values, remember });
      await new Promise((r) => setTimeout(r, 700));
      // aqui você chamaria sua API / better-auth
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6">
      <div className="w-full max-w-md bg-white/5 border border-slate-800 rounded-2xl shadow-2xl p-6 backdrop-blur-md">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-violet-400">
            Notae
          </h1>
          <p className="text-sm text-neutral-300">Acesso seguro à sua conta — tecnologia moderna</p>
        </header>

        <div className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="usuario@exemplo.com"
                        type="email"
                        {...field}
                        className="bg-white/5"
                      />
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
                      <Input
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        {...field}
                        className="bg-white/5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end mt-1">


                <a href="/recuperar-senha" className="text-sm text-cyan-300 hover:underline">Esqueceu a senha?</a>
              </div>

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" /> Entrando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Entrar
                  </span>
                )}
              </Button>
            </form>
          </Form>

          <div className="pt-3 border-t border-slate-700 text-center">
            <p className="text-xs text-neutral-400">Ainda não tem conta? <a href="/autenticacao/criar-conta" className="text-cyan-300 hover:underline">Criar conta</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
