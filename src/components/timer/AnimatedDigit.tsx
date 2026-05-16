import { AnimatePresence, motion } from "framer-motion";

type AnimatedDigitProps = {
  value: string;
};

export function AnimatedDigit({ value }: AnimatedDigitProps) {
  return (
    <span
      className="relative inline-flex h-[1em] w-[0.72em] items-center justify-center overflow-hidden leading-none"
      data-testid="animated-digit-slot"
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          animate={{ opacity: 1, y: "0%" }}
          className="absolute inset-0 inline-flex items-center justify-center"
          exit={{ opacity: 0, y: "34%" }}
          initial={{ opacity: 0, y: "-34%" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
