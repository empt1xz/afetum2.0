import Style from "./telephone.module.css";

export default function Telephone() {
  return (
    <>
      <div className={Style.container} id="mockup">
        <div className={Style.mockup}>
          <div className={Style.buttontop}></div>
          <div className={Style.buttondown}></div>
          <div className={Style.buttonright}></div>

          <div className={Style.content}>
            <div className={Style.topbar} />

            <div>
              <h1>UMA HISTORIA PARA GUARDAR</h1>
              <p>João ❤️ Manuela</p>

              <div className="music">
                <p>musica</p>
              </div>

              <img
                src="https://static.vecteezy.com/system/resources/previews/004/915/282/non_2x/love-couple-holidays-vacation-and-friendship-concept-wedding-free-photo.jpg"
                alt=""
              />

              <div className="tempo">
                <p>Juntos há</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
