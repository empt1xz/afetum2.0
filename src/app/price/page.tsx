import Header from "@/components/Header/Header";
import styles from "./style.module.css";
import { Heart, Gem, Check, X, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className={styles.container}>
      <Header />
      <div className={styles.blurOne}></div>
      <div className={styles.blurTwo}></div>

      <section className={styles.hero}>
        <span className={styles.badgeTop}>SEM MENSALIDADES</span>

        <h1>Escolha seu Presente</h1>

        <p>
          Crie algo único para quem você ama. Pague apenas quando estiver pronto
          para enviar.
        </p>
      </section>

      <section className={styles.cards}>
        {/* CARD 1 */}
        <div className={`${styles.card} ${styles.disabled}`}>
          <div className={styles.cardTop}>
            <span className={styles.badgeSoon}>EM BREVE</span>

            <button className={styles.iconButton}>
              <Heart size={16} />
            </button>
          </div>

          <div>
            <h2>Carta Secreta</h2>

            <p className={styles.description}>
              Envie uma mensagem misteriosa e direta via WhatsApp.
            </p>
          </div>

          <div className={styles.priceArea}>
            <span className={styles.currency}>R$</span>

            <strong>5,99</strong>

            <span className={styles.send}>/envio</span>
          </div>

          <ul className={styles.features}>
            <li>
              <Check size={16} />
              Envio Direto no WhatsApp
            </li>

            <li>
              <Check size={16} />
              Texto Personalizado
            </li>

            <li>
              <Check size={16} />
              Remetente Anônimo
            </li>

            <li className={styles.disabledFeature}>
              <X size={16} />
              Sem Multimídia
            </li>
          </ul>
        </div>

        {/* CARD 2 */}
        <div className={`${styles.card} ${styles.activeCard}`}>
          <div className={styles.cardTop}>
            <span className={styles.badgePopular}>O MAIS VENDIDO</span>

            <button className={styles.iconButtonOrange}>
              <Gem size={16} />
            </button>
          </div>

          <div>
            <h2>Memória Eterna</h2>

            <p className={styles.description}>
              A experiência completa: Site interativo, música e fotos.
            </p>
          </div>

          <div className={styles.pricing}>
            <div className={styles.oldPriceRow}>
              <span className={styles.oldPrice}>R$ 42,90</span>

              <span className={styles.offer}>OFERTA</span>
            </div>

            <div className={styles.newPriceRow}>
              <span className={styles.currency}>R$</span>

              <strong>19,90</strong>

              <span className={styles.oneTime}>PAGAMENTO ÚNICO</span>
            </div>
          </div>

          <div className={styles.featureBox}>
            <ul className={styles.features}>
              <li>
                <Check size={16} />
                Site Exclusivo e Vitalício
              </li>

              <li>
                <Check size={16} />
                Segurança Criptografada
              </li>

              <li>
                <Check size={16} />
                Galeria de Fotos (até 6)
              </li>

              <li>
                <Check size={16} />
                Trilha Sonora Personalizada
              </li>

              <li>
                <Check size={16} />
                Acesso a Todos os Temas
              </li>
            </ul>
          </div>

          <button className={styles.button}>
            Criar Memória
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </main>
  );
}
