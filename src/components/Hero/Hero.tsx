'use client'
import Style from "./hero.module.css";
import Telephone from "../Telephone/Telephone";
import { Eye, Heart } from "lucide-react";
import { useState } from 'react';

export default function Hero() {

  const [ cartas, setCartas ] = useState(0)

      async function HandleCartas () {
        const activeCartas = await fetch("/")
      }

  return (
    <>
      <main className={Style.main} >
        <div className={Style.cto} id="heroLeft">

            <div className="contagem">
              <p>
                Contagem de cartas ao vivo: {cartas}
              </p>
            </div>

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

       <div className={Style.mockup}>
         <Telephone />
       </div>
      </main>
    </>
  );
}
