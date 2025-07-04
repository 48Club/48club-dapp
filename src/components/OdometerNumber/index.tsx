import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

interface OdometerNumberProps {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
  format?: boolean;
  firstAppear?: boolean;
}

export default function OdometerNumber({ 
  value, 
  duration = 2, 
  delay = 0,
  className = "",
  format = true,
  firstAppear = false
}: OdometerNumberProps) {
  const count = useMotionValue(0);
  const isFirst = useRef(true);

  const rounded = useTransform(count, (latest) => {
    const num = Math.round(latest * 100) / 100;
    if (!format) return num.toString();
    if (Number.isInteger(num)) {
      return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
    }
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  });

  useEffect(() => {
    if (isFirst.current && firstAppear) {
      count.set(value);
      isFirst.current = false;
      return;
    }
    const timer = setTimeout(() => {
      const controls = animate(count, value, { 
        duration,
        ease: "easeOut"
      });
      return controls.stop;
    }, delay);
    return () => clearTimeout(timer);
  }, [value, count, duration, delay, firstAppear]);

  return (
    <motion.span className={className}>
      {rounded}
    </motion.span>
  );
}