import React, { useState, useEffect, useCallback, useRef } from "react";

// Inline Navigation Icons (Zero external dependencies)
const ChevronLeftIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

// Pre-filled TripGang Upcoming Treks Data
export const defaultTrips = [
  {
    id: "harishchandragad",
    tag: "🔥 BESTSELLER",
    difficulty: "Moderate",
    titleLine1: "HARISHCHANDRAGAD",
    titleLine2: "FORT & KONKAN KADA",
    desc: "1,424m cliff trek · Brocken Spectre · Ancient Kedareshwar Cave & sunrise at Taramati Peak",
    duration: "2 Days 1 Night",
    distance: "14-16 km",
    price: "₹1,699",
    originalPrice: "₹1,999",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
    ctaText: "Book Now",
    ctaUrl: "#booking",
  },
  {
    id: "aadrai",
    tag: "🌿 MONSOON SPECIAL",
    difficulty: "Easy",
    titleLine1: "AADRAI JUNGLE",
    titleLine2: "DARK FOREST & KALU WATERFALL",
    desc: "1,200ft waterfall view · Deep Sahyadri rainforest canopy · Ancient caves & streams",
    duration: "1 Day Trek",
    distance: "12-14 km",
    price: "₹799",
    originalPrice: "₹999",
    img: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80",
    ctaText: "Book Now",
    ctaUrl: "#booking",
  },
  {
    id: "kalsubai",
    tag: "⭐ HIGHEST PEAK",
    difficulty: "Moderate",
    titleLine1: "KALSUBAI PEAK",
    titleLine2: "EVEREST OF MAHARASHTRA",
    desc: "Highest point in Maharashtra (1,646m) · Sea of clouds sunrise · Steel ladders trail",
    duration: "1 Night 1 Day",
    distance: "6.6 km",
    price: "₹1,299",
    originalPrice: "₹1,599",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80",
    ctaText: "Book Now",
    ctaUrl: "#booking",
  },
  {
    id: "devkund",
    tag: "💧 HIDDEN GEM",
    difficulty: "Easy",
    titleLine1: "DEVKUND WATERFALL",
    titleLine2: "EMERALD POOL TREK",
    desc: "Turquoise plunge pool · Dense Bhira jungle trail · Picturesque Sahyadri streams",
    duration: "1 Day Trek",
    distance: "9-10 km",
    price: "₹899",
    originalPrice: "₹1,199",
    img: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1000&q=80",
    ctaText: "Book Now",
    ctaUrl: "#booking",
  },
  {
    id: "ratangad",
    tag: "🏰 JEWEL OF FORTS",
    difficulty: "Moderate",
    titleLine1: "RATANGAD FORT",
    titleLine2: "NEDHE & AMRUTESHWAR",
    desc: "Natural rock cavity (Nedhe) · Bhandardara dam view · Historic Maratha fort",
    duration: "2 Days 1 Night",
    distance: "11 km",
    price: "₹1,799",
    originalPrice: "₹2,199",
    img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80",
    ctaText: "Book Now",
    ctaUrl: "#booking",
  }
];

