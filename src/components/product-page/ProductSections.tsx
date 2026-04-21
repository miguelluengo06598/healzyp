import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
// Sección 4: reseñas de clientes (componente cliente con carousel)
import CustomerReviews from "./CustomerReviews";

// ─────────────────────────────────────────────────────────────────────────────
// ProductSections
// Tres secciones de marketing que aparecen debajo del producto y las pestañas.
// Cada sección tiene comentarios "TODO" para personalizar textos e imágenes.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Datos de la Sección 1: Beneficios ────────────────────────────────────────
// TODO: edita los campos title y description de cada beneficio
const benefits = [
  {
    id: 1,
    title: "Mejora la digestión",
    description:
      "El vinagre de manzana ayuda a equilibrar el pH del estómago y favorece el crecimiento de bacterias beneficiosas, mejorando el tránsito intestinal de forma natural.",
  },
  {
    id: 2,
    title: "Aumenta la energía",
    description:
      "Los ácidos orgánicos del vinagre de manzana contribuyen a una liberación de energía más sostenida a lo largo del día, sin los picos de azúcar de otras alternativas.",
  },
  {
    id: 3,
    title: "Controla el peso",
    description:
      "Estudios sugieren que el ácido acético ayuda a reducir el apetito y a regular el metabolismo de los lípidos, apoyando un peso corporal saludable.",
  },
];

// ─── Datos de la Sección 2: Pasos ─────────────────────────────────────────────
// TODO: edita los campos title y description de cada paso
const steps = [
  {
    id: 1,
    title: "Toma 2 gominolas al día",
    description:
      "Consume 2 gominolas por la mañana, preferiblemente antes del desayuno, para aprovechar al máximo sus propiedades digestivas.",
  },
  {
    id: 2,
    title: "Mastica despacio",
    description:
      "Mastica cada gominola lentamente para que el vinagre de manzana se libere de forma gradual y tu cuerpo lo asimile correctamente.",
  },
  {
    id: 3,
    title: "Mantén la constancia",
    description:
      "Los mejores resultados se obtienen con un consumo regular. Incorpora las gominolas a tu rutina diaria durante al menos 4 semanas.",
  },
];

