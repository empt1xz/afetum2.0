"use client";

import { CalendarDays, ChevronDown, Clock3, Heart, Image as ImageIcon, MapPin, Music2, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { getCardTheme } from "@/lib/cardThemes";
import type { MockMemory, MockTimelineEvent } from "@/lib/mockSession";
import styles from "./MemoryCardPreview.module.css";

type NasaApod = {
  date?: string;
  explanation?: string;
  hdurl?: string;
  media_type?: string;
  title?: string;
  url?: string;
};

type ThemeVars = CSSProperties & {
  "--card-bg": string;
  "--card-text": string;
  "--card-muted": string;
  "--card-accent": string;
  "--card-panel": string;
  "--card-panel-text": string;
};

const fallbackImages = [
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=900&q=80",
];

const formatDate = (value?: string) => {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  if (year && month && day) return `${day}/${month}/${year}`;

  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR").format(parsed);
};

const computeDuration = (date?: string, time?: string) => {
  const start = date ? new Date(`${date}T${time || "12:00"}:00`) : null;
  const now = new Date();

  if (!start || !Number.isFinite(start.getTime()) || start.getTime() > now.getTime()) {
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

const normalizeImageSource = (value: unknown) => {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (/^https?:\/\/\S+$/i.test(trimmed)) return trimmed;
  if (/^data:image\/(png|jpe?g|webp|gif);base64,/i.test(trimmed)) return trimmed;
  return "";
};

const extractYoutubeId = (url: string) => {
  if (!url.trim()) return "";

  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) return parsed.pathname.replace("/", "");
    if (parsed.hostname.includes("youtube.com")) return parsed.searchParams.get("v") || "";
  } catch {
    return "";
  }

  return "";
};

function NasaApodCard({ date }: { date?: string }) {
  const [data, setData] = useState<NasaApod | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!date) return;

    let active = true;
    setLoading(true);
    setExpanded(false);

    fetch(`/api/nasa?date=${encodeURIComponent(date)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: NasaApod | null) => {
        if (active) setData(payload);
      })
      .catch(() => {
        if (active) setData(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [date]);

  if (!date) return null;

  if (loading) {
    return (
      <section className={styles.nasaCard}>
        <div className={styles.nasaLoading}>Buscando imagem astronomica</div>
      </section>
    );
  }

  if (!data?.url) return null;

  return (
    <section className={styles.nasaCard}>
      <div className={styles.nasaMedia}>
        {data.media_type === "video" ? (
          <iframe src={data.url} title={data.title || "NASA APOD"} allowFullScreen />
        ) : (
          <img src={data.hdurl || data.url} alt={data.title || "NASA APOD"} />
        )}
        <div className={styles.nasaShade} />
        <span className={styles.nasaBadge}>NASA | {formatDate(data.date)}</span>
        <div className={styles.nasaText}>
          <h3>{data.title}</h3>
          {expanded && data.explanation && <p>{data.explanation}</p>}
          {data.explanation && (
            <button type="button" onClick={() => setExpanded((current) => !current)}>
              {expanded ? "Ocultar detalhes" : "Ver a historia cosmica"}
              <ChevronDown size={15} />
            </button>
          )}
        </div>
      </div>
      <p className={styles.nasaFooter}>Imagem astronomica do dia</p>
    </section>
  );
}

function Gallery({ images, layout }: { images: string[]; layout: string }) {
  if (images.length === 0) {
    return (
      <div className={styles.emptyGallery}>
        <ImageIcon size={28} />
        <span>Galeria aguardando fotos</span>
      </div>
    );
  }

  return (
    <div className={`${styles.gallery} ${layout === "retro" ? styles.galleryRetro : ""}`}>
      {images.slice(0, 6).map((image, index) => (
        <figure key={`${image}-${index}`} className={styles.galleryItem}>
          <img src={image} alt={`Foto ${index + 1}`} />
        </figure>
      ))}
    </div>
  );
}

function Timeline({ events }: { events: MockTimelineEvent[] }) {
  if (events.length === 0) return null;

  return (
    <section className={styles.sectionBlock}>
      <div className={styles.sectionHeader}>
        <Sparkles size={18} />
        <h2>Linha do tempo</h2>
      </div>
      <div className={styles.timeline}>
        {events.map((event) => (
          <article key={event.id} className={styles.timelineEvent}>
            {event.imageUrl && <img src={event.imageUrl} alt={event.title} />}
            <div>
              <span>{formatDate(event.date)}</span>
              <strong>{event.title}</strong>
              {event.description && <p>{event.description}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function MemoryCardPreview({ memory }: { memory: MockMemory }) {
  const theme = getCardTheme(memory.themeId);
  const duration = useMemo(
    () => computeDuration(memory.relationshipDate, memory.relationshipStartTime),
    [memory.relationshipDate, memory.relationshipStartTime],
  );
  const images = useMemo(() => {
    const normalized = (memory.images || []).map(normalizeImageSource).filter(Boolean);
    const legacy = normalizeImageSource((memory as MockMemory & { imageUrl?: string }).imageUrl);
    if (normalized.length > 0) return normalized;
    if (legacy) return [legacy];
    return memory.id.startsWith("mem-001") ? fallbackImages : [];
  }, [memory]);
  const youtubeId = extractYoutubeId(memory.youtubeUrl || "");
  const themeVars: ThemeVars = {
    "--card-bg": theme.background,
    "--card-text": theme.text,
    "--card-muted": theme.muted,
    "--card-accent": theme.accent,
    "--card-panel": theme.panel,
    "--card-panel-text": theme.panelText,
  };

  return (
    <article className={`${styles.cardRoot} ${styles[theme.layout]}`} style={themeVars}>
      <section className={styles.hero}>
        <div className={styles.themeChip}>{theme.name}</div>
        <p className={styles.eyebrow}>Para {memory.recipientName}</p>
        <h1>{memory.title}</h1>
        <div className={styles.heroMeta}>
          {memory.senderName && (
            <span>
              <Heart size={15} fill="currentColor" />
              {memory.senderName}
            </span>
          )}
          {memory.relationshipDate && (
            <span>
              <CalendarDays size={15} />
              {formatDate(memory.relationshipDate)}
            </span>
          )}
          {memory.city && (
            <span>
              <MapPin size={15} />
              {memory.city}
            </span>
          )}
        </div>
      </section>

      <Gallery images={images} layout={theme.layout} />

      {memory.youtubeUrl && (
        <section className={styles.musicCard}>
          {youtubeId ? (
            <img src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`} alt="Capa da musica" />
          ) : (
            <span className={styles.musicFallback}>
              <Music2 size={22} />
            </span>
          )}
          <div>
            <p>Trilha sonora</p>
            <a href={memory.youtubeUrl} target="_blank" rel="noreferrer">
              Abrir musica
            </a>
          </div>
        </section>
      )}

      <section className={styles.messageBlock}>
        <p>{memory.message}</p>
        {memory.senderName && <span>{memory.senderName}</span>}
      </section>

      <Timeline events={memory.timeline || []} />

      {(memory.relationshipDate || memory.relationshipSectionTitle || memory.relationshipCounterImage) && (
        <section className={styles.counterBlock}>
          {normalizeImageSource(memory.relationshipCounterImage) || images[0] ? (
            <img src={normalizeImageSource(memory.relationshipCounterImage) || images[0]} alt="Tempo juntos" />
          ) : null}
          <div>
            <span>{memory.relationshipSectionSubtitle || "Juntos desde"} {formatDate(memory.relationshipDate)}</span>
            <h2>{memory.relationshipSectionTitle || "Sobre o casal"}</h2>
            <div className={styles.counterGrid}>
              <p>
                <b>{duration.years}</b>
                Anos
              </p>
              <p>
                <b>{duration.months}</b>
                Meses
              </p>
              <p>
                <b>{duration.days}</b>
                Dias
              </p>
            </div>
            {memory.relationshipStartTime && (
              <small>
                <Clock3 size={13} />
                Desde as {memory.relationshipStartTime}
              </small>
            )}
          </div>
        </section>
      )}

      {memory.showNasaApod && <NasaApodCard date={memory.relationshipDate} />}

      <footer className={styles.cardFooter}>
        <img src="/Afavicon.png?v=3" alt="Afetum" />
        <span>Afetum</span>
      </footer>
    </article>
  );
}
