import Style from "./page.module.css";
import Cards from "@/components/Cards/Cards";
import Header from "@/components/Header/Header";
import { Gift, Music, Send, Sparkle, Sparkles, User } from "lucide-react";

export default function About() {
  return (
    <>
    <Header/>
      <main className={Style.main}>
        <h1>Por que Afetum?</h1>
        <p>Mais do que um cartão, uma memória.</p>

        <section>
          <Cards
            Theme="light"
            Icon={Gift}
            Title="Imersão Total"
            Description="Esqueça cartões estáticos. Entregue uma experiência de tela cheia com animações e música."
          />
          <Cards
            Theme="dark"
            Icon={Sparkles}
            Title="Sugestão de Mensagem"
            Description="Sem palavras? Use ideias prontas para montar um texto emocionante e personalizado"
          />
          <Cards
            Theme="light"
            Icon={Music}
            Title="Música Emocional"
            Description="Escolha a trilha sonora perfeita para definir o clima do seu presente."
          />
          <Cards
            Theme="dark"
            Icon={Send}
            Title="Compartilhamento Fácil"
            Description="Gere um link único e envie via WhatsApp ou redes sociais instantaneamente."
          />
        </section>
      </main>
    </>
  );
}
