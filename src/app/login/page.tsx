"use client";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().min(1, "Digite seu email").email("Digite um email válido"),

  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function Login() {
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
            <div className="passwordHeader">
              <label>SENHA</label>

              <button type="button">Esqueceu?</button>
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
            Entrar
          </button>

          <p className="registerText">
            Não tem uma conta? <span>Criar agora</span>
          </p>

          <button type="button" className="backButton">
            ← VOLTAR AO INÍCIO
          </button>
        </form>
      </section>

    </main>
  );
}
