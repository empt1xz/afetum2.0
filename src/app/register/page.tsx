"use client";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().min(1, "Digite seu email").email("Digite um email válido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginSchema) {
    console.log(data);
  }

  return (
    <main className="containerLogin">
      <section className="right">
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="titleArea">
            <h2>Bem-vindo</h2>

            <p>Entre para continuar criando memórias.</p>
          </div>

          <button type="button" className="googleButton">
            <FcGoogle size={24} />
            Continuar com Google
          </button>

          <div className="separator">
            <div className="line" />
            <span>OU CONTINUE COM</span>
            <div className="line" />
          </div>

          <div className="field">
            <label>EMAIL</label>

            <input
              type="email"
              placeholder="exemplo@email.com"
              {...register("email")}
            />

            {errors.email && (
              <span className="error">{errors.email.message}</span>
            )}
          </div>

          <div className="field">
            <label>Usuario</label>

            <input
              type="text"
              placeholder="Nome de usuario"
              {...register("email")}
            />

            {errors.email && (
              <span className="error">{errors.email.message}</span>
            )}
          </div>

          <div className="field">
            <div className="passwordHeader">
              <label>SENHA</label>
            </div>

            <input
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />

            {errors.password && (
              <span className="error">{errors.password.message}</span>
            )}
          </div>

          <button className="submitButton" type="submit">
            Registrar
          </button>

          <button type="button" className="backButton">
            <Link href="/">← VOLTAR AO INÍCIO</Link>
          </button>
        </form>
      </section>
    </main>
  );
}
