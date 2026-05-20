"use client";

import {
  CalendarDays,
  Clock3,
  Heart,
  ImageIcon,
  MapPin,
  Music,
  Sparkles,
} from "lucide-react";
import type { CardThemeId } from "@/lib/cardThemes";
import type { MockTimelineEvent } from "@/lib/mockSession";
import styles from "./CardPreview.module.css";

type PaletteId = "rose" | "amber" | "sky" | "emerald" | "violet" | "slate";

type CardPreviewProps = {
  themeId: CardThemeId;
  palette: PaletteId;
  title: string;
  recipientName: string;
  signerName: string;
  message: string;
  images: string[];
  youtubeUrl: string;
  timeline: MockTimelineEvent[];
  relationshipDate: string;
  relationshipStartTime: string;
  city: string;
  relationshipSectionTitle: string;
  relationshipSectionSubtitle: string;
  relationshipCounterImage: string;
  showNasaApod: boolean;
  activeSection?:
    | "title"
    | "music"
    | "photos"
    | "timeline"
    | "message"
    | "counter-media"
    | "counter-text";
};

const themeColorMap: Record<
  CardThemeId,
  { bg: string; accent: string; text: string; muted: string; highlight: string }
> = {
  aurora: {
    bg: "linear-gradient(135deg, #fce7f3 0%, #ede9fe 50%, #dbeafe 100%)",
    accent: "#ec4899",
    text: "#1e1b4b",
    muted: "#a78bfa",
    highlight: "#f9a8d4",
  },
  scrapbook: {
    bg: "linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)",
    accent: "#d97706",
    text: "#78350f",
    muted: "#f59e0b",
    highlight: "#fde68a",
  },

  //@ts-ignore
  midnight: {
    bg: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)",
    accent: "#818cf8",
    text: "#e0e7ff",
    muted: "#6366f1",
    highlight: "#4338ca",
  },
  forest: {
    bg: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)",
    accent: "#059669",
    text: "#064e3b",
    muted: "#34d399",
    highlight: "#a7f3d0",
  },
  blush: {
    bg: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fecdd3 100%)",
    accent: "#e11d48",
    text: "#881337",
    muted: "#fb7185",
    highlight: "#fecdd3",
  },
  ocean: {
    bg: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%)",
    accent: "#0284c7",
    text: "#0c4a6e",
    muted: "#38bdf8",
    highlight: "#bae6fd",
  },
};

const fallbackTheme = {
  bg: "linear-gradient(135deg, #fce7f3 0%, #ede9fe 100%)",
  accent: "#ec4899",
  text: "#1e1b4b",
  muted: "#a78bfa",
  highlight: "#f9a8d4",
};

const formatDate = (value: string) => {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
};

const computeDuration = (date: string, time: string) => {
  const start = date ? new Date(`${date}T${time || "12:00"}:00`) : null;
  const now = new Date();
  if (
    !start ||
    !Number.isFinite(start.getTime()) ||
    start.getTime() > now.getTime()
  ) {
    return { years: 0, months: 0, days: 0 };
  }
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
  };
};

