import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { ChevronDown, X, Minus, Plus } from "lucide-react";
import confetti from "canvas-confetti";
import * as Dialog from "@radix-ui/react-dialog";
import {
  createConfirmation,
  createCancellation,
} from "./services/api";
import { AdminPage } from "./pages/AdminPage";

// Importiere Bilder
import heroImage from "../imports/60JahreJung.webp";
import backgroundImage from "../imports/46838fc1-84a7-445e-95d2-fd37ab5e2e30.webp";
import machDichBereitImage from "../imports/MachDichBereit.webp";
import gutesEssenImage from "../imports/GutesEssenUndTrinken.webp";
import bombastischeMusikImage from "../imports/BombastischeMusik.webp";
import unterFreiemHimmelImage from "../imports/RotatedUnterFreiemHimmel.webp";
import am18072026Image from "../imports/Am18072026.webp";
import afterSubmitImage from "../imports/AfterTheySubmitted.webp";

// Importiere Musik
import beethovenMusic from "../imports/music.mp3";

function HomePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] =
    useState(false);
  const [successDialogOpen, setSuccessDialogOpen] =
    useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const [submittedNames, setSubmittedNames] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { scrollYProgress } = useScroll();

  const isPlural = guestCount > 1;

  const heroOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.13, 1], // Hinten mit 1 abgeriegelt
    [1, 1, 0, 0],       // Bleibt auf 0
  );
  const heroY = useTransform(
    scrollYProgress,
    [0, 0.15, 1],
    [0, -100, -100],
  );

  const section1Y = useTransform(
    scrollYProgress,
    [0, 0.1, 0.2, 0.3, 1],
    [100, 100, 0, -100, -100],
  );
  const section1Opacity = useTransform(
    scrollYProgress,
    [0, 0.13, 0.17, 0.25, 0.28, 1], // Vorne und hinten abgeriegelt
    [0, 0, 1, 1, 0, 0],
  );

  const section2Y = useTransform(
    scrollYProgress,
    [0, 0.25, 0.35, 0.45, 1],
    [100, 100, 0, -100, -100],
  );
  const section2Opacity = useTransform(
    scrollYProgress,
    [0, 0.28, 0.32, 0.4, 0.43, 1],
    [0, 0, 1, 1, 0, 0],
  );

  const section3Y = useTransform(
    scrollYProgress,
    [0, 0.4, 0.5, 0.6, 1],
    [100, 100, 0, -100, -100],
  );
  const section3Opacity = useTransform(
    scrollYProgress,
    [0, 0.43, 0.47, 0.55, 0.58, 1],
    [0, 0, 1, 1, 0, 0],
  );

  const section4Y = useTransform(
    scrollYProgress,
    [0, 0.55, 0.65, 0.75, 1],
    [100, 100, 0, -100, -100],
  );
  const section4Opacity = useTransform(
    scrollYProgress,
    [0, 0.58, 0.62, 0.7, 0.73, 1],
    [0, 0, 1, 1, 0, 0],
  );

  const section5Y = useTransform(
    scrollYProgress,
    [0, 0.7, 0.8, 0.9, 1],
    [100, 100, 0, -100, -100],
  );
  const section5Opacity = useTransform(
    scrollYProgress,
    [0, 0.73, 0.77, 0.85, 0.88, 1],
    [0, 0, 1, 1, 0, 0],
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent =
        window.scrollY /
        (document.documentElement.scrollHeight -
          window.innerHeight);

      if (Math.random() > 0.97) {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: scrollPercent },
          colors: [
            "#ff0080",
            "#ff8c00",
            "#ffd700",
            "#9d00ff",
            "#00ff88",
          ],
        });

        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: scrollPercent },
          colors: [
            "#ff0080",
            "#ff8c00",
            "#ffd700",
            "#9d00ff",
            "#00ff88",
          ],
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {

    // Falls blockiert, starte bei erster Interaktion
    const handleInteraction = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.volume = 0.5;
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log("Audio play failed:", error);
          });

        // Entferne Listener nach erstem erfolgreichen Abspielen
        document.removeEventListener(
          "click",
          handleInteraction,
        );
        document.removeEventListener(
          "scroll",
          handleInteraction,
        );
        document.removeEventListener(
          "touchstart",
          handleInteraction,
        );
      }
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("scroll", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("scroll", handleInteraction);
      document.removeEventListener(
        "touchstart",
        handleInteraction,
      );
    };
  }, [isPlaying]);

  useEffect(() => {

const handleVisibilityChange = () => {
  if (document.hidden && audioRef.current) {
    audioRef.current.pause();
    setIsPlaying(false);

    // Hier sagen wir dem Smartphone: Die Musik-Sitzung ist vorbei
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'none';
      
      // Optional: Metadaten komplett leeren, damit die Anzeige verschwindet
      navigator.mediaSession.metadata = null;
    }

  } else if (!document.hidden && audioRef.current) {
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
        
        // Wenn der Tab wieder aktiv wird, die Anzeige bei Bedarf wieder aktivieren
        if ('mediaSession' in navigator) {
          navigator.mediaSession.playbackState = 'playing';
          navigator.mediaSession.metadata = new MediaMetadata({
            title: 'Anetts 60. Geburtstag',
            artist: 'Beethoven',
          });
        }
      })
      .catch(() => {
        // Browser blockiert autoplay erneut
      });
  }
};

  document.addEventListener(
    "visibilitychange",
    handleVisibilityChange,
  );

  return () => {

    document.removeEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

  };

}, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const names = [...Array(guestCount)]
      .map((_, i) => formData.get(`name-${i}`))
      .filter(Boolean) as string[];
    const email = formData.get("email") as string;

    // POST /api/users
    const response = await createConfirmation({
      names,
      email,
    });

    if (response.success) {
      setSubmittedNames(names);
      setSuccessDialogOpen(true);

      // Formular zurücksetzen
      if (form) {
        form.reset();
      }
      setGuestCount(1);
    } else {
      console.error('Failed to submit:', response.error);
      alert(`Fehler: ${response.error}\n\nBitte öffne die Browser-Konsole für mehr Details.`);
    }
  };

  const handleCancel = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const cancelName = formData.get("cancelName") as string;

    // POST /api/cancellations
    const response = await createCancellation({
      name: cancelName,
    });

    if (response.success) {
      const cancelText = isPlural
        ? `Schade, dass ihr nicht dabei sein könnt. Vielleicht beim nächsten Mal! 💔`
        : `Schade, dass ${cancelName} nicht dabei sein kann. Vielleicht beim nächsten Mal! 💔`;
      alert(cancelText);
      setCancelDialogOpen(false);
    } else {
      alert(`Fehler: ${response.error}`);
    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      {/* Globaler Hintergrund für alle Sektionen außer Hero */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          zIndex: -1,
        }}
      />

      <audio ref={audioRef} loop>
        <source src={beethovenMusic} type="audio/mpeg" />
      </audio>

      {/* Animated Particles Overlay */}
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
        {/* Left side particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`particle-left-${i}`}
            className={`absolute w-3 h-3 md:w-4 md:h-4 rounded-full ${i >= 4 ? "hidden md:block" : ""}`}
            style={{
              left: `${Math.random() * 20}%`,
              top: `${i * 12}%`,
              background: `radial-gradient(circle, ${
                [
                  "#ff0080",
                  "#ff8c00",
                  "#ffd700",
                  "#9d00ff",
                  "#00ff88",
                ][i % 5]
              }, transparent)`,
            }}
            animate={{
              x: [0, 30, 0, -20, 0],
              y: [0, -40, -80, -120, -160],
              scale: [1, 1.5, 1.2, 0.8, 0],
              opacity: [0, 0.8, 0.6, 0.3, 0],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Right side particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`particle-right-${i}`}
            className={`absolute w-3 h-3 md:w-4 md:h-4 rounded-full ${i >= 4 ? "hidden md:block" : ""}`}
            style={{
              right: `${Math.random() * 20}%`,
              top: `${i * 12 + 5}%`,
              background: `radial-gradient(circle, ${
                [
                  "#ffd700",
                  "#ff0080",
                  "#00ff88",
                  "#ff8c00",
                  "#9d00ff",
                ][i % 5]
              }, transparent)`,
            }}
            animate={{
              x: [0, -30, 0, 20, 0],
              y: [0, -40, -80, -120, -160],
              scale: [1, 1.5, 1.2, 0.8, 0],
              opacity: [0, 0.8, 0.6, 0.3, 0],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.6 + 0.3,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Floating circles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`circle-${i}`}
            className={`absolute rounded-full border-2 ${i >= 3 ? "hidden md:block" : ""}`}
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              width: `${40 + i * 10}px`,
              height: `${40 + i * 10}px`,
              borderColor: ["#ff0080", "#ffd700", "#9d00ff"][
                i % 3
              ],
            }}
            animate={{
              y: [0, -100, -200, -300],
              scale: [0, 1, 1.5, 2],
              opacity: [0, 0.4, 0.25, 0.1, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Sparkle effects */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className={`absolute ${i >= 6 ? "hidden md:block" : ""}`}
            style={{
              left: `${i * 8}%`,
              top: `${(i * 7) % 90}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          >
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gradient-to-br from-yellow-300 to-pink-500 rounded-full shadow-lg shadow-yellow-300/50" />
          </motion.div>
        ))}
      </div>

      {/* Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity }}
        className="fixed inset-0 flex items-center justify-center"
      >
        <div
          className="absolute inset-0 bg-cover bg-[position:calc(50%-2.5cm)_center] md:bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.35)), url('${heroImage}')`,
            filter: "brightness(0.95) contrast(1.05)",
          }}
        />
        <motion.div
          style={{ y: heroY }}
          className="relative z-10 text-center px-4"
        >
          <motion.h1
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 1.2,
              delay: 0.8,
              type: "spring",
            }}
            className="tracking-wider bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 bg-clip-text text-transparent font-bold"
            style={{
              fontSize: "clamp(12rem, 40vw, 35rem)",
              lineHeight: "1",
            }}
          >
            60
          </motion.h1>
          <motion.h1
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-4xl sm:text-6xl md:text-8xl mb-8 tracking-wider font-bold"
          >
            Jahre Jung!
          </motion.h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-base md:text-xl">
              Scroll für mehr
            </span>
            <ChevronDown
              size={32}
              className="md:w-10 md:h-10"
            />
          </motion.div>
        </motion.div>
      </motion.section>

      <div className="h-[100vh]" />

      {/* Section 1: Mach dich bereit */}
      <motion.section
        style={{ opacity: section1Opacity }}
        className="fixed inset-0 flex items-center justify-center"
      >
        <motion.div
          style={{ y: section1Y }}
          className="relative z-10 text-center px-4"
        >
          <motion.h2
            className="text-4xl sm:text-6xl md:text-8xl font-bold"
            initial={{ scale: 0.8, filter: "blur(10px)" }}
            whileInView={{ scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {isPlural
              ? "Macht euch bereit"
              : "Mach dich bereit"}
          </motion.h2>
        </motion.div>
      </motion.section>

      <div className="h-[100vh] flex items-center justify-center px-4">
        <img
          src={machDichBereitImage}
          alt="Mach dich bereit"
          className="max-w-2xl w-full h-auto rounded-3xl shadow-2xl"
        />
      </div>

      {/* Section 2: Gutes Essen */}
      <motion.section
        style={{ opacity: section2Opacity }}
        className="fixed inset-0 flex items-center justify-center"
      >
        <motion.div
          style={{ y: section2Y }}
          className="relative z-10 text-center px-4"
        >
          <motion.h2
            className="text-4xl sm:text-6xl md:text-8xl font-bold"
            initial={{ rotateX: -90, opacity: 0 }}
            whileInView={{ rotateX: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ perspective: "1000px" }}
          >
            Leckeres Essen
          </motion.h2>
        </motion.div>
      </motion.section>

      <div className="h-[100vh] flex items-center justify-center px-4">
        <img
          src={gutesEssenImage}
          alt="Gutes Essen"
          className="max-w-2xl w-full h-auto rounded-3xl shadow-2xl"
        />
      </div>

      {/* Section 3: Bombastische Musik */}
      <motion.section
        style={{ opacity: section3Opacity }}
        className="fixed inset-0 flex items-center justify-center"
      >
        <motion.div
          style={{ y: section3Y }}
          className="relative z-10 text-center px-4"
        >
          <motion.h2
            className="text-4xl sm:text-6xl md:text-8xl font-bold"
            initial={{ scale: 1.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            Kraftvolle Musik
          </motion.h2>
        </motion.div>
      </motion.section>

      <div className="h-[100vh] flex items-center justify-center px-4">
        <img
          src={bombastischeMusikImage}
          alt="Bombastische Musik"
          className="max-w-2xl w-full h-auto rounded-3xl shadow-2xl"
        />
      </div>

      {/* Section 4: Unter freiem Himmel */}
      <motion.section
        style={{ opacity: section4Opacity }}
        className="fixed inset-0 flex items-center justify-center"
      >
        <motion.div
          style={{ y: section4Y }}
          className="relative z-10 text-center px-4"
        >
          <motion.h2
            className="text-4xl sm:text-5xl md:text-8xl font-bold"
            initial={{
              y: 100,
              opacity: 0,
              filter: "blur(8px)",
            }}
            whileInView={{
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Unter freiem Himmel
          </motion.h2>
        </motion.div>
      </motion.section>

      <div className="h-[100vh] flex items-center justify-center px-4">
        <img
          src={unterFreiemHimmelImage}
          alt="Unter freiem Himmel"
          className="max-w-2xl w-full h-auto rounded-3xl shadow-2xl"
        />
      </div>

      {/* Section 5: Datum */}
      <motion.section
        style={{ opacity: section5Opacity }}
        className="fixed inset-0 flex items-center justify-center"
      >
        <motion.div
          style={{ y: section5Y }}
          className="relative z-10 text-center px-4"
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-6xl mb-4 font-bold"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Am
          </motion.h2>
          <motion.h2
            className="text-5xl sm:text-7xl md:text-9xl bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent font-bold"
            initial={{ scale: 0, rotate: -10 }}
            whileInView={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              type: "spring",
              stiffness: 200,
            }}
          >
            18.07.2026
          </motion.h2>
        </motion.div>
      </motion.section>

      <div className="h-[100vh] flex items-center justify-center px-4">
        <img
          src={am18072026Image}
          alt="18.07.2026"
          className="max-w-2xl w-full h-auto rounded-3xl shadow-2xl"
        />
      </div>

      {/* Final Section: Sei dabei */}
      <section className="relative min-h-screen flex flex-col justify-center pt-32 pb-20">
        <div className="relative z-10 max-w-2xl mx-auto px-4 w-full">
          
          <motion.h2
            initial={{
              scale: 0.5,
              opacity: 0,
              filter: "blur(20px)",
            }}
            whileInView={{
              scale: 1,
              opacity: 1,
              filter: "blur(0px)",
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-5xl sm:text-6xl md:text-8xl text-center mb-8 md:mb-12 font-bold"
          >
            {isPlural ? "Seid dabei!" : "Sei dabei!"}
          </motion.h2>

          <motion.h3
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: "easeOut",
            }}
            className="text-2xl sm:text-3xl md:text-5xl text-center mb-12 md:mb-16 font-bold"
          >
            {isPlural
              ? "Sichert euch jetzt eure Tickets"
              : "Sichere dir jetzt dein Ticket"}
          </motion.h3>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl p-6 md:p-12 border border-white/20"
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-4 md:space-y-6"
            >
              {/* Personenzähler Container */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <label className="block text-lg md:text-xl text-center sm:text-left">
                  Anzahl Personen
                </label>
                <div className="flex items-center justify-between sm:justify-start gap-4 bg-white/10 p-2 rounded-2xl border border-white/20">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                    disabled={guestCount <= 1}
                    className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 transition-all text-white border border-white/10"
                  >
                    <Minus size={24} />
                  </motion.button>

                  <div className="flex-1 sm:flex-none sm:w-24 text-center">
                    <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">
                      {guestCount}
                    </span>
                  </div>

                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setGuestCount(guestCount + 1)}
                    className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white border border-white/10"
                  >
                    <Plus size={24} />
                  </motion.button>
                </div>
              </div>

              {/* Dynamische Namensfelder */}
              {[...Array(guestCount)].map((_, index) => (
                <div key={index}>
                  <label
                    htmlFor={`name-${index}`}
                    className="block text-lg md:text-xl mb-2"
                  >
                    {guestCount > 1
                      ? `Name Person ${index + 1}`
                      : "Name"}
                  </label>
                  <input
                    type="text"
                    id={`name-${index}`}
                    name={`name-${index}`}
                    required
                    className="w-full px-4 py-3 md:px-6 md:py-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 text-base md:text-lg"
                    placeholder={
                      guestCount > 1
                        ? `Name Person ${index + 1}`
                        : "Dein Name"
                    }
                  />
                </div>
              ))}

              <div>
                <label
                  htmlFor="email"
                  className="block text-lg md:text-xl mb-2"
                >
                  E-Mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 md:px-6 md:py-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 text-base md:text-lg"
                  placeholder="deine@email.de"
                />
              </div>

              <div className="bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-yellow-500/20 rounded-xl p-4 md:p-6 border border-pink-500/30">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <span className="text-xl md:text-2xl">
                    Kosten:
                  </span>
                  <span className="text-xl md:text-3xl bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent">
                    Gute Laune und viel Glück!
                  </span>
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 py-4 md:py-5 rounded-xl text-xl md:text-2xl hover:shadow-2xl hover:shadow-pink-500/50 transition-all duration-300"
              >
                {isPlural ? "Tickets sichern!" : "Ticket sichern!"}
              </motion.button>

              <Dialog.Root
                open={cancelDialogOpen}
                onOpenChange={setCancelDialogOpen}
              >
                <Dialog.Trigger asChild>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/20 py-3 md:py-4 rounded-xl text-base md:text-lg text-white/70 hover:text-white transition-all duration-300"
                  >
                    {isPlural ? "Wir können leider nicht" : "Ich kann leider nicht"}
                  </motion.button>
                </Dialog.Trigger>

                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
                  <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl p-6 md:p-8 w-[90vw] max-w-md z-50 shadow-2xl">
                    <Dialog.Title className="text-2xl md:text-3xl font-bold text-white mb-2">
                      Absage
                    </Dialog.Title>
                    <Dialog.Description className="text-white/60 mb-6">
                      {isPlural
                        ? "Schade, dass ihr nicht dabei sein könnt!"
                        : "Schade, dass du nicht dabei sein kannst!"}
                    </Dialog.Description>

                    <form
                      onSubmit={handleCancel}
                      className="space-y-4"
                    >
                      <div>
                        <label
                          htmlFor="cancelName"
                          className="block text-lg text-white mb-2"
                        >
                          Dein Name
                        </label>
                        <input
                          type="text"
                          id="cancelName"
                          name="cancelName"
                          required
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                          placeholder="Dein Name"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 py-3 rounded-xl text-lg text-white transition-all duration-300"
                      >
                        Absagen
                      </button>
                    </form>

                    <Dialog.Close asChild>
                      <button
                        className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                        aria-label="Schließen"
                      >
                        <X size={24} />
                      </button>
                    </Dialog.Close>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>

              {/* Success Dialog */}
              <Dialog.Root
                open={successDialogOpen}
                onOpenChange={setSuccessDialogOpen}
              >
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
                  <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl z-50 shadow-2xl">
                    <div className="relative">
                      <img
                        src={afterSubmitImage}
                        alt="Vielen Dank"
                        className="w-full h-auto rounded-2xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-2xl flex flex-col items-center justify-end p-6 md:p-10">
                        <Dialog.Title className="text-2xl md:text-4xl font-bold text-white mb-4 text-center">
                          {isPlural
                            ? `Vielen Dank ${submittedNames.join(", ")}!`
                            : `Vielen Dank ${submittedNames[0]}!`}
                        </Dialog.Title>
                        <Dialog.Description className="text-lg md:text-2xl text-white/90 mb-6 text-center">
                          {isPlural
                            ? "Eure Tickets sind reserviert!"
                            : "Dein Ticket ist reserviert!"}
                        </Dialog.Description>
                        <p className="text-base md:text-xl text-white/80 text-center mb-8">
                          Bitte schaue in deine E-Mails für weitere Informationen. (Manchmal landen die Mails im Spam-Ordner, also bitte auch dort nachschauen!)
                        </p>
                        <Dialog.Close asChild>
                          <button className="bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 px-8 py-3 rounded-xl text-lg md:text-xl font-semibold hover:shadow-xl hover:shadow-pink-500/50 transition-all">
                            Schließen
                          </button>
                        </Dialog.Close>
                      </div>
                      <Dialog.Close asChild>
                        <button
                          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors bg-black/30 rounded-full p-2"
                          aria-label="Schließen"
                        >
                          <X size={24} />
                        </button>
                      </Dialog.Close>
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>

            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/geburtstag">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}