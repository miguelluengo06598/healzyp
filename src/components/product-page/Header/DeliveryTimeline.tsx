"use client";

import { motion } from "framer-motion";
import { ShieldCheck, PackageCheck, Truck, Zap } from "lucide-react";

const STEPS = [
  { icon: ShieldCheck, time: "1H",  label: "Confirmado",  live: true  },
  { icon: PackageCheck, time: "24H", label: "Enviado",     live: false },
  { icon: Truck,        time: "48H", label: "Entregado",   live: false },
] as const;

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};
const item = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};
const track = {
  hidden:  { scaleX: 0, originX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.6, ease: "easeOut", delay: 0.3 } },
};

export default function DeliveryTimeline() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#487D26]/20 shadow-sm">

      {/* Banner */}
      <div className="flex items-center gap-1.5 bg-[#487D26] px-3 py-1.5">
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <Zap className="w-2.5 h-2.5 text-white fill-white shrink-0" />
        </motion.div>
        <p className="text-[10px] font-semibold text-white tracking-wide">
          Pide hoy · Entrega garantizada en <span className="underline underline-offset-2 decoration-white/50">48 horas</span>
        </p>
      </div>

      {/* Pasos */}
      <motion.ol
        className="flex items-start bg-white px-3 py-3"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isLast = i === STEPS.length - 1;
          return (
            <li key={step.label} className="flex items-start flex-1">
              <motion.div className="flex flex-col items-center text-center w-full gap-1.5" variants={item}>

                {/* Icono */}
                <div className="relative">
                  {step.live && (
                    <motion.span
                      className="absolute inset-0 rounded-full bg-[#487D26]/20"
                      animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut" }}
                    />
                  )}
                  <div className={`relative w-7 h-7 rounded-full flex items-center justify-center
                    ${step.live ? "bg-[#487D26] shadow-[0_2px_8px_rgba(72,125,38,0.4)]" : "bg-[#F0F4EC] border border-[#487D26]/20"}`}>
                    <Icon className={`w-3 h-3 ${step.live ? "text-white" : "text-[#487D26]"}`} strokeWidth={2} />
                  </div>
                </div>

                {/* Tiempo */}
                <span className={`text-[13px] font-black leading-none ${step.live ? "text-[#487D26]" : "text-black/40"}`}>
                  {step.time}
                </span>

                {/* Label */}
                <span className={`text-[9.5px] font-semibold leading-tight ${step.live ? "text-black/70" : "text-black/40"}`}>
                  {step.label}
                </span>

              </motion.div>

              {/* Track */}
              {!isLast && (
                <div className="relative w-6 shrink-0 mt-3.5 mx-0.5">
                  <div className="h-[1.5px] w-full rounded-full bg-black/8" />
                  <motion.div
                    className="absolute inset-0 h-[1.5px] rounded-full"
                    style={{ background: "linear-gradient(90deg,#487D26,#6aaf3a)" }}
                    variants={track}
                  />
                </div>
              )}
            </li>
          );
        })}
      </motion.ol>

    </div>
  );
}
