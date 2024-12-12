import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import animationData from "@/assets/lottie-json"
// import animationData from "@/assets"
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const colors = [
  "bg-[#712c45a7] text-[#ff006e] border-[1px] border-[#ff006faa]",
  "bg-[#ffd602a2] text-[#ffd60a] border-[1px] border-[#ffd60abb]",
  "bg-[#06d6a02a] text-[#06d6a0] border-[1px] border-[#06d6a0bb]",
  "bg-[#4cc9f02a] text-[#4cc9f0] border-[1px] border-[#4cc9f0bb]",
];

export const getColor = (color) => {
  if(color >= 0 && color < colors.length){
      return colors[color];
  }
  return colors[0];
};



export const animationDefaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
  };

