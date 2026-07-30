import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PresentationControls, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import {
  Camera,
  RotateCw,
  Maximize2,
  RefreshCw,
  Scan,
  Move3d,
  ZoomIn,
  Smartphone,
  Lightbulb,
  Hand,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { fetchDishById } from '../services/apiService';
import { AR_INSTRUCTIONS } from '../constants';

const Model = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow>
      <torusKnotGeometry args={[0.8, 0.22, 128, 16]} />
      <meshStandardMaterial color="#fb923c" emissive="#7c2d12" roughness={0.3} metalness={0.5} />
    </mesh>
  );
};

const GESTURES = [
  { icon: RotateCw, label: 'Rotate', hint: 'Drag to spin the dish' },
  { icon: ZoomIn, label: 'Zoom', hint: 'Scroll or pinch to scale' },
  { icon: Move3d, label: 'Move', hint: 'Right-drag to reposition' },
];

const ARViewerPage = () => {
  const { id } = useParams();
  const [dish, setDish] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const stageRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    const loadDish = async () => {
      const data = await fetchDishById(id);
      setDish(data);
      setTimeout(() => setIsReady(true), 450);
    };

    loadDish();
  }, [id]);

  const arUrl = `${window.location.origin}/ar/${id}`;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      stageRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <div className="space-y-6 pt-2">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#111A2E] to-[#070B16] p-6 sm:p-8"
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#FF6B35]/20 blur-[80px]"
          aria-hidden="true"
        />
        <div className="pattern-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              to={dish ? `/menu/${dish.id}` : '/menu'}
              className="mb-4 flex w-fit items-center gap-1.5 text-xs font-medium text-[#A0AEC0] transition-colors hover:text-white"
            >
              <ArrowLeft size={13} /> Back to dish
            </Link>

            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FF6B35]/30 bg-[#FF6B35]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF6B35]">
              <Sparkles size={11} aria-hidden="true" /> AR Preview
            </span>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {dish?.name || 'Dining model'}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#A0AEC0]">
              Move your phone slowly to detect a flat surface, then place the dish model in your
              space.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <ToolButton icon={Camera} label="Camera" />
            <ToolButton
              icon={RotateCw}
              label="Rotate"
              active={autoRotate}
              onClick={() => setAutoRotate((value) => !value)}
            />
            <ToolButton icon={Maximize2} label="Fullscreen" onClick={toggleFullscreen} />
            <ToolButton
              icon={RefreshCw}
              label="Reset"
              onClick={() => controlsRef.current?.reset()}
            />
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        {/* 3D stage */}
        <motion.div
          ref={stageRef}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#070B16] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
        >
          {/* Scanning frame corners */}
          <div className="pointer-events-none absolute inset-5 z-20" aria-hidden="true">
            {[
              'left-0 top-0 border-l-2 border-t-2 rounded-tl-xl',
              'right-0 top-0 border-r-2 border-t-2 rounded-tr-xl',
              'left-0 bottom-0 border-l-2 border-b-2 rounded-bl-xl',
              'right-0 bottom-0 border-r-2 border-b-2 rounded-br-xl',
            ].map((position) => (
              <span
                key={position}
                className={`absolute h-8 w-8 border-[#FF6B35]/70 ${position}`}
              />
            ))}
          </div>

          <div className="relative h-[420px] w-full sm:h-[520px]">
            {/* Loading shimmer */}
            <AnimatePresence>
              {!isReady && (
                <motion.div
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-[#070B16]"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed border-[#FF6B35]/50"
                  >
                    <Scan size={22} className="text-[#FF6B35]" />
                  </motion.div>
                  <p className="text-sm text-[#A0AEC0]">Preparing AR scene…</p>
                </motion.div>
              )}
            </AnimatePresence>

            <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }} shadows>
              <ambientLight intensity={1.1} />
              <directionalLight position={[3, 5, 2]} intensity={1.4} castShadow />
              <pointLight position={[-3, 2, -2]} intensity={0.8} color="#f59e0b" />
              <Suspense fallback={null}>
                <PresentationControls
                  global
                  rotation={[0.13, 0.1, 0]}
                  polar={[-0.4, 0.2]}
                  azimuth={[-0.8, 0.8]}
                >
                  <Model modelUrl={dish?.model3d} />
                </PresentationControls>
                <ContactShadows
                  position={[0, -1.2, 0]}
                  opacity={0.5}
                  scale={9}
                  blur={2.6}
                  far={3}
                  color="#000000"
                />
                <OrbitControls
                  ref={controlsRef}
                  enablePan
                  enableZoom
                  enableRotate
                  autoRotate={autoRotate}
                  autoRotateSpeed={3}
                />
              </Suspense>
            </Canvas>

            {/* Surface hint */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-5">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="rounded-3xl border border-white/10 bg-[#070B16]/80 p-4 backdrop-blur-xl"
              >
                <p className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Smartphone size={14} className="text-[#FF6B35]" aria-hidden="true" />
                  Move your phone slowly to detect a flat surface.
                </p>
                <p className="mt-1 text-sm text-[#A0AEC0]">
                  The dish will appear anchored to the table for a realistic preview.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Side rail */}
        <div className="space-y-6">
          {/* Phone mockup + QR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative overflow-hidden rounded-[28px] border border-black/[0.07] bg-black/[0.02] p-6 text-center backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
          >
            <div
              className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-[#FF6B35]/15 blur-[60px]"
              aria-hidden="true"
            />

            <h2 className="relative flex items-center justify-center gap-2 text-base font-bold text-surface-900 dark:text-white">
              <Scan size={15} className="text-[#FF6B35]" aria-hidden="true" />
              View on your Table
            </h2>
            <p className="relative mt-1.5 text-xs text-surface-600 dark:text-[#A0AEC0]">
              Scan with your phone camera to launch AR.
            </p>

            {/* Phone frame */}
            <div className="relative mx-auto mt-6 w-[168px]">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative rounded-[28px] border-[6px] border-[#1a2540] bg-[#070B16] p-2 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.9)]"
              >
                {/* Notch */}
                <div
                  className="absolute left-1/2 top-1 h-1.5 w-12 -translate-x-1/2 rounded-full bg-[#1a2540]"
                  aria-hidden="true"
                />

                {/* Screen */}
                <div className="mt-3 overflow-hidden rounded-[18px] bg-white p-3">
                  <QRCode
                    value={arUrl}
                    size={128}
                    style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                    bgColor="#FFFFFF"
                    fgColor="#070B16"
                    aria-label="QR code linking to this AR preview"
                  />
                </div>

                <p className="py-2 text-[9px] font-semibold uppercase tracking-widest text-[#A0AEC0]">
                  Scan me
                </p>

                {/* Scan sweep */}
                <motion.div
                  animate={{ y: [8, 150, 8] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="pointer-events-none absolute inset-x-3 top-0 h-8 rounded-full bg-gradient-to-b from-[#FF6B35]/40 to-transparent blur-sm"
                  aria-hidden="true"
                />
              </motion.div>
            </div>

            <motion.a
              href={arUrl}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="relative mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#F97316] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_-8px_rgba(255,107,53,0.8)]"
            >
              <Scan size={15} /> Scan QR
            </motion.a>
          </motion.div>

          {/* Gestures */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-[28px] border border-black/[0.07] bg-black/[0.02] p-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
          >
            <h2 className="flex items-center gap-2 text-base font-bold text-surface-900 dark:text-white">
              <Hand size={15} className="text-[#FF6B35]" aria-hidden="true" />
              Controls
            </h2>

            <ul className="mt-4 space-y-3">
              {GESTURES.map((gesture) => (
                <li key={gesture.label} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FF6B35]/12 text-[#FF6B35]">
                    <gesture.icon size={15} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-surface-900 dark:text-white">{gesture.label}</p>
                    <p className="text-xs text-surface-600 dark:text-[#A0AEC0]">{gesture.hint}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Instructions — from the existing constants */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-[28px] border border-black/[0.07] bg-black/[0.02] p-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
          >
            <h2 className="flex items-center gap-2 text-base font-bold text-surface-900 dark:text-white">
              <Lightbulb size={15} className="text-[#FFB347]" aria-hidden="true" />
              Instructions
            </h2>

            <ol className="mt-4 space-y-3">
              {AR_INSTRUCTIONS.map((instruction, index) => (
                <li key={instruction.text} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/[0.04] text-[10px] font-bold text-[#FF6B35] dark:bg-white/5">
                    {index + 1}
                  </span>
                  <p className="text-xs leading-relaxed text-surface-600 dark:text-[#A0AEC0]">
                    <span className="mr-1.5" aria-hidden="true">
                      {instruction.icon}
                    </span>
                    {instruction.text}
                  </p>
                </li>
              ))}
            </ol>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const ToolButton = ({ icon: Icon, label, active = false, onClick }) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileTap={{ scale: 0.94 }}
    aria-pressed={onClick ? active : undefined}
    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
      active
        ? 'border-[#FF6B35]/50 bg-[#FF6B35]/15 text-[#FF6B35]'
        : 'border-white/10 bg-white/5 text-white hover:bg-white/10'
    }`}
  >
    <Icon size={14} /> {label}
  </motion.button>
);

export default ARViewerPage;
