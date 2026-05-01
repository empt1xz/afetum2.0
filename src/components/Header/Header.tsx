import Style from "./header.module.css";

export default function Header() {
  return (
    <>
      <header id="header" className={Style.header}>
       <img src="./logotipo.svg" alt="" />
        <nav>
          <ul>
            <li>SOBRE</li>
            <li>PREÇO</li>
            <li>FAQ</li>
          </ul>
        </nav>

        <button>
            Entrar
        </button>
      </header>
    </>
  );
}
