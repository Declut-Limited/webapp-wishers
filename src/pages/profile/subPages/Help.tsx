import { useState } from "react";
import { PiChatsCircleBold, PiEnvelopeSimpleBold, PiMagnifyingGlassBold, PiWhatsappLogoBold } from "react-icons/pi";
import { BackLink } from "@/components/BackLink";
import { PageHeader } from "@/components/PageHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { FAQ_SECTIONS } from "@/constants/faqs";

const SUPPORT_EMAIL = "support@wishers.app";
const WHATSAPP_NUMBER = "2349057643470";
const LIVE_CHAT_URL = "https://tawk.to/chat/693b4b7e66ccb91985cf4fa4/1jc7ptppl";

const CONTACTS = [
    { title: "WhatsApp", subtitle: "+234 905 764 3470", href: `https://wa.me/${WHATSAPP_NUMBER}`, icon: PiWhatsappLogoBold },
    { title: "Email", subtitle: SUPPORT_EMAIL, href: `mailto:${SUPPORT_EMAIL}`, icon: PiEnvelopeSimpleBold },
    { title: "Live chat", subtitle: "Chat with our team in your browser", href: LIVE_CHAT_URL, icon: PiChatsCircleBold },
];

export default function Help() {
    const [query, setQuery] = useState("");
    const q = query.trim().toLowerCase();
    const sections = FAQ_SECTIONS.map((s) => ({
        ...s,
        items: q ? s.items.filter((i) => i.title.toLowerCase().includes(q) || i.content.toLowerCase().includes(q)) : s.items,
    })).filter((s) => s.items.length);

    return (
        <>
            <BackLink to="/profile" label="Profile" />
            <PageHeader title="Help Center" description="Answers to common questions, or talk to us." />

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="flex flex-col gap-5">
                    <div className="relative">
                        <PiMagnifyingGlassBold className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden />
                        <Input placeholder="Search questions" value={query} onChange={(e) => setQuery(e.target.value)} className="h-11 pl-10" aria-label="Search questions" />
                    </div>

                    {sections.length === 0 && <p className="py-10 text-center text-muted-foreground">No questions match “{query}”.</p>}

                    {sections.map((s) => (
                        <section key={s.title} className="rounded-2xl border bg-card px-5 py-2">
                            <h2 className="pt-3 pb-1 text-xs font-bold tracking-[0.12em] text-muted-foreground uppercase">{s.title}</h2>
                            <Accordion type="single" collapsible>
                                {s.items.map((item) => (
                                    <AccordionItem key={item.id} value={item.id}>
                                        <AccordionTrigger className="text-left font-semibold">{item.title}</AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">{item.content}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </section>
                    ))}
                </div>

                <aside className="flex flex-col gap-3 lg:sticky lg:top-24">
                    <h2 className="text-lg font-bold">Contact us</h2>
                    {CONTACTS.map(({ title, subtitle, href, icon: Icon }) => (
                        <a key={title} href={href} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border bg-card p-4 transition hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"><Icon className="size-5" aria-hidden /></span>
                            <span className="min-w-0">
                                <span className="block font-semibold">{title}</span>
                                <span className="block truncate text-sm text-muted-foreground">{subtitle}</span>
                            </span>
                        </a>
                    ))}
                </aside>
            </div>
        </>
    );
}
