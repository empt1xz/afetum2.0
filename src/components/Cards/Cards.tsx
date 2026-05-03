import type { LucideIcon } from 'lucide-react'
import Style from "./cards.module.css";

type Props = {
  Title: string;
  Description: string;
  Icon: LucideIcon;
  Theme: "light" | "dark";
};

export default function Cards({ Title, Description, Icon, Theme }: Props) {
  return (
    <>
      <div className={`${Style.card} ${Style[Theme]}`}>

       <div className={Style.iconContainer}>
         <div className={Style.icon}>
             <Icon color='white' size={28}/>
         </div>
       </div>

        <h1>{Title}</h1>

        <p>{Description}</p>
      </div>
    </>
  );
}
