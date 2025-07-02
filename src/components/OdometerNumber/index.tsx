import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

interface OdometerNumberProps {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
  format?: boolean;
}

export default function OdometerNumber({ 
  value, 
  duration = 1.5, 
  delay = 0,
  className = "",
  format = true
}: OdometerNumberProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    const num = Math.round(latest);
    return format ? num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) : num.toString();
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      // 先重置到 0，然后动画到目标值
      count.set(0);
      
      const controls = animate(count, value, { 
        duration,
        ease: "easeOut"
      });
      
      return controls.stop;
    }, delay);

    return () => clearTimeout(timer);
  }, [value, count, duration, delay]);

  return (
    <motion.span className={className} >
      {rounded}
    </motion.span>
  );
}