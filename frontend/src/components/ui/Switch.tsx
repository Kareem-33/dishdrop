import { easeInOut, motion } from "motion/react";

interface SwitchProps {
  active: boolean;
  onClick?: () => void;
}

const Switch = ({ active = false, onClick = () => {} }: SwitchProps) => {
  return (
    <div
      className={`w-[40px] h-[20px] p-[2px] cursor-pointer ${active ? "bg-accent-primary" : "bg-text-secondary/50 "} rounded-full transition-all duration-300 ease-in-out`}
      onClick={onClick}
    >
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: active ? 20 : 0 }}
        transition={{ duration: 0.3, ease: easeInOut }}
        className="h-full aspect-square rounded-full bg-white"
      />
    </div>
  );
};

export default Switch;
