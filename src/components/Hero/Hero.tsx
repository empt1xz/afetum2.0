import Style from "./hero.module.css";
import Telephone from "../Telephone/Telephone";
import { Eye, Heart } from "lucide-react";
export default function Hero() {
  return (
    <>
      <main className={Style.main} >
        <div className={Style.cto} id="heroLeft">
          <h1>
            Não dê apenas um presente
          </h1>
          <h2>
            Eternize uma história
          </h2>

          <p>
            Surpreenda quem você ama com uma experiência digital imersiva. Junte suas melhores fotos, aquela música especial e uma mensagem do coração em um site único e interativo.
          </p>

          <div className={Style.buttons}>
            <button> <Heart /> Criar minha página</button>
            <button><Eye /> Ver modelo</button>
          </div>
        </div>

        <Telephone />
      </main>
    </>
  );
}
