import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Head from 'next/head';
import { useConfigLoader } from '../shared';
import { RippleEffect } from '../components/RippleEffect';

interface Config {
  recipient: string;
  sender: string;
  title: string;
  message: string;
  photos: string[];
  theme: string;
  music: string;
  musicTitle: string;
  template: string;
  captions: string[];
  closing: string;
}

const themeColors: Record<string, { bg: string; cardBg: string; text: string; accent: string; accentHex: string; muted: string; glow: string }> = {
  pink: { 
    bg: 'bg-gradient-to-br from-[#0F0811] via-[#1A0B1A] to-[#250E20]', 
    cardBg: 'bg-white/[0.06] border-white/[0.12]',
    text: 'text-[#F9F5F6]', 
    accent: 'text-[#F6B3D0]',
    accentHex: '#F6B3D0',
    muted: 'text-[#F6B3D0]/75',
    glow: 'from-[#F6B3D0]/20 to-transparent',
  },
  lavender: { 
    bg: 'bg-gradient-to-br from-[#080711] via-[#0D0A1C] to-[#150F2A]', 
    cardBg: 'bg-white/[0.06] border-white/[0.12]',
    text: 'text-[#F5F3F7]', 
    accent: 'text-[#C5B3E6]',
    accentHex: '#C5B3E6',
    muted: 'text-[#C5B3E6]/75',
    glow: 'from-[#C5B3E6]/20 to-transparent',
  },
  warm: { 
    bg: 'bg-gradient-to-br from-[#12110F] via-[#1E1915] to-[#2B2118]', 
    cardBg: 'bg-white/[0.06] border-white/[0.12]',
    text: 'text-[#FBFBF9]', 
    accent: 'text-[#E6C29E]',
    accentHex: '#E6C29E',
    muted: 'text-[#E6C29E]/75',
    glow: 'from-[#E6C29E]/20 to-transparent',
  },
};

/* ── Shooting Stars ── */
function ShootingStars({ color }: { color: string }) {
  const stars = useMemo(() =>
    [...Array(3)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 40,
      duration: 1.5 + Math.random() * 2,
      delay: i * 3 + Math.random() * 4,
      angle: -25 + Math.random() * 10,
      length: 60 + Math.random() * 80,
    })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: s.duration * 2, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute"
            style={{ transform: `rotate(${s.angle}deg)`, transformOrigin: "left center" }}
            animate={{ x: [0, s.length] }}
            transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: "easeOut" }}
          >
            {/* Star head */}
            <div
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
            />
            {/* Trail */}
            <div
              className="absolute top-0.5 right-1.5 h-[1px]"
              style={{
                width: s.length,
                background: `linear-gradient(90deg, ${color}00, ${color}40, ${color}20, transparent)`,
              }}
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Flip Card ── */
function FlipCard({ front, back, isFlipped, onFlip }: { front: React.ReactNode; back: React.ReactNode; isFlipped: boolean; onFlip: () => void }) {
  return (
    <div
      className="relative w-full h-full cursor-pointer"
      style={{ perspective: "1200px" }}
      onClick={onFlip}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: "hidden" }}
        >
          {front}
        </div>
        {/* Back */}
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}

