import { HeaderMobile } from "@/src/components/header/mobile";
import { FooterMobile } from "@/src/components/footer/mobile";
import { OpenAgentButton } from "@/src/components/reusable/buttons";
import { ServicesHero } from "@/src/components/services/hero";
import { ServicesCatalog } from "@/src/components/services/catalog";
import { ServicesTech } from "@/src/components/services/tech";
import { ServicesFAQ } from "@/src/components/services/faq";
import { ServicesCTA } from "@/src/components/services/cta";

export default function Services() {
    return (<div className="mt-14">
        <HeaderMobile />

        <ServicesHero />
        <ServicesCatalog />
        <ServicesTech />
        <ServicesFAQ />
        <ServicesCTA />
        
        <OpenAgentButton />
        <FooterMobile />
    </div>)
}