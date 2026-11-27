import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircleQuestionMark, Plus } from "lucide-react";
import Reveal from "../../components/common/Reveal";
import { FAQ_ITEMS } from "../../constants/faq";
import { accordion } from "../../constants/motion";
import { SITE_INFO } from "../../constants/siteInfo";
import { CONTAINER, LINK_PRIMARY } from "./homeLayout";

function FaqItem({ item, open, onToggle }) {
  const buttonId = `faq-${item.id}-button`;
  const panelId = `faq-${item.id}-panel`;

  return (
    <div className={`overflow-hidden rounded-xl border bg-white transition-colors duration-200 ${open ? "border-primary" : "border-line"}`}>
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex min-h-11 w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-ink-strong"
        >
          {item.question}
          <span
            aria-hidden="true"
            className={`inline-flex size-7 shrink-0 items-center justify-center rounded-full transition-[transform,background-color,color] duration-200 ease-out-soft ${
              open ? "rotate-45 bg-primary text-white" : "bg-primary-50 text-primary"
            }`}
          >
            <Plus size={16} />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div id={panelId} role="region" aria-labelledby={buttonId} variants={accordion} initial="hidden" animate="visible" exit="exit">
            <p className="px-5 pb-4 text-sm leading-relaxed text-muted">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqSection() {
  const [openId, setOpenId] = useState(FAQ_ITEMS[0]?.id ?? null);

  return (
    <section aria-labelledby="faq-title" className="bg-page py-14 lg:py-20">
      <div className={`${CONTAINER} grid gap-8 lg:grid-cols-12 lg:gap-12`}>
        <Reveal className="lg:col-span-4">
          <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
            <MessageCircleQuestionMark size={24} aria-hidden="true" />
          </span>
          <h2 id="faq-title" className="mt-4 text-headline font-bold text-ink-strong">
            Những câu hỏi thường gặp
          </h2>
          <p className="mt-3 text-sm text-muted">Không thấy câu trả lời? Hỏi trợ lý AI hoặc liên hệ đội ngũ RoadStudy.</p>
          <a href={`mailto:${SITE_INFO.email}`} className={`${LINK_PRIMARY} mt-6`}>
            Liên hệ hỗ trợ
          </a>
        </Reveal>
        <div className="flex flex-col gap-3 lg:col-span-8">
          {FAQ_ITEMS.map((item) => (
            <FaqItem key={item.id} item={item} open={openId === item.id} onToggle={() => setOpenId(openId === item.id ? null : item.id)} />
          ))}
        </div>
      </div>
    </section>
  );
}
