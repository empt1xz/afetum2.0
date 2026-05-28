import Header from "@/components/Header/Header";
import styles from "./Faq.module.css";

const faqItems = [
  {
    id: "01",
    question: "O que é a Afetum?",
    answer:
      "A Afetum é um estúdio de criação de presentes digitais. Transformamos sentimentos em experiências web interativas quepodem ser guardadas para sempre, diferentemente de um cartão de papel que se perde ou rasga.",
  },
  {
    id: "02",
    question: "Existe versão gratuita?",
    answer:
      "Você pode criar e visualizar como ficará seu cartão gratuitamente quantas vezes quiser. O pagamento só é necessário para gerar o link final compartilhável.",
  },
  {
    id: "03",
    question: "Quais as formas de pagamento?",
    answer:
      "Aceitamos Pix (aprovação instantânea) e Cartões de Crédito (via Mercado Pago e Stripe). Todo o processo é criptografado e 100% seguro.",
  },
  {
    id: "04",
    question: "O valor é mensal?",
    answer:
      "Não. O pagamento é único por cartão criado. Uma vez pago, aquele link é seu para sempre.",
  },
  {
    id: "05",
    question: "A música toca automaticamente?",
    answer:
      "Devido ás politicas dos navegadores, o usuário precisa interagir (tocar na tela) primeiro, depois a experiência mágica começa",
  },
  {
    id: "06",
    question: "Posso editar depois de pagar?",
    answer: `Para garantir a integridade da memória, o link é "congelado" após a publicação. Se houver um erro grave de digitação, nosso suporte humano pode ajudar na correção manual.`,
  },
];

export default function Faq() {
  return (
    <>
      <Header />

      <main className={styles.container}>
        <div className={styles.backgroundGrid} />

        <section className={styles.hero}>
          <span className={styles.subtitle}>Suporte & Ajuda</span>

          <h1 className={styles.title}>Perguntas Frequentes</h1>

          <p className={styles.description}>
            Tudo o que você precisa saber para criar sua memória perfeita.
          </p>
        </section>

        <section className={styles.faqSection}>
          {faqItems.map((item) => (
            <details key={item.id} className={styles.faqItem}>
              <summary className={styles.summary}>
                <div className={styles.left}>
                  <span className={styles.number}>{item.id}</span>

                  <span className={styles.question}>{item.question}</span>
                </div>

                <div className={styles.icon}>+</div>
              </summary>

              <div className={styles.answer}>
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </section>

        <section className={styles.supportArea}>
          <div className={styles.supportCard}>
            <div>
              <h3>Precisa de mais ajuda?</h3>

              <p>
                Não encontrou o que procurava? Nossa equipe está aqui para
                ajudar você.
              </p>
            </div>

            <button className={styles.supportButton}>Falar com Suporte</button>
          </div>

          <div className={styles.sideCards}>
            <div className={styles.infoCard}>
              <span>🔒</span>

              <div>
                <h4>Privacidade Total</h4>
                <p>Dados criptografados.</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <span>⚡</span>

              <div>
                <h4>Dica Pro</h4>
                <p>Use fones de ouvido 🎧</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
