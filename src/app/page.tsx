import Background from "@/components/Background/Silk";
import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";

export default function Home() {
  return (
    <>
      <div className="background">
        <Background />
      </div>
      <Header />
      <Hero />
    </>
  );
}
