import { motion } from "motion/react";

export const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03 } },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export function SplitText({ text, idPrefix = "split" }: { text: string; idPrefix?: string }) {
  const tokens = text.split(/(\s+)/);
  return (
    <motion.span aria-hidden={false} variants={containerVariants} initial="hidden" animate="visible" className="inline">
      {tokens.map((tok, i) => {
        const isSpace = /^\s+$/.test(tok);
        const content = isSpace ? tok.replace(/\s/g, "\u00A0") : tok;
        return (
          <motion.span key={`${idPrefix}-${i}`} variants={itemVariants} className="inline-block" style={{ whiteSpace: "pre" }}>
            {content}
          </motion.span>
        );
      })}
    </motion.span>
  );
}

