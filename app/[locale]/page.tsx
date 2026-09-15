import { FooterMobile } from "@/src/components/footer/mobile";
import { HeaderMobile } from "@/src/components/header/mobile";
import { MainHero } from "@/src/components/home/hero";
import { MainServices } from "@/src/components/home/services";
import { HowItWorks } from "@/src/components/home/process";
import { MainWorks } from "@/src/components/home/works";
import { MainCTA } from "@/src/components/home/cta";
import { OpenAgentButton } from "@/src/components/reusable/buttons";

export default function Home() {
  return (
    <>
      <HeaderMobile />

      <MainHero />
      <MainServices />
      <HowItWorks />
      <MainWorks />
      <MainCTA />

      <OpenAgentButton />
      <FooterMobile />
    </>
  )
}