export function CoverFlowCarousel({
  items = defaultTrips,
  sectionLabel = null,
  autoplay = true,
  autoplayDelay = 4500,
  className = "",
  onCtaClick,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(0);
  const total = items.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (idx) => {
    setCurrentIndex(idx % total);
  };

  useEffect(() => {
    if (!autoplay || isHovered || total <= 1) return;
    const interval = setInterval(nextSlide, autoplayDelay);
    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, isHovered, nextSlide, total]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 45) {
      if (diff < 0) nextSlide();
      else prevSlide();
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div
      className={`relative w-full flex items-center justify-center select-none ${className}`}
      style={{
        backgroundColor: "transparent",
        color: "#ffffff",
        fontFamily: "'Space Grotesk', system-ui, sans-serif",
        padding: "4px 0",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div style={{ position: "relative", width: "100%", maxWidth: "1150px", margin: "0 auto", padding: "0 12px", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        {/* Optional Eyebrow */}
        {sectionLabel && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ width: "28px", height: "1px", background: "linear-gradient(90deg, transparent, #2EC27E)" }} />
            <h4
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#2EC27E",
                margin: 0,
              }}
            >
              {sectionLabel}
            </h4>
            <span style={{ width: "28px", height: "1px", background: "linear-gradient(90deg, #2EC27E, transparent)" }} />
          </div>
        )}

        {/* 3D Coverflow Stage */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "385px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "14px",
            perspective: "1300px",
          }}
        >
          {items.map((item, idx) => {
            const offset = (idx - currentIndex + total) % total;

            let transform = "translateX(0px) scale(0.4) rotateY(0deg)";
            let opacity = 0;
            let zIndex = 0;
            let filter = "brightness(0.3) blur(3px)";
            let isCenter = false;

            if (offset === 0) {
              isCenter = true;
              transform = "translateX(0px) scale(1) rotateY(0deg)";
              opacity = 1;
              zIndex = 30;
              filter = "brightness(1)";
            } else if (offset === 1) {
              transform = "translateX(235px) scale(0.85) rotateY(-18deg)";
              opacity = 0.65;
              zIndex = 20;
              filter = "brightness(0.65)";
            } else if (offset === 2) {
              transform = "translateX(415px) scale(0.70) rotateY(-30deg)";
              opacity = 0.32;
              zIndex = 10;
              filter = "brightness(0.45) blur(1px)";
            } else if (offset === total - 1) {
              transform = "translateX(-235px) scale(0.85) rotateY(18deg)";
              opacity = 0.65;
              zIndex = 20;
              filter = "brightness(0.65)";
            } else if (offset === total - 2) {
              transform = "translateX(-415px) scale(0.70) rotateY(30deg)";
              opacity = 0.32;
              zIndex = 10;
              filter = "brightness(0.45) blur(1px)";
            }

            const diffBadgeColor =
              item.difficulty === "Easy" ? "#2EC27E" : item.difficulty === "Hard" ? "#ef4444" : "#FB8500";

            return (
              <div
                key={item.id || idx}
                onClick={() => !isCenter && goToSlide(idx)}
                style={{
                  position: "absolute",
                  width: "285px",
                  height: "370px",
                  borderRadius: "18px",
                  overflow: "hidden",
                  backgroundColor: "#102A43",
                  border: isCenter ? "1px solid rgba(46,194,126,0.4)" : "1px solid rgba(56,189,248,0.15)",
                  transform,
                  opacity,
                  zIndex,
                  filter,
                  transformOrigin: "center center",
                  transition: "all 750ms cubic-bezier(0.25, 1, 0.5, 1)",
                  boxShadow: isCenter
                    ? "0 20px 50px rgba(0,0,0,0.9), 0 0 30px rgba(46,194,126,0.25)"
                    : "0 12px 28px rgba(0,0,0,0.6)",
                  cursor: isCenter ? "default" : "pointer",
                }}
              >
                {/* Trek Photo */}
                <img
                  src={item.img}
                  alt={item.titleLine1}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                {/* Dark Vignette Overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(8,17,32,0.4) 0%, rgba(8,17,32,0.1) 25%, rgba(8,17,32,0.75) 60%, rgba(8,17,32,0.98) 100%)",
                    pointerEvents: "none",
                    zIndex: 10,
                  }}
                />

                {/* Content Overlay */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    padding: "14px 14px 16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    textAlign: "center",
                    boxSizing: "border-box",
                    zIndex: 20,
                    opacity: isCenter ? 1 : 0,
                    transform: isCenter ? "translateY(0px)" : "translateY(16px)",
                    transition: "opacity 450ms ease, transform 450ms ease",
                    pointerEvents: isCenter ? "auto" : "none",
                  }}
                >
                  {/* Top Badges */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        color: "#041a10",
                        background: diffBadgeColor,
                        padding: "2px 8px",
                        borderRadius: "100px",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.difficulty || "Moderate"}
                    </span>

                    <span
                      style={{
                        display: "inline-block",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        color: "#38BDF8",
                        background: "rgba(56,189,248,0.12)",
                        border: "1px solid rgba(56,189,248,0.25)",
                        padding: "2px 8px",
                        borderRadius: "100px",
                      }}
                    >
                      {item.tag}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "3px",
                      marginTop: "auto",
                    }}
                  >
                    <h2
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "1.5rem",
                        letterSpacing: "0.04em",
                        color: "#ffffff",
                        margin: 0,
                        lineHeight: 1.05,
                        textShadow: "0 3px 12px rgba(0,0,0,0.95)",
                      }}
                    >
                      {item.titleLine1}
                    </h2>

                    {item.titleLine2 && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          color: "#38BDF8",
                          lineHeight: 1.2,
                          textShadow: "0 2px 8px rgba(0,0,0,0.9)",
                        }}
                      >
                        {item.titleLine2}
                      </span>
                    )}

                    {/* Stats pill */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "0.7rem",
                        color: "#94A3B8",
                        margin: "3px 0 1px",
                      }}
                    >
                      <span>⏱️ {item.duration}</span>
                      <span>•</span>
                      <span>📍 {item.distance}</span>
                    </div>

                    <div
                      style={{
                        width: "30px",
                        height: "2px",
                        backgroundColor: "#2EC27E",
                        borderRadius: "2px",
                        margin: "3px auto 4px",
                        boxShadow: "0 0 8px rgba(46,194,126,0.7)",
                      }}
                    />

                    {item.desc && (
                      <p
                        style={{
                          fontSize: "0.72rem",
                          color: "#CBD5E1",
                          maxWidth: "250px",
                          margin: "0 0 8px",
                          lineHeight: 1.28,
                          textShadow: "0 2px 8px rgba(0,0,0,0.9)",
                        }}
                      >
                        {item.desc}
                      </p>
                    )}

                    {/* Pricing & CTA */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontSize: "1rem", fontWeight: 800, color: "#2EC27E", lineHeight: 1 }}>
                          {item.price}
                        </div>
                        {item.originalPrice && (
                          <div style={{ fontSize: "0.68rem", color: "#64748B", textDecoration: "line-through" }}>
                            {item.originalPrice}
                          </div>
                        )}
                      </div>

                      <a
                        href={item.ctaUrl || "#booking"}
                        onClick={(e) => {
                          if (onCtaClick) {
                            e.preventDefault();
                            onCtaClick(item);
                          }
                        }}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "6px 16px",
                          borderRadius: "9999px",
                          background: "#2EC27E",
                          color: "#041a10",
                          fontSize: "0.74rem",
                          fontWeight: 800,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          textDecoration: "none",
                          boxShadow: "0 4px 12px rgba(46,194,126,0.4)",
                          cursor: "pointer",
                          transition: "transform 200ms ease, box-shadow 200ms ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      >
                        <span>{item.ctaText || "Book Now"}</span>
                        <ArrowRightIcon />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous trip"
          style={{
            position: "absolute",
            left: "10px",
            top: "52%",
            transform: "translateY(-50%)",
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            backgroundColor: "rgba(8,17,32,0.8)",
            border: "1px solid rgba(56,189,248,0.25)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(8px)",
            cursor: "pointer",
            boxShadow: "0 6px 18px rgba(0,0,0,0.5)",
            zIndex: 40,
            transition: "all 200ms ease",
          }}
        >
          <ChevronLeftIcon />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next trip"
          style={{
            position: "absolute",
            right: "10px",
            top: "52%",
            transform: "translateY(-50%)",
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            backgroundColor: "rgba(8,17,32,0.8)",
            border: "1px solid rgba(56,189,248,0.25)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(8px)",
            cursor: "pointer",
            boxShadow: "0 6px 18px rgba(0,0,0,0.5)",
            zIndex: 40,
            transition: "all 200ms ease",
          }}
        >
          <ChevronRightIcon />
        </button>

        {/* Pagination Dots */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", zIndex: 30 }}>
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              style={{
                height: "6px",
                width: idx === currentIndex ? "22px" : "6px",
                borderRadius: "9999px",
                backgroundColor: idx === currentIndex ? "#2EC27E" : "rgba(255,255,255,0.2)",
                border: "none",
                cursor: "pointer",
                boxShadow: idx === currentIndex ? "0 0 8px rgba(46,194,126,0.8)" : "none",
                transition: "all 300ms ease",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CoverFlowCarousel;
