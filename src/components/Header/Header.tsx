import Link from "next/link";
import Style from "./header.module.css";

export default function Header() {
  return (
    <header id="header" className={Style.header}>
      <Link href="/">
        <img src="/logotipo.svg" alt="Afetum" />
      </Link>
      <nav>
        <ul>
          <li>
            <Link href="/about">AFETUM</Link>
          </li>
          <li>
            <Link href="/price">PRECO</Link>
          </li>
          <li>
            <Link href="/faq">FAQ</Link>
          </li>
        </ul>
      </nav>

      <Link className={Style.loginLink} href="/login">
        Entrar
      </Link>
    </header>
  );
}
