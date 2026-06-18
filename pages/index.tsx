import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { useConfigLoader } from '../../shared';

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

export default function Home() {
  const { config, loading, error } = useConfigLoader<Config>('/config.json');
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const nextPhoto = useCallback(() => {
    if (config) {
      setCurrentPhoto((prev) => (prev + 1) % config.photos.length);
    }
  }, [config]);

  const prevPhoto = useCallback(() => {
    if (config) {
      setCurrentPhoto((prev) => (prev - 1 + config.photos.length) % config.photos.length);
    }
  }, [config]);

  useEffect(() => {
    if (loading || !config) return;
    const interval = setInterval(() => {
      nextPhoto();
    }, 5000);
    return () => clearInterval(interval);
  }, [loading, config, nextPhoto]);

  useEffect(() => {
    if (config?.music) {
      audioRef.current = new Audio(`/${config.music}`);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [config]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-elegant-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-rose border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-elegant-white">
        <p className="text-rose text-lg">Gagal memuat konfigurasi</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{config.title} | EverLetter</title>
        <meta name="description" content={`Surat cinta untuk ${config.recipient}`} />
        <meta property="og:title" content={config.title} />
        <meta property="og:description" content={`Dari ${config.sender} untuk ${config.recipient}`} />
      </Head>

      <div className="min-h-screen bg-elegant-white overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 py-16">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-64 h-64 bg-pink-soft/40 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-48 h-48 bg-lavender/30 rounded-full blur-3xl" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative z-10 text-center max-w-2xl mx-auto"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-rose text-sm uppercase tracking-[0.3em] mb-6"
            >
              Untuk {config.recipient}, dari {config.sender}
            </motion.p>
            <h1 className="text-5xl md:text-7xl font-bold text-dark-luxury mb-8 leading-tight">
              {config.title}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-rose to-lavender mx-auto rounded-full" />
          </motion.div>
        </section>

        {/* Photo Carousel Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Caption Header */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <p className="text-xl md:text-2xl text-dark-luxury/60 italic">
                Setiap foto... adalah sebagian dari cerita kita.
              </p>
            </motion.div>

            {/* Carousel */}
            <div className="relative">
              <div className="overflow-hidden rounded-3xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPhoto}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="relative aspect-[4/3] md:aspect-[16/9] bg-gradient-to-br from-pink-soft to-lavender/30 rounded-3xl flex items-center justify-center overflow-hidden"
                  >
                    {config.photos[currentPhoto] ? (
                      <img
                        src={`/${config.photos[currentPhoto]}`}
                        alt={config.captions[currentPhoto] || `Foto ${currentPhoto + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-white/50 backdrop-blur-sm flex items-center justify-center">
                          <svg className="w-16 h-16 text-rose/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevPhoto}
                aria-label="Foto sebelumnya"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
              >
                <svg className="w-5 h-5 text-dark-luxury" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextPhoto}
                aria-label="Foto berikutnya"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
              >
                <svg className="w-5 h-5 text-dark-luxury" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Caption */}
            <motion.div
              key={`caption-${currentPhoto}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center mt-8"
            >
              <p className="text-2xl md:text-3xl font-medium text-dark-luxury">
                {config.captions[currentPhoto] || `Foto ${currentPhoto + 1}`}
              </p>
            </motion.div>

            {/* Dot Navigation */}
            <div className="flex justify-center gap-3 mt-8">
              {config.photos.map((_: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentPhoto(index)}
                  aria-label={`Foto ${index + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    currentPhoto === index
                      ? 'w-10 h-3 bg-rose'
                      : 'w-3 h-3 bg-dark-luxury/20 hover:bg-dark-luxury/40'
                  }`}
                />
              ))}
            </div>

            {/* Photo Grid Preview (Desktop) */}
            <div className="hidden md:grid grid-cols-3 gap-4 mt-12">
              {config.photos.map((photo: string, index: number) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentPhoto(index)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 ${
                    currentPhoto === index
                      ? 'ring-4 ring-rose shadow-lg'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  {photo ? (
                    <img
                      src={`/${photo}`}
                      alt={config.captions[index] || `Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-pink-soft to-lavender/30 flex items-center justify-center">
                      <svg className="w-12 h-12 text-rose/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <p className="text-white text-sm font-medium truncate">{config.captions[index]}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Final Wish Section */}
        <section className="py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="relative inline-block mb-10">
              <div className="absolute -inset-4 bg-gradient-to-r from-rose/20 to-lavender/20 blur-xl rounded-full" />
              <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-rose to-lavender rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
            <p className="text-lg md:text-xl text-dark-luxury/80 leading-relaxed whitespace-pre-line mb-8">
              {config.message}
            </p>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-rose to-transparent mx-auto mb-8" />
            <p className="text-xl md:text-2xl font-medium text-dark-luxury italic">
              {config.closing}
            </p>
          </motion.div>
        </section>

        {/* WhatsApp CTA */}
        <section className="py-12 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto text-center"
          >
            <a
              href="https://wa.me/6282320114535?text=Halo,%20saya%20ingin%20memesan%20EverLetter"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-500 text-white px-8 py-4 rounded-full font-medium hover:bg-green-600 transition-colors shadow-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Pesan via WhatsApp
            </a>
          </motion.div>
        </section>

        {/* Music Floating Button */}
        {config.music && (
          <div className="fixed bottom-6 right-6 z-50">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              aria-label={isPlaying ? 'Jeda musik' : 'Putar musik'}
              className="w-14 h-14 bg-gradient-to-br from-rose to-lavender rounded-full shadow-lg flex items-center justify-center text-white min-h-[48px] min-w-[48px]"
            >
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              )}
            </motion.button>
            <div className="absolute -top-8 right-0 bg-dark-luxury/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {config.musicTitle}
            </div>
          </div>
        )}

        {/* Pricing Section */}
        <section className="py-16 px-6 bg-gradient-to-b from-pink-soft to-warm-white">
          <div className="max-w-md mx-auto text-center">
            <p className="text-dark-luxury/60 mb-2">Mulai dari</p>
            <p className="text-5xl font-bold text-dark-luxury mb-4">Rp 80K</p>
            <p className="text-dark-luxury/50 text-sm mb-6">Harga premium untuk pengalaman tak terlupakan</p>
            <a
              href="https://wa.me/6282320114535?text=Halo%2C%20saya%20tertarik%20dengan%20EverLetter%20HeartVerse!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-dark-luxury text-warm-white px-8 py-4 rounded-full font-bold text-lg hover:bg-dark-luxury/90 transition-colors"
            >
              Pesan via WhatsApp
            </a>
          </div>
        </section>

        {/* Share Button */}
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'EverLetter - HeartVerse',
                text: 'Lihat hadiah digital indah ini!',
                url: window.location.href,
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('Link disalin ke clipboard!');
            }
          }}
          className="fixed bottom-6 left-6 z-50 bg-dark-luxury/20 backdrop-blur-sm text-dark-luxury px-4 py-3 rounded-full shadow-lg hover:bg-dark-luxury/30 transition-colors flex items-center gap-2"
          aria-label="Bagikan"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>

        {/* Footer */}
        <footer className="py-8 text-center text-dark-luxury/40 text-sm">
          <p>Dibuat dengan cinta oleh EverLetter</p>
        </footer>
      </div>
    </>
  );
}
