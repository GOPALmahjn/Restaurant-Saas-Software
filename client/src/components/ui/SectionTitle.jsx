import { motion } from 'framer-motion';

/**
 * Section heading. Same props as before (eyebrow/title/description) plus an
 * optional `action` slot rendered on the right at desktop widths.
 */
const SectionTitle = ({ eyebrow, title, description, action, align = 'left' }) => {
  const centered = align === 'center';

  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-end ${
        centered ? 'sm:justify-center' : 'sm:justify-between'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`flex flex-col gap-3 ${centered ? 'items-center text-center' : ''}`}
      >
        {eyebrow ? (
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FF6B35]/25 bg-[#FF6B35]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#FF6B35]">
            {eyebrow}
          </span>
        ) : null}

        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>

        {description ? (
          <p className="max-w-2xl text-base leading-relaxed text-[#A0AEC0]">{description}</p>
        ) : null}
      </motion.div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
};

export default SectionTitle;
