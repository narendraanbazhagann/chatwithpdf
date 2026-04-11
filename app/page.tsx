import { HeroSection } from "@/components/landing/hero-section";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  return <HeroSection />;
}