// ─── Datos de la Sección 3: Bloques imagen/texto ──────────────────────────────
// TODO: edita title, description e imageAlt; reemplaza los placeholders por <Image>
const infoBlocks = [
  {
    id: 1,
    title: "Ingredientes 100 % naturales",
    description:
      "Nuestras gominolas están elaboradas con vinagre de manzana orgánico certificado, sin colorantes artificiales ni conservantes. Cada unidad aporta la misma cantidad de ácido acético que un vasito de vinagre, pero con un sabor agradable y sin el ardor. Aptas para veganos y sin gluten.",
    imageAlt: "Ingredientes naturales de las gominolas",
    imageRight: false, // imagen a la izquierda
  },
  {
    id: 2,
    title: "Fabricación artesanal y sostenible",
    description:
      "Cada lote se produce en pequeñas cantidades para garantizar la máxima calidad. Utilizamos envases reciclables y reducimos al mínimo nuestra huella de carbono. Trabajamos con productores locales de manzana para apoyar la economía de proximidad y asegurar la frescura de las materias primas.",
    imageAlt: "Proceso de fabricación artesanal",
    imageRight: true, // imagen a la derecha
  },
  {
    id: 3,
    title: "Respaldado por la ciencia",
    description:
      "El vinagre de manzana ha sido objeto de numerosos estudios clínicos que avalan sus beneficios sobre la glucemia, el colesterol y la microbiota intestinal. Nuestras gominolas ofrecen una dosis estandarizada y reproducible para que puedas confiar en cada toma. Consulta con tu médico si tomas medicación.",
    imageAlt: "Respaldo científico del producto",
    imageRight: false, // imagen a la izquierda
  },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function ProductSections() {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════════
          SECCIÓN 1 — BENEFICIOS
          Grid de 3 cards: 1 columna en móvil, 3 columnas en desktop.
          Cada card tiene un placeholder de imagen cuadrada + título + descripción.
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-frame mx-auto px-4 xl:px-0 mb-[50px] sm:mb-20">
        {/* Separador coherente con el resto de la página */}
        <hr className="h-[1px] border-t-black/10 mb-10 sm:mb-16" />

        {/* TODO: cambia el título de la sección */}
        <h2
          className={cn([
            integralCF.className,
            "text-[32px] md:text-5xl mb-8 md:mb-14 text-center capitalize",
          ])}
        >
          ¿Por qué elegir nuestro producto?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className="border border-black/10 rounded-[20px] p-5 md:p-6 flex flex-col"
            >
              {/* TODO: reemplaza este div por un componente <Image> con la imagen real */}
              <div className="bg-[#F0EEED] rounded-[13px] aspect-square mb-4 flex items-center justify-center">
                <span className="text-black/40 text-xs text-center px-2">
                  TODO: Añadir imagen
                </span>
              </div>

              {/* TODO: edita el título del beneficio */}
              <strong className="text-black text-lg mb-2">{benefit.title}</strong>

              {/* TODO: edita la descripción del beneficio */}
              <p className="text-black/60 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECCIÓN 2 — 3 PASOS PARA MEJORAR TU SALUD
          Grid de 3 columnas sin imágenes. El número actúa como elemento visual
          destacado usando la misma escala tipográfica del proyecto.
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-frame mx-auto px-4 xl:px-0 mb-[50px] sm:mb-20">
        <hr className="h-[1px] border-t-black/10 mb-10 sm:mb-16" />

        {/* TODO: cambia el título de la sección */}
        <h2
          className={cn([
            integralCF.className,
            "text-[32px] md:text-5xl mb-8 md:mb-14 text-center capitalize",
          ])}
        >
          3 pasos para mejorar tu salud
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col">
              {/* Número destacado — mantiene coherencia con la escala del proyecto */}
              <span
                className={cn([
                  integralCF.className,
                  "text-[80px] md:text-[96px] leading-none text-black/10 mb-2 select-none",
                ])}
              >
                {step.id}
              </span>

              {/* Línea separadora bajo el número */}
              <hr className="h-[1px] border-t-black/10 mb-4" />

              {/* TODO: edita el título del paso */}
              <strong className="text-black text-lg mb-2">{step.title}</strong>

              {/* TODO: edita la descripción del paso */}
              <p className="text-black/60 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECCIÓN 3 — BLOQUES INFORMACIÓN CON IMÁGENES ALTERNADAS
          En móvil: imagen arriba, texto abajo (siempre).
          En desktop: alterna imagen-izquierda/texto-derecha e inverso.
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-frame mx-auto px-4 xl:px-0 mb-[50px] sm:mb-20">
        <hr className="h-[1px] border-t-black/10 mb-10 sm:mb-16" />

        {/* TODO: cambia el título de la sección */}
        <h2
          className={cn([
            integralCF.className,
            "text-[32px] md:text-5xl mb-8 md:mb-14 text-center capitalize",
          ])}
        >
          Todo lo que necesitas saber
        </h2>

        <div className="flex flex-col gap-10 sm:gap-16">
          {infoBlocks.map((block) => (
            <div
              key={block.id}
              className={cn([
                "grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 items-center",
              ])}
            >
              {/* Placeholder de imagen —
                  En móvil siempre va primero (order-1).
                  En desktop alterna según imageRight. */}
              <div
                className={cn([
                  // TODO: reemplaza este div por un componente <Image> con la imagen real
                  "bg-[#F0EEED] rounded-[20px] aspect-video flex items-center justify-center",
                  "order-1",
                  block.imageRight ? "md:order-2" : "md:order-1",
                ])}
              >
                <span className="text-black/40 text-xs text-center px-4">
                  TODO: Añadir imagen · {block.imageAlt}
                </span>
              </div>

              {/* Caja de texto */}
              <div
                className={cn([
                  "order-2",
                  block.imageRight ? "md:order-1" : "md:order-2",
                ])}
              >
                {/* TODO: edita el título del bloque */}
                <h3
                  className={cn([
                    integralCF.className,
                    "text-xl md:text-[28px] md:leading-snug mb-4 capitalize",
                  ])}
                >
                  {block.title}
                </h3>

                {/* TODO: edita la descripción del bloque */}
                <p className="text-black/60 text-sm sm:text-base leading-relaxed">
                  {block.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECCIÓN 4 — RESEÑAS VERIFICADAS DE CLIENTES
          Componente cliente con carousel responsive + resumen de valoración.
          Los datos viven en src/data/productReviewsData.ts
      ════════════════════════════════════════════════════════════════════════ */}
      <CustomerReviews />
    </>
  );
}