/* ── Cosmic Particles (unique to Heartverse) ── */
function CosmicParticles({ color }: { color: string }) {
  const particles = useMemo(() =>
    [...Array(16)].map((_, i) => ({
      left: `${(i * 13 + 4) % 100}%`,
      top: `${(i * 19 + 8) % 100}%`,
      size: 1 + (i % 4) * 0.8,
      duration: 3 + (i % 5) * 1.2,
      delay: (i % 7) * 0.6,
      drift: -20 + (i % 3) * 12,
    })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            backgroundColor: color,
            boxShadow: `0 0 ${p.size * 6}px ${color}`,
          }}
          animate={{
            y: [0, p.drift, 0],
            x: [0, -p.drift / 2, 0],
            opacity: [0, 0.8, 0.2, 0.8, 0],
            scale: [0.3, 1.2, 0.6, 1, 0.3],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ── Ambient floating particles ── */
function AmbientParticles({ color, count = 8 }: { color: string; count?: number }) {
  const particles = useMemo(() =>
    [...Array(count)].map((_, i) => ({
      left: `${(i * 17 + 5) % 100}%`,
      top: `${(i * 23 + 10) % 100}%`,
      size: 1 + (i % 3),
      duration: 4 + (i % 5),
      delay: (i % 7) * 0.8,
    })), [count]);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size, backgroundColor: color }}
          animate={{ y: [0, -40, 0], opacity: [0, 0.35, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ── 3D Parallax Section ── */
function ParallaxSection({ children, speed = 0.5, className = "" }: { children: React.ReactNode; speed?: number; className?: string }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [80 * speed, -80 * speed]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [1.5, 0, -1.5]);
  return (
    <motion.div className={className} style={{ y, rotateX, transformPerspective: 1200, transformStyle: "preserve-3d" }}>
      {children}
    </motion.div>
  );
}

export default function Home() {
  const { config, loading, error } = useConfigLoader<Config>('/config.json');
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const nextPhoto = useCallback(() => {
    if (config?.photos?.length) setCurrentPhoto((prev) => (prev + 1) % config.photos.length);
  }, [config]);

  const prevPhoto = useCallback(() => {
    if (config?.photos?.length) setCurrentPhoto((prev) => (prev - 1 + config.photos.length) % config.photos.length);
  }, [config]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'ArrowRight') nextPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextPhoto, prevPhoto]);

  useEffect(() => {
    if (config?.music) {
      audioRef.current = new Audio(`/${config.music}`);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
      audioRef.current.addEventListener('error', () => setIsPlaying(false));
    }
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; } };
  }, [config]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(() => {});
    setIsPlaying((prev) => !prev);
  };

  if (loading || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080711]">
        <div className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 border border-white/10 rounded-full mx-auto">
            <div className="w-full h-full border-t border-[#C5B3E6]/50 rounded-full" />
          </motion.div>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080711]">
        <div className="text-center">
          <p className="text-white/60 mb-4 font-display-premium">Gagal memuat konfigurasi</p>
          <button onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white/10 text-white/80 rounded-full hover:bg-white/20 transition-colors border border-white/10 cursor-pointer">Coba Lagi</button>
        </div>
      </div>
    );
  }

  const colors = themeColors[config.theme] || themeColors.pink;

  return (
    <>
      <Head>
        <title>{config.title} - EverLetter</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap" rel="stylesheet" />
      </Head>

      <div className={`min-h-screen ${colors.bg} ${colors.text} font-sans selection:bg-white/20 overflow-x-hidden relative`}>
        <RippleEffect color={`${colors.accentHex}15`} />
        {/* Ambient glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full opacity-10 blur-[140px] pointer-events-none"
          style={{ background: `radial-gradient(circle, ${colors.accentHex}, transparent)` }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full opacity-10 blur-[140px] pointer-events-none"
          style={{ background: `radial-gradient(circle, ${colors.accentHex}, transparent)` }} />

        {/* ═══ Intro Section ═══ */}
        <section className="min-h-[110vh] flex flex-col items-center justify-center px-6 relative z-10">
          <ShootingStars color={colors.accentHex} />
          <CosmicParticles color={colors.accentHex} />
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="text-center max-w-3xl mx-auto">
            <p className={`text-[10px] md:text-xs uppercase tracking-[0.5em] font-semibold mb-8 ${colors.accent}`}>
              Sebuah Cerita Untuk {config.recipient}
            </p>
            <h1 className="font-serif-premium text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-10 leading-tight">
              {config.title}
            </h1>
            <div className="w-12 h-[2px] mx-auto opacity-30" style={{ backgroundColor: colors.accentHex }} />
          </motion.div>
        </section>

        {/* ═══ Emotional Depth Section ═══ */}
        <section className="min-h-screen py-32 px-6 relative z-10">
          <ShootingStars color={colors.accentHex} />
          <CosmicParticles color={colors.accentHex} />
          <ParallaxSection speed={0.1} className="max-w-2xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-[10px] tracking-[0.5em] uppercase mb-4 font-semibold" style={{ color: colors.accentHex }}>
                Perasaanku
              </p>
              <h2 className="font-serif-premium text-3xl md:text-4xl font-light text-white tracking-wide">
                Alam Semesta Kita
              </h2>
              <div className="w-16 h-[1px] mx-auto mt-6" style={{ background: `linear-gradient(90deg, transparent, ${colors.accentHex}40, transparent)` }} />
            </motion.div>

            <div className="space-y-12">
              {[
                "Kau tahu, ada ribuan galaksi di alam semesta ini. Miliaran bintang tersebar di ruang yang tak terbatas. Dan di antara semua keindahan yang tak terhitung itu, hatiku memilihmu. Bukan karena kebetulan, tapi karena takdir yang terasa begitu alami.",
                "Seperti gravitasi yang tak terlihat tapi tak terbantahkan, cinta kita ditarik bersama oleh kekuatan yang melampaui pemahaman. Kita adalah dua bintang yang berputar dalam orbit yang sama, saling menerangi di kegelapan luasnya kehidupan.",
                "Kadang aku bertanya-tanya, bagaimana rasanya menjadi bintang? Selalu bersinar, selalu hadir, bahkan ketika dunia tertidur. Begitulah kau bagiku — cahaya yang tak pernah padam, bahkan di malam paling gelap sekalipun.",
                "Dan ketika aku memandang langit malam, setiap bintang mengingatkanku padamu. Karena kaulah bintangku, bimbinganku, dan rumah yang selalu kutuju di antara miliaran pilihan yang tak terbatas ini."
              ].map((text, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "-5%" }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="font-display-premium text-lg md:text-xl text-white/75 leading-[2] font-light text-center">
                    {text}
                  </p>
                  {i < 3 && (
                    <div className="flex justify-center mt-10">
                      <div className="w-1.5 h-1.5 rotate-45 border border-white/10" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </ParallaxSection>
        </section>

        {/* ═══ Museum Gallery Section ═══ */}
        <section className="py-24 px-4 min-h-screen flex items-center justify-center relative z-10">
          <CosmicParticles color={colors.accentHex} />
          <ParallaxSection speed={0.08} className="max-w-6xl w-full">
            <div className={`w-full ${colors.cardBg} backdrop-blur-[32px] border rounded-[24px] p-6 md:p-8 lg:p-12 shadow-glass-lg`}>
              {/* macOS Dots */}
              <div className="flex gap-2 mb-8 items-center border-b border-white/[0.06] pb-6">
                <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] opacity-90 shadow-inner" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] opacity-90 shadow-inner" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] opacity-90 shadow-inner" />
                <span className="ml-4 text-[10px] font-mono tracking-widest text-white/25 uppercase">storyviewer.app</span>
              </div>

              <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
                {/* Photo Display with 3D Flip */}
                <div className="w-full lg:w-1/2">
                  <div className="relative aspect-[4/5] md:aspect-[3/2] lg:aspect-[4/5] bg-white/[0.02] border border-white/[0.05] p-3 rounded-[16px] shadow-2xl">
                    <FlipCard
                      isFlipped={flipped}
                      onFlip={() => setFlipped(prev => !prev)}
                      front={
                        <div className="relative w-full h-full group">
                          <AnimatePresence mode="wait">
                            <motion.div key={currentPhoto}
                              initial={{ opacity: 0, scale: 0.96 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 1.04 }}
                              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                              className="w-full h-full relative overflow-hidden rounded-[10px] bg-black/40">
                              {config.photos[currentPhoto] && (
                                <motion.div
                                  animate={{ scale: [1, 1.08, 1] }}
                                  transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
                                  className="w-full h-full"
                                  style={{ willChange: 'transform' }}
                                >
                                  <img src={`/${config.photos[currentPhoto]}`} alt={`Photo ${currentPhoto + 1}`} className="w-full h-full object-cover" />
                                </motion.div>
                              )}
                            </motion.div>
                          </AnimatePresence>
                          <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <button onClick={(e) => { e.stopPropagation(); prevPhoto(); }} className="w-10 h-10 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 text-white transition-colors cursor-pointer pointer-events-auto">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); nextPhoto(); }} className="w-10 h-10 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 text-white transition-colors cursor-pointer pointer-events-auto">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                          </div>
                        </div>
                      }
                      back={
                        <div className="w-full h-full rounded-[10px] bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.1] flex flex-col items-center justify-center p-8 text-center">
                          <svg className="w-8 h-8 mb-4" style={{ color: colors.accentHex }} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                          <p className="font-display-premium text-lg md:text-xl font-light italic leading-relaxed text-white/80">
                            &ldquo;{config.captions[currentPhoto] || 'Sebuah Kenangan'}&rdquo;
                          </p>
                          <div className="mt-6 text-[10px] tracking-[0.3em] uppercase text-white/30">
                            Ketuk untuk kembali
                          </div>
                        </div>
                      }
                    />
                  </div>
                </div>

                {/* Caption & Navigation */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <motion.div key={`info-${currentPhoto}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <span className={`text-[10px] tracking-[0.3em] uppercase font-bold mb-4 inline-block ${colors.accent}`}>
                      Momen {String(currentPhoto + 1).padStart(2, '0')} / {String(config.photos.length).padStart(2, '0')}
                    </span>
                    <h2 className="font-display-premium text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed mb-8">
                      &ldquo;{config.captions[currentPhoto] || 'Sebuah Kenangan'}&rdquo;
                    </h2>
                    <div className="flex gap-2.5 mt-8 items-center">
                      {config.photos.map((_, idx) => (
                        <button key={idx} onClick={() => setCurrentPhoto(idx)}
                          className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${currentPhoto === idx ? 'w-10' : 'w-2 bg-white/15 hover:bg-white/30'}`}
                          style={{ backgroundColor: currentPhoto === idx ? colors.accentHex : undefined }}
                          aria-label={`Slide ${idx + 1}`} />
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </ParallaxSection>
        </section>

        {/* ═══ Narrative & Closing ═══ */}
        <section className="min-h-screen flex flex-col justify-center items-center px-6 py-32 text-center relative z-10">
          <CosmicParticles color={colors.accentHex} />
          <ParallaxSection speed={0.1} className="max-w-3xl mx-auto space-y-16">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 1 }}>
              <p className="font-display-premium text-2xl md:text-3xl font-light leading-[1.8] text-white/75">{config.message}</p>
            </motion.div>
            <div className="w-12 h-[2px] mx-auto" style={{ background: `linear-gradient(90deg, transparent, ${colors.accentHex}30, transparent)` }} />
            <motion.div
              className={`${colors.cardBg} backdrop-blur-[24px] border rounded-[20px] p-8 md:p-12 shadow-glass-lg max-w-xl mx-auto`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                className="w-16 h-16 mx-auto mb-8 flex items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.04] backdrop-blur-xl"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.4 }}
              >
                <motion.svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                  style={{ color: colors.accentHex }}
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </motion.svg>
              </motion.div>
              <p className="font-display-premium text-xl md:text-2xl font-light italic mb-8" style={{ color: colors.accentHex }}>&ldquo;{config.closing}&rdquo;</p>
              <div className="w-8 h-[1px] mx-auto mb-6" style={{ background: `linear-gradient(90deg, transparent, ${colors.accentHex}30, transparent)` }} />
              <p className="text-[10px] tracking-[0.3em] uppercase mb-4 opacity-30">Tertanda</p>
              <p className="font-serif-premium text-2xl md:text-3xl font-light tracking-wide">{config.sender}</p>
            </motion.div>
          </ParallaxSection>
        </section>

        {/* ═══ Floating Utilities ═══ */}
        {config.music && (
          <motion.button onClick={togglePlay}
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2, type: "spring" }}
            className="fixed bottom-8 right-8 w-14 h-14 bg-white/[0.08] backdrop-blur-xl rounded-full shadow-glass-lg flex items-center justify-center text-white cursor-pointer border border-white/[0.12]"
            aria-label={isPlaying ? 'Pause musik' : 'Putar musik'}>
            {isPlaying ? (
              <div className="flex gap-[3px] items-center justify-center h-4">
                <motion.div animate={{ height: [8, 16, 8] }} transition={{ duration: 1, repeat: Infinity }} className="w-[3px] bg-white rounded-full" />
                <motion.div animate={{ height: [12, 6, 12] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-[3px] bg-white rounded-full" />
                <motion.div animate={{ height: [6, 14, 6] }} transition={{ duration: 1.2, repeat: Infinity }} className="w-[3px] bg-white rounded-full" />
              </div>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" /></svg>
            )}
          </motion.button>
        )}

        <button onClick={() => { navigator.clipboard.writeText(window.location.href); setToast('Tautan disalin!'); setTimeout(() => setToast(null), 3000); }}
          className="fixed bottom-8 left-8 w-14 h-14 bg-white/[0.08] backdrop-blur-xl rounded-full shadow-glass-lg flex items-center justify-center text-white cursor-pointer hover:bg-white/[0.12] transition-colors border border-white/[0.12]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>

        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-8 bg-white/[0.08] backdrop-blur-md text-white border border-white/[0.1] px-4 py-2 rounded-lg text-sm font-medium z-50">{toast}</motion.div>
        )}
      </div>
    </>
  );
}
