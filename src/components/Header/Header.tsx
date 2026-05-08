import Style from "./header.module.css";
import Link from 'next/link'

export default function Header() {
  return (
    <>
      <header id="header" className={Style.header}>
       <Link href='/'><img src="./logotipo.svg" alt="" /></Link>
        <nav>
          <ul>
            <li><Link href='about'>AFETUM</Link></li>
            <li><Link href='price'>PREÇO</Link></li>
            <li><Link href='faq'>FAQ</Link></li>
          </ul>
        </nav>

        <button>
            <Link href="/login">Entrar</Link>
        </button>
      </header>
    </>
  );
}