export function CardPreview({
  themeId,
  title,
  recipientName,
  signerName,
  message,
  images,
  youtubeUrl,
  timeline,
  relationshipDate,
  relationshipStartTime,
  city,
  relationshipSectionTitle,
  relationshipSectionSubtitle,
  relationshipCounterImage,
  showNasaApod,
  activeSection,
}: CardPreviewProps) {
  const theme = themeColorMap[themeId] ?? fallbackTheme;
  const duration = computeDuration(relationshipDate, relationshipStartTime);
  const coverImage = images[0] || relationshipCounterImage || null;
  const hasContent =
    title.length >= 3 || images.length > 0 || message.length >= 8;

  return (
    <div className={styles.phoneWrap}>
      <div className={styles.phone}>
        <div className={styles.phoneSpeaker} />
        <div className={styles.phoneScreen}>
          <div
            className={styles.card}
            style={
              {
                "--theme-bg": theme.bg,
                "--theme-accent": theme.accent,
                "--theme-text": theme.text,
                "--theme-muted": theme.muted,
                "--theme-highlight": theme.highlight,
              } as React.CSSProperties
            }
          >
            {/* Header / Cover */}
            <div
              className={`${styles.cardHeader} ${activeSection === "title" ? styles.sectionActive : ""}`}
              style={{ background: theme.bg }}
            >
              {coverImage ? (
                <img
                  src={coverImage}
                  alt="Capa"
                  className={styles.coverImage}
                />
              ) : (
                <div className={styles.coverPlaceholder}>
                  <Heart size={28} fill={theme.accent} color={theme.accent} />
                </div>
              )}
              <div className={styles.cardHeaderOverlay}>
                <div
                  className={styles.themeChip}
                  style={{ background: theme.accent }}
                >
                  <Sparkles size={10} color="#fff" />
                  <span>Cartinha</span>
                </div>
                <h1 className={styles.cardTitle} style={{ color: theme.text }}>
                  {title || "Nossa história"}
                </h1>
                {recipientName && (
                  <p
                    className={styles.cardRecipient}
                    style={{ color: theme.text }}
                  >
                    Para {recipientName}
                  </p>
                )}
              </div>
            </div>

            {/* Details row */}
            {(city || relationshipDate) && (
              <div className={styles.detailsRow}>
                {city && (
                  <span className={styles.detailChip}>
                    <MapPin size={10} />
                    {city}
                  </span>
                )}
                {relationshipDate && (
                  <span className={styles.detailChip}>
                    <CalendarDays size={10} />
                    {formatDate(relationshipDate)}
                  </span>
                )}
                {relationshipStartTime && (
                  <span className={styles.detailChip}>
                    <Clock3 size={10} />
                    {relationshipStartTime}
                  </span>
                )}
              </div>
            )}

            {/* NASA APOD hint */}
            {showNasaApod && relationshipDate && (
              <div
                className={styles.nasaHint}
                style={{ borderColor: theme.muted, color: theme.muted }}
              >
                <ImageIcon size={11} />
                <span>Foto NASA de {formatDate(relationshipDate)}</span>
              </div>
            )}

            {/* Music */}
            {youtubeUrl && (
              <div
                className={`${styles.musicRow} ${activeSection === "music" ? styles.sectionActive : ""}`}
                style={{
                  background: `${theme.accent}18`,
                  borderColor: `${theme.accent}40`,
                }}
              >
                <div
                  className={styles.musicDot}
                  style={{ background: theme.accent }}
                />
                <Music size={12} color={theme.accent} />
                <span style={{ color: theme.text }}>Trilha sonora ativa</span>
              </div>
            )}

            {/* Photo gallery */}
            {images.length > 0 && (
              <div
                className={`${styles.photoSection} ${activeSection === "photos" ? styles.sectionActive : ""}`}
              >
                <div
                  className={styles.sectionLabel}
                  style={{ color: theme.muted }}
                >
                  Galeria
                </div>
                <div className={styles.photoGrid}>
                  {images.slice(0, 4).map((img, i) => (
                    <div key={`${img}-${i}`} className={styles.photoThumb}>
                      <img src={img} alt={`Foto ${i + 1}`} />
                      {i === 3 && images.length > 4 && (
                        <div
                          className={styles.photoMore}
                          style={{ background: `${theme.accent}cc` }}
                        >
                          +{images.length - 4}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Message */}
            {message && (
              <div
                className={`${styles.messageSection} ${activeSection === "message" ? styles.sectionActive : ""}`}
                style={{ borderLeftColor: theme.accent }}
              >
                <div
                  className={styles.sectionLabel}
                  style={{ color: theme.muted }}
                >
                  Mensagem
                </div>
                <p className={styles.messageText} style={{ color: theme.text }}>
                  {message.length > 120 ? `${message.slice(0, 120)}…` : message}
                </p>
                {signerName && (
                  <span
                    className={styles.signerName}
                    style={{ color: theme.accent }}
                  >
                    — {signerName}
                  </span>
                )}
              </div>
            )}

            {/* Counter section */}
            {(relationshipDate || relationshipCounterImage) && (
              <div
                className={`${styles.counterSection} ${activeSection === "counter-media" || activeSection === "counter-text" ? styles.sectionActive : ""}`}
                style={{ background: theme.bg }}
              >
                {relationshipCounterImage && (
                  <img
                    src={relationshipCounterImage}
                    alt="Contador"
                    className={styles.counterImage}
                  />
                )}
                <div className={styles.counterBody}>
                  <h2 style={{ color: theme.text }}>
                    {relationshipSectionTitle || "Sobre o casal"}
                  </h2>
                  <p style={{ color: theme.muted }}>
                    {relationshipSectionSubtitle || "Juntos desde"}{" "}
                    {formatDate(relationshipDate)}
                  </p>
                  <div className={styles.durationRow}>
                    {[
                      { value: duration.years, label: "Anos" },
                      { value: duration.months, label: "Meses" },
                      { value: duration.days, label: "Dias" },
                    ].map(({ value, label }) => (
                      <div
                        key={label}
                        className={styles.durationCell}
                        style={{ background: `${theme.accent}18` }}
                      >
                        <strong style={{ color: theme.accent }}>{value}</strong>
                        <span style={{ color: theme.muted }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Timeline */}
            {timeline.length > 0 && (
              <div
                className={`${styles.timelineSection} ${activeSection === "timeline" ? styles.sectionActive : ""}`}
              >
                <div
                  className={styles.sectionLabel}
                  style={{ color: theme.muted }}
                >
                  Linha do tempo
                </div>
                <div className={styles.timelineList}>
                  {timeline.slice(0, 3).map((event) => (
                    <div key={event.id} className={styles.timelineEntry}>
                      <div
                        className={styles.timelineDot}
                        style={{ background: theme.accent }}
                      />
                      <div>
                        <span
                          className={styles.timelineDate}
                          style={{ color: theme.muted }}
                        >
                          {formatDate(event.date)}
                        </span>
                        <p
                          className={styles.timelineTitle}
                          style={{ color: theme.text }}
                        >
                          {event.title}
                        </p>
                      </div>
                    </div>
                  ))}
                  {timeline.length > 3 && (
                    <p
                      className={styles.timelineMore}
                      style={{ color: theme.muted }}
                    >
                      +{timeline.length - 3} momentos
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Empty state */}
            {!hasContent && (
              <div className={styles.emptyPreview}>
                <Heart size={20} color={theme.muted} />
             
              </div>
            )}
          </div>
        </div>
        <div className={styles.phoneHome} />
      </div>

    </div>
  );
}
