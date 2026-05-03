"use client";
import { Pause, Play } from "lucide-react";
import Style from "./telephone.module.css";
import { useState, useRef } from "react";

export default function Telephone() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [play, setPlay] = useState(false);
  function Toggle() {

    if (!audioRef.current) return;

      if (play) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }

    setPlay((e) => !e);
  }

  return (
    <>
    <audio ref={audioRef} src="/music.mp3" />
      <div className={Style.container} id="mockup">
        <div className={Style.mockup}>
          <div className={Style.buttontop}></div>
          <div className={Style.buttondown}></div>
          <div className={Style.buttonright}></div>

          <div className={Style.content}>
            <div className={Style.topbar} />

            <div className={Style.tela}>
              <h1>UMA HISTORIA PARA GUARDAR</h1>
              <p>ANA ❤️ LEO</p>

              <div className={Style.musica}>
                <img
                  src="https://www.vagalume.com.br/ed-sheeran/discografia/x-letras-11.webp"
                  alt=""
                />

                <div>
                  <p>Clique para tocar</p>
                  <strong>Photograph</strong>
                  <p>Ed Sheeran</p>
                </div>

                {play ? <Pause onClick={Toggle} /> : <Play onClick={Toggle} /> }
              </div>

              <img
                src="https://static.vecteezy.com/system/resources/previews/004/915/282/non_2x/love-couple-holidays-vacation-and-friendship-concept-wedding-free-photo.jpg"
                alt=""
              />

              <div className={Style.tempo}>
                <p>Juntos há</p>

                <div className={Style.containerTempo}>
                  <div>
                    <p>04</p> <span>Anos</span>
                  </div>
                  <div>
                    <p>06</p> <span>Meses</span>
                  </div>
                  <div>
                    <p>06</p> <span>Meses</span>
                  </div>
                  <div>
                    <p>06</p> <span>Meses</span>
                  </div>
                  <div>
                    <p>06</p> <span>Meses</span>
                  </div>
                  <div>
                    <p>06</p> <span>Meses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
