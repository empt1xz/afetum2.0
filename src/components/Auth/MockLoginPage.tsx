"use client";

import { clearMockUser, demoUser, loadMockUser, saveMockUser, type MockUser } from "@/lib/mockSession";
import { ArrowLeft, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const memoryImages = [
  "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=500&q=80",
  "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=500&q=80",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500&q=80",
  "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=500&q=80",
];

const createMockUser = (payload: {
  name: string;
  email: string;
  username: string;
}): MockUser => {
  const email = payload.email.trim().toLowerCase();
  const displayName = payload.name.trim() || email.split("@")[0] || "Cliente Afetum";

  return {
    ...demoUser,
    uid: `mock-${Date.now()}`,
    email,
    displayName,
    username: payload.username.trim() || email.split("@")[0] || "cliente",
    nickname: displayName.split(" ")[0],
  };
};

export default function MockLoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("demo@afetum.com");
  const [password, setPassword] = useState("afetumdemo");
  const [username, setUsername] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [redirectTo, setRedirectTo] = useState("/dashboard");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("redirect") || "/dashboard";
    const safeNext = next.startsWith("/") ? next : "/dashboard";
    setRedirectTo(safeNext);

    if (loadMockUser()) {
      router.replace(safeNext);
    }
  }, [router]);

  const handleUsernameChange = (value: string) => {
    setUsername(value.toLowerCase().replace(/[^a-z0-9_]/g, ""));
  };

  const finishMockLogin = (user: MockUser) => {
    saveMockUser(user);
    window.setTimeout(() => router.replace(redirectTo), 150);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Informe um e-mail para continuar.");
      return;
    }

    if (!password.trim()) {
      setError("Informe uma senha para continuar.");
      return;
    }

    if (isSignUp && username.trim().length < 3) {
      setError("O usuario deve ter pelo menos 3 caracteres.");
      return;
    }

    setIsLoading(true);
    finishMockLogin(createMockUser({ name, email, username }));
  };

  const handleGoogleLogin = () => {
    setError("");
    setIsLoading(true);
    finishMockLogin({
      ...demoUser,
      uid: `google-mock-${Date.now()}`,
      displayName: "Cliente Google",
      email: "cliente.google@afetum.com",
      username: "clientegoogle",
      nickname: "Cliente",
    });
  };

  const handleResetPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResetMessage("E-mail de redefinicao mockado enviado.");
    window.setTimeout(() => {
      setShowResetModal(false);
      setResetMessage("");
      setResetEmail("");
    }, 1800);
  };

  const toggleMode = () => {
    setError("");
    setIsSignUp((current) => !current);
  };

  return (
    <div className="min-h-screen w-full flex bg-white relative overflow-hidden">
      <div className="hidden lg:flex w-1/2 relative bg-brand-dark overflow-hidden flex-col items-center justify-center border-r border-brand-border/10">
        <div className="absolute inset-0 opacity-40">
          <div className="grid grid-cols-2 gap-4 p-8 transform rotate-3 scale-110">
            <div className="space-y-4 animate-[float_15s_ease-in-out_infinite]">
              <div className="rounded-2xl overflow-hidden aspect-[3/4]">
                <img src={memoryImages[0]} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-square">
                <img src={memoryImages[1]} className="w-full h-full object-cover" alt="" />
              </div>
            </div>
            <div className="space-y-4 animate-[float_20s_ease-in-out_infinite_reverse]">
              <div className="rounded-2xl overflow-hidden aspect-square">
                <img src={memoryImages[2]} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-[3/4]">
                <img src={memoryImages[3]} className="w-full h-full object-cover" alt="" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent" />

        <div className="relative z-10 text-center px-12 max-w-lg">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-2xl">
            <div className="text-4xl">✦</div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Torne isso <span className="text-brand-accent italic font-[var(--playfair)]">Inesquecivel</span>
          </h2>
          <p className="text-brand-muted text-lg font-light leading-relaxed">
            Junte-se a milhares de pessoas que estao transformando sentimentos em experiencias digitais.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-5 sm:p-12 pt-20 sm:pt-24 lg:pt-12 relative bg-[#FDFBF9]">
        <div className="absolute top-6 left-6 lg:hidden">
          <img src="/logotipo.svg" className="h-8 w-auto" alt="Afetum" />
        </div>

        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-brand-dark mb-2 tracking-tight">
              {isSignUp ? "Crie sua conta" : "Bem-vindo"}
            </h1>
            <p className="text-brand-muted text-sm">
              {isSignUp ? "Comece a criar suas memorias." : "Entre para continuar criando memorias."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-brand-border/60 p-4 rounded-xl hover:bg-gray-50 transition-all shadow-sm hover:shadow-md mb-8 group disabled:opacity-70"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt=""
              className="w-5 h-5 group-hover:scale-110 transition-transform"
            />
            <span className="text-sm font-bold text-brand-dark/80">Continuar com Google</span>
          </button>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-border/30" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#FDFBF9] px-4 text-brand-muted font-bold tracking-widest">
                Ou continue com
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-dark/70 uppercase tracking-wide ml-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required={isSignUp}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-brand-border/50 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all text-sm font-medium"
                    placeholder="Nome"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-dark/70 uppercase tracking-wide ml-1">
                    Usuario
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(event) => handleUsernameChange(event.target.value)}
                    required={isSignUp}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-brand-border/50 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all text-sm font-medium"
                    placeholder="@usuario"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-dark/70 uppercase tracking-wide ml-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white border border-brand-border/50 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all text-sm font-medium"
                placeholder="exemplo@email.com"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-brand-dark/70 uppercase tracking-wide">
                  Senha
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => setShowResetModal(true)}
                    className="text-[10px] font-bold text-brand-accent hover:underline"
                  >
                    Esqueceu?
                  </button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white border border-brand-border/50 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all text-sm font-medium"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 text-xs p-3 rounded-lg flex items-center gap-2 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-brand-dark text-white font-bold rounded-xl hover:bg-brand-accent transition-all shadow-lg hover:shadow-brand-dark/20 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : isSignUp ? "Criar conta" : "Entrar"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-brand-muted">
            {isSignUp ? "Ja tem uma conta?" : "Nao tem uma conta?"}{" "}
            <button onClick={toggleMode} className="text-brand-accent font-bold hover:underline">
              {isSignUp ? "Entrar" : "Criar agora"}
            </button>
          </div>

          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => {
                clearMockUser();
                router.push("/");
              }}
              className="text-xs font-bold text-brand-muted/50 uppercase tracking-widest hover:text-brand-dark transition-colors flex items-center justify-center gap-2 mx-auto group"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Voltar ao inicio
            </button>
          </div>
        </div>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-t-[1.5rem] sm:rounded-3xl p-5 sm:p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 relative">
            <button
              type="button"
              onClick={() => setShowResetModal(false)}
              className="absolute top-4 right-4 text-brand-muted hover:text-brand-dark"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-brand-dark mb-2">Redefinir Senha</h3>
            <p className="text-sm text-brand-muted mb-6">Digite seu e-mail para receber as instrucoes.</p>

            {resetMessage ? (
              <div className="bg-green-50 text-green-600 text-sm p-4 rounded-xl font-bold text-center mb-4">
                {resetMessage}
              </div>
            ) : (
              <form onSubmit={handleResetPassword}>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(event) => setResetEmail(event.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-brand-border focus:border-brand-accent outline-none mb-4 text-sm"
                  placeholder="Seu email cadastrado"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-brand-dark text-white rounded-xl font-bold hover:bg-brand-accent transition-colors"
                >
                  Enviar Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
