"use client";
import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";
import gsap from "gsap";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const timeline = gsap.timeline();

    timeline
      .fromTo(
        "#header",
        {
          opacity: 0,
          y: -50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
        },
      )
      .fromTo(
        "#heroLeft",
        {
          opacity: 0,
          x: 120,
        },
        {
          opacity: 1,
          x: 0,
          duration: 1,
        },
      )
      .fromTo(
        "#mockup",
        {
          opacity: 0,
          x: -120,
        },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          
        },
      "-=0.5");
  }, []);

  return (
    <>
      <Header />
      <Hero />
    </>
  );
}
