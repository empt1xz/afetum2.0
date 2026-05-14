"use client";

import {
  Badge,
  BriefcaseBusiness,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  CreditCard,
  FileText,
  GraduationCap,
  Heart,
  Home,
  Image as ImageIcon,
  ImagePlus,
  ListPlus,
  MapPin,
  MessageSquareHeart,
  Music,
  Plus,
  QrCode,
  Shield,
  Sparkles,
  Timer,
  Trash2,
  Type,
  User,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import {
  cardThemeOptions,
  paletteByThemeId,
  resolveCardThemeId,
  themeIdByPalette,
  type CardThemeId,
} from "@/lib/cardThemes";
import {
  loadMockMemories,
  saveMockMemories,
  type MockMemory,
  type MockMemoryStatus,
  type MockTimelineEvent,
} from "@/lib/mockSession";

type GiftType = "love" | "friend";
type CreateStep = "type" | "details" | "relationship" | "builder" | "plans" | "checkout";
type BuilderStepId = "title" | "music" | "photos" | "timeline" | "message" | "counter-media" | "counter-text";
type PaletteId = MockMemory["palette"];
type PlanType = "lifetime" | "day";
type PaymentMethod = "pix" | "card" | "saldo";

type TimelineDraft = {
  date: string;
  title: string;
  description: string;
  imageUrl: string;
};

type CreateMemoryPayload = {
  status: MockMemoryStatus;
  type: GiftType;
  recipientName: string;
  recipientType: string;
  signerName: string;
  relationshipDate: string;
  relationshipStartTime: string;
  city: string;
  showNasaApod: boolean;
  title: string;
  palette: PaletteId;
  themeId: CardThemeId;
  youtubeUrl: string;
  images: string[];
  timeline: MockTimelineEvent[];
  message: string;
  relationshipCounterImage: string;
  relationshipSectionTitle: string;
  relationshipSectionSubtitle: string;
  plan: PlanType;
  paymentMethod: PaymentMethod;
};

const directRecipients = [
  { id: "mae", label: "Mae", icon: Sparkles },
  { id: "pai", label: "Pai", icon: Shield },
  { id: "avo", label: "Avo", icon: Users },
  { id: "irma", label: "Irma", icon: Badge },
  { id: "tia", label: "Tia", icon: Sparkles },
  { id: "filha", label: "Filha", icon: Badge },
  { id: "madrinha", label: "Madrinha", icon: Sparkles },
  { id: "sogra", label: "Sogra", icon: Home },
  { id: "professora", label: "Professora", icon: GraduationCap },
  { id: "chefe", label: "Chefe", icon: BriefcaseBusiness },
];

const giftTypes = [
  {
    id: "love" as const,
    title: "Presente de Amor",
    description: "Para namorado(a), noivo(a) ou conjuge",
    tag: "+ Linha do tempo, contador e trilha sonora",
    icon: Heart,
    badge: "Mais pedido",
  },
  {
    id: "friend" as const,
    title: "Presente para Amiga(o)",
    description: "Memorias, fotos favoritas e mensagem especial",
    tag: "+ Leve, afetuoso e facil de personalizar",
    icon: MessageSquareHeart,
  },
];

const builderSteps = [
  { id: "title" as const, label: "Titulo", icon: Type },
  { id: "music" as const, label: "Musica", icon: Music },
  { id: "photos" as const, label: "Fotos", icon: ImagePlus },
  { id: "timeline" as const, label: "Eventos", icon: ListPlus },
  { id: "message" as const, label: "Mensagem", icon: FileText },
  { id: "counter-media" as const, label: "Tempo", icon: Camera },
  { id: "counter-text" as const, label: "Textos", icon: Timer },
];

const titleSuggestions = [
  "Eu e voce para sempre",
  "Nossa melhor fase",
  "A historia mais bonita",
  "Nosso amor em detalhes",
];

const messageSuggestions = [
  "Voce transformou dias comuns nas minhas lembrancas favoritas.",
  "Se amor fosse lugar, eu moraria no seu abraco.",
  "Com voce, a vida ganhou cor, sentido e paz.",
];

const planOptions: Array<{
  id: PlanType;
  title: string;
  description: string;
  price: string;
  note: string;
  productId: "memoria_eterna" | "carta_secreta";
}> = [
  {
    id: "lifetime",
    title: "Para Sempre",
    description: "Link vitalicio, editavel e pronto para compartilhar.",
    price: "19,90",
    note: "Pagamento unico e acesso permanente.",
    productId: "memoria_eterna",
  },
  {
    id: "day",
    title: "So Hoje",
    description: "Cartinha ativa por 24 horas para uma surpresa rapida.",
    price: "15,00",
    note: "Acesso liberado por 1 dia.",
    productId: "carta_secreta",
  },
];

const paymentOptions = [
  { id: "pix" as const, title: "PIX", description: "Aprovacao instantanea", icon: QrCode },
  { id: "card" as const, title: "Cartao", description: "Credito Visa, Master ou Elo", icon: CreditCard },
  { id: "saldo" as const, title: "Saldo", description: "Usar saldo de cartinha", icon: Badge },
];

const getTodayIso = () => new Date().toISOString().slice(0, 10);

const formatDisplayDate = (value: string) => {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
};

const computeDuration = (date: string, time: string) => {
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

const buildMockMemory = (payload: CreateMemoryPayload, previous?: MockMemory): MockMemory => {
  const plan = planOptions.find((option) => option.id === payload.plan) || planOptions[0];
  const title =
    payload.title.trim() ||
    (payload.type === "love" ? "Nossa historia" : `Cartinha para ${payload.recipientName || payload.recipientType}`);
  const recipientName = payload.recipientName.trim() || payload.recipientType || "Destinatario";
  const message =
    payload.message.trim() ||
    (payload.signerName.trim()
      ? `Rascunho criado por ${payload.signerName.trim()} no fluxo de cartinhas.`
      : "Rascunho criado no fluxo de cartinhas.");

  return {
    id: previous?.id || `mem-${Date.now()}`,
    title,
    recipientName,
    recipientType: payload.type === "love" ? "Amor" : payload.recipientType,
    senderName: payload.signerName.trim(),
    message,
    status: payload.status,
    views: previous?.views || 0,
    createdAt: previous?.createdAt || new Date().toISOString(),
    palette: payload.palette,
    themeId: payload.themeId,
    relationshipDate: payload.relationshipDate,
    relationshipStartTime: payload.relationshipStartTime,
    city: payload.city,
    showNasaApod: payload.showNasaApod,
    youtubeUrl: payload.youtubeUrl.trim(),
    images: payload.images,
    timeline: payload.timeline,
    relationshipCounterImage: payload.relationshipCounterImage.trim(),
    relationshipSectionTitle: payload.relationshipSectionTitle.trim(),
    relationshipSectionSubtitle: payload.relationshipSectionSubtitle.trim(),
    plan: payload.plan,
    productId: plan.productId,
    paymentMethod: payload.paymentMethod,
    linkExpiresAt:
      payload.status === "paid" && payload.plan === "day"
        ? previous?.linkExpiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        : undefined,
  };
};

export default function CreateLetterPage() {
  const router = useRouter();
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);
  const [originalMemory, setOriginalMemory] = useState<MockMemory | null>(null);
  const [step, setStep] = useState<CreateStep>("type");
  const [builderStep, setBuilderStep] = useState(0);
  const [selectedType, setSelectedType] = useState<GiftType>("love");
  const [selectedRecipient, setSelectedRecipient] = useState("Mae");
  const [recipientName, setRecipientName] = useState("");
  const [signerName, setSignerName] = useState("");
  const [relationshipDate, setRelationshipDate] = useState(getTodayIso());
  const [relationshipStartTime, setRelationshipStartTime] = useState("12:00");
  const [city, setCity] = useState("");
  const [showNasaApod, setShowNasaApod] = useState(true);
  const [letterTitle, setLetterTitle] = useState("Nossa historia");
  const [selectedPalette, setSelectedPalette] = useState<PaletteId>("rose");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [timelineDraft, setTimelineDraft] = useState<TimelineDraft>({
    date: getTodayIso(),
    title: "",
    description: "",
    imageUrl: "",
  });
  const [timelineItems, setTimelineItems] = useState<MockTimelineEvent[]>([]);
  const [message, setMessage] = useState("");
  const [relationshipCounterImage, setRelationshipCounterImage] = useState("");
  const [relationshipSectionTitle, setRelationshipSectionTitle] = useState("Sobre o casal");
  const [relationshipSectionSubtitle, setRelationshipSectionSubtitle] = useState("Juntos desde");
  const [selectedThemeId, setSelectedThemeId] = useState<CardThemeId>("aurora");
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("lifetime");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const memoryId = params.get("memoryId");
    if (!memoryId) return;

    const memory = loadMockMemories().find((item) => item.id === memoryId);
    if (!memory) {
      router.replace("/dashboard");
      return;
    }

    const loadedThemeId = memory.themeId ? resolveCardThemeId(memory.themeId) : themeIdByPalette(memory.palette);
    const loadedPlan: PlanType = memory.plan || (memory.productId === "carta_secreta" ? "day" : "lifetime");
    const isLoveRecipient = ["amor", "namoro", "partner"].includes(memory.recipientType.trim().toLowerCase());

    setEditingMemoryId(memory.id);
    setOriginalMemory(memory);
    setSelectedType(isLoveRecipient ? "love" : "friend");
    setSelectedRecipient(isLoveRecipient ? "Mae" : memory.recipientType || "Mae");
    setRecipientName(memory.recipientName || "");
    setSignerName(memory.senderName || "");
    setRelationshipDate(memory.relationshipDate || getTodayIso());
    setRelationshipStartTime(memory.relationshipStartTime || "12:00");
    setCity(memory.city || "");
    setShowNasaApod(Boolean(memory.showNasaApod));
    setLetterTitle(memory.title || "Nossa historia");
    setSelectedPalette(memory.palette || paletteByThemeId(loadedThemeId));
    setSelectedThemeId(loadedThemeId);
    setYoutubeUrl(memory.youtubeUrl || "");
    setImages(memory.images || []);
    setTimelineItems(memory.timeline || []);
    setMessage(memory.message || "");
    setRelationshipCounterImage(memory.relationshipCounterImage || "");
    setRelationshipSectionTitle(memory.relationshipSectionTitle || "Sobre o casal");
    setRelationshipSectionSubtitle(memory.relationshipSectionSubtitle || "Juntos desde");
    setSelectedPlan(loadedPlan);
    setPaymentMethod(memory.paymentMethod || "pix");
    setTimelineDraft({
      date: memory.relationshipDate || getTodayIso(),
      title: "",
      description: "",
      imageUrl: "",
    });
    setStep("builder");
    setBuilderStep(0);
  }, [router]);

  const selectedTypeLabel = selectedType === "love" ? "Presente de Amor" : `Presente para ${selectedRecipient}`;
  const fieldPlaceholder = selectedType === "love" ? "Nome da pessoa amada" : `Nome de ${selectedRecipient}`;
  const currentBuilderStep = builderSteps[builderStep];
  const selectedPlanOption = planOptions.find((plan) => plan.id === selectedPlan) || planOptions[0];
  const selectedPaymentOption = paymentOptions.find((payment) => payment.id === paymentMethod) || paymentOptions[0];
  const isEditing = Boolean(editingMemoryId);
  const canContinueDetails = recipientName.trim().length > 0 && signerName.trim().length > 0;
  const canContinueRelationship = Boolean(relationshipDate && relationshipStartTime);

  const relationshipDuration = useMemo(
    () => computeDuration(relationshipDate, relationshipStartTime),
    [relationshipDate, relationshipStartTime],
  );

  const canContinueBuilder = useMemo(() => {
    switch (currentBuilderStep.id) {
      case "title":
        return letterTitle.trim().length >= 3;
      case "photos":
        return images.length > 0;
      case "message":
        return message.trim().length >= 8;
      case "counter-text":
        return relationshipSectionTitle.trim().length >= 3;
      default:
        return true;
    }
  }, [currentBuilderStep.id, images.length, letterTitle, message, relationshipSectionTitle]);

  const progressPercent = useMemo(() => {
    if (step === "type") return 8;
    if (step === "details") return 16;
    if (step === "relationship") return 28;
    if (step === "builder") return 38 + builderStep * 6.5;
    if (step === "plans") return 90;
    return 100;
  }, [builderStep, step]);

  const progressLabel = useMemo(() => {
    const current = selectedType === "love" ? "Amor" : selectedRecipient;
    if (step === "builder") return `Personalizando cartinha: ${currentBuilderStep.label}`;
    if (step === "plans") return "Escolha do plano";
    if (step === "checkout") return `Pagamento por ${selectedPaymentOption.title}`;
    if (step === "relationship") return `Historia do relacionamento: ${current}`;
    return step === "details" ? `Detalhes do presente: ${current}` : `Tipo escolhido: ${current}`;
  }, [currentBuilderStep.label, selectedPaymentOption.title, selectedRecipient, selectedType, step]);

  const guideMessage = useMemo(() => {
    if (step === "details") {
      return "Que escolha linda! Seu amor vai sentir cada detalhe dessa surpresa. Me conta, qual o nome dessa pessoa?";
    }

    if (step === "relationship") return "Que lindo! Agora me diz: quando a historia comecou?";

    if (step === "builder") {
      const messages: Record<BuilderStepId, string> = {
        title: "Agora vamos dar um nome para essa cartinha e escolher o clima visual dela.",
        music: "Se tiver uma musica especial, cola aqui o link do YouTube para tocar na cartinha.",
        photos: "Escolhe as fotos principais. Elas vao aparecer na galeria da cartinha.",
        timeline: "Agora marca os momentos importantes da historia de voces.",
        message: "Escreve a mensagem que vai aparecer no coracao da cartinha.",
        "counter-media": "Escolhe uma imagem para a secao de tempo juntos.",
        "counter-text": "So falta ajustar os textos do contador antes dos planos.",
      };
      return messages[currentBuilderStep.id];
    }

    if (step === "plans") return "Ficou lindo! Agora escolhe como essa cartinha vai ficar ativa.";
    if (step === "checkout") return "Ultima etapa: confirma o pagamento para ativar a cartinha.";

    return "Que tipo de presente vamos criar?";
  }, [currentBuilderStep.id, step]);

  const continueDisabled =
    (step === "details" && !canContinueDetails) ||
    (step === "relationship" && !canContinueRelationship) ||
    (step === "builder" && !canContinueBuilder);

  const continueLabel = useMemo(() => {
    if (step === "builder" && builderStep === builderSteps.length - 1) return "Ver planos";
    if (step === "plans") return "Ir para pagamento";
    if (step === "checkout") return isEditing ? "Salvar alteracoes" : "Ativar cartinha";
    return "Continuar";
  }, [builderStep, isEditing, step]);

  const saveMemory = (status: MockMemoryStatus = "draft") => {
    const memories = loadMockMemories();
    const previousMemory = editingMemoryId
      ? memories.find((memory) => memory.id === editingMemoryId) || originalMemory || undefined
      : undefined;
    const nextMemory = buildMockMemory(
      {
        status,
        type: selectedType,
        recipientName,
        recipientType: selectedRecipient,
        signerName,
        relationshipDate,
        relationshipStartTime,
        city: city.trim(),
        showNasaApod,
        title: letterTitle,
        palette: selectedPalette,
        themeId: selectedThemeId,
        youtubeUrl,
        images,
        timeline: timelineItems,
        message,
        relationshipCounterImage,
        relationshipSectionTitle,
        relationshipSectionSubtitle,
        plan: selectedPlan,
        paymentMethod,
      },
      previousMemory,
    );

    saveMockMemories(
      previousMemory
        ? memories.map((memory) => (memory.id === previousMemory.id ? nextMemory : memory))
        : [nextMemory, ...memories],
    );
    router.push("/dashboard");
  };

  const handleContinue = () => {
    if (continueDisabled) return;

    if (step === "type") {
      setStep("details");
      return;
    }

    if (step === "details") {
      setStep("relationship");
      return;
    }

    if (step === "relationship") {
      setStep("builder");
      setBuilderStep(0);
      return;
    }

    if (step === "builder") {
      if (builderStep < builderSteps.length - 1) {
        setBuilderStep((current) => current + 1);
      } else {
        setStep("plans");
      }
      return;
    }

    if (step === "plans") {
      setStep("checkout");
      return;
    }

    saveMemory("paid");
  };

  const handleBack = () => {
    if (step === "checkout") {
      setStep("plans");
      return;
    }

    if (step === "plans") {
      setStep("builder");
      setBuilderStep(builderSteps.length - 1);
      return;
    }

    if (step === "builder") {
      if (builderStep > 0) {
        setBuilderStep((current) => Math.max(0, current - 1));
        return;
      }

      setStep("relationship");
      return;
    }

    if (step === "relationship") {
      setStep("details");
      return;
    }

    if (step === "details") {
      setStep("type");
      return;
    }

    router.back();
  };

  const addImage = () => {
    const nextImage = imageUrlInput.trim();
    if (!nextImage) return;
    setImages((current) => [...current, nextImage].slice(0, 8));
    setImageUrlInput("");
  };

  const addTimelineItem = () => {
    if (!timelineDraft.title.trim()) return;
    setTimelineItems((current) => [
      ...current,
      {
        id: `event-${Date.now()}`,
        date: timelineDraft.date,
        title: timelineDraft.title.trim(),
        description: timelineDraft.description.trim(),
        imageUrl: timelineDraft.imageUrl.trim() || undefined,
      },
    ]);
    setTimelineDraft({
      date: relationshipDate || getTodayIso(),
      title: "",
      description: "",
      imageUrl: "",
    });
  };

  const renderBuilderStepContent = () => {
    if (currentBuilderStep.id === "title") {
      return (
        <div className={styles.builderStack}>
          <div className={styles.builderTitle}>
            <h2>Titulo do presente</h2>
            <p>Use algo curto, emocional e facil de ler na abertura da cartinha.</p>
          </div>

          <div className={styles.themeBox}>
            <span>Tema da cartinha</span>
            <div className={styles.themeGrid}>
              {cardThemeOptions.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  className={`${styles.themeOption} ${selectedThemeId === theme.id ? styles.themeOptionActive : ""}`}
                  onClick={() => {
                    setSelectedThemeId(theme.id);
                    setSelectedPalette(paletteByThemeId(theme.id));
                  }}
                >
                  <span className={styles.themeSwatches} aria-hidden="true">
                    {theme.swatches.map((color) => (
                      <i key={color} style={{ background: color }} />
                    ))}
                  </span>
                  <strong>{theme.name}</strong>
                  <small>{theme.description}</small>
                </button>
              ))}
            </div>
          </div>

          <label className={styles.fieldGroup}>
            <span>Titulo</span>
            <div className={styles.dateTimeField}>
              <Type size={20} />
              <input
                type="text"
                value={letterTitle}
                onChange={(event) => setLetterTitle(event.target.value.slice(0, 40))}
                placeholder="Ex: Eu e voce para sempre"
                maxLength={40}
              />
            </div>
          </label>

          <div className={styles.suggestionRow}>
            {titleSuggestions.map((suggestion) => (
              <button key={suggestion} type="button" onClick={() => setLetterTitle(suggestion)}>
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (currentBuilderStep.id === "music") {
      return (
        <div className={styles.builderStack}>
          <div className={styles.builderTitle}>
            <h2>Musica</h2>
            <p>Cole um link do YouTube para deixar a cartinha com trilha sonora.</p>
          </div>

          <label className={styles.fieldGroup}>
            <span>Link da musica</span>
            <div className={styles.dateTimeField}>
              <Music size={20} />
              <input
                type="url"
                value={youtubeUrl}
                onChange={(event) => setYoutubeUrl(event.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
          </label>

          <div className={styles.previewNote}>
            <Music size={18} />
            {youtubeUrl.trim() ? "Musica vinculada a cartinha." : "Voce pode pular essa etapa se preferir."}
          </div>
        </div>
      );
    }

    if (currentBuilderStep.id === "photos") {
      return (
        <div className={styles.builderStack}>
          <div className={styles.builderTitle}>
            <h2>Fotos</h2>
            <p>Adicione imagens por URL para montar a galeria principal.</p>
          </div>

          <div className={styles.inlineAdd}>
            <label className={styles.dateTimeField}>
              <ImagePlus size={20} />
              <input
                type="url"
                value={imageUrlInput}
                onChange={(event) => setImageUrlInput(event.target.value)}
                placeholder="Cole a URL da foto"
              />
            </label>
            <button type="button" onClick={addImage}>
              <Plus size={18} />
              Adicionar
            </button>
          </div>

          <div className={styles.mediaGrid}>
            {images.map((image, index) => (
              <div key={`${image}-${index}`} className={styles.mediaItem}>
                <img src={image} alt={`Foto ${index + 1}`} />
                <button
                  type="button"
                  onClick={() => setImages((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                  aria-label="Remover foto"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            {images.length === 0 && (
              <div className={styles.emptyState}>
                <ImageIcon size={26} />
                <span>Nenhuma foto adicionada ainda.</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (currentBuilderStep.id === "timeline") {
      return (
        <div className={styles.builderStack}>
          <div className={styles.builderTitle}>
            <h2>Eventos</h2>
            <p>Monte a linha do tempo com os momentos marcantes.</p>
          </div>

          <div className={styles.timelineDraft}>
            <label className={styles.fieldGroup}>
              <span>Data</span>
              <div className={styles.dateTimeField}>
                <CalendarDays size={20} />
                <input
                  type="date"
                  value={timelineDraft.date}
                  onChange={(event) => setTimelineDraft((current) => ({ ...current, date: event.target.value }))}
                />
              </div>
            </label>

            <label className={styles.fieldGroup}>
              <span>Titulo do momento</span>
              <div className={styles.dateTimeField}>
                <Sparkles size={20} />
                <input
                  type="text"
                  value={timelineDraft.title}
                  onChange={(event) => setTimelineDraft((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Ex: Nosso primeiro encontro"
                  maxLength={60}
                />
              </div>
            </label>

            <label className={styles.fieldGroup}>
              <span>Descricao</span>
              <textarea
                className={styles.textArea}
                value={timelineDraft.description}
                onChange={(event) => setTimelineDraft((current) => ({ ...current, description: event.target.value }))}
                placeholder="Conte o que aconteceu nesse dia..."
                rows={4}
                maxLength={280}
              />
            </label>

            <label className={styles.fieldGroup}>
              <span>Foto do evento (opcional)</span>
              <div className={styles.dateTimeField}>
                <ImageIcon size={20} />
                <input
                  type="url"
                  value={timelineDraft.imageUrl}
                  onChange={(event) => setTimelineDraft((current) => ({ ...current, imageUrl: event.target.value }))}
                  placeholder="Cole a URL da foto"
                />
              </div>
            </label>

            <button type="button" className={styles.fullButton} onClick={addTimelineItem}>
              <Plus size={18} />
              Adicionar evento
            </button>
          </div>

          <div className={styles.timelineList}>
            {timelineItems.map((item) => (
              <div key={item.id} className={styles.timelineItem}>
                <div>
                  <span>{formatDisplayDate(item.date)}</span>
                  <strong>{item.title}</strong>
                  {item.description && <p>{item.description}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => setTimelineItems((current) => current.filter((event) => event.id !== item.id))}
                  aria-label="Remover evento"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (currentBuilderStep.id === "message") {
      return (
        <div className={styles.builderStack}>
          <div className={styles.builderTitle}>
            <h2>Mensagem</h2>
            <p>Escreva a dedicacao principal da cartinha.</p>
          </div>

          <textarea
            className={styles.textAreaLarge}
            value={message}
            onChange={(event) => setMessage(event.target.value.slice(0, 5000))}
            placeholder="Digite sua mensagem..."
            rows={8}
            maxLength={5000}
          />

          <div className={styles.suggestionRow}>
            {messageSuggestions.map((suggestion) => (
              <button key={suggestion} type="button" onClick={() => setMessage(suggestion)}>
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (currentBuilderStep.id === "counter-media") {
      return (
        <div className={styles.builderStack}>
          <div className={styles.builderTitle}>
            <h2>Tempo juntos</h2>
            <p>Escolha uma imagem para aparecer junto do contador.</p>
          </div>

          <label className={styles.fieldGroup}>
            <span>Imagem do contador</span>
            <div className={styles.dateTimeField}>
              <Camera size={20} />
              <input
                type="url"
                value={relationshipCounterImage}
                onChange={(event) => setRelationshipCounterImage(event.target.value)}
                placeholder="Cole a URL da imagem"
              />
            </div>
          </label>

          {relationshipCounterImage.trim() ? (
            <div className={styles.counterPreview}>
              <img src={relationshipCounterImage} alt="Previa do contador" />
            </div>
          ) : (
            <button
              type="button"
              className={styles.fullButtonSecondary}
              onClick={() => setRelationshipCounterImage(images[0] || "")}
              disabled={images.length === 0}
            >
              Usar primeira foto da galeria
            </button>
          )}
        </div>
      );
    }

    return (
      <div className={styles.builderStack}>
        <div className={styles.builderTitle}>
          <h2>Textos do contador</h2>
          <p>Personalize como a secao de tempo juntos vai aparecer.</p>
        </div>

        <label className={styles.fieldGroup}>
          <span>Titulo da secao</span>
          <div className={styles.dateTimeField}>
            <Timer size={20} />
            <input
              type="text"
              value={relationshipSectionTitle}
              onChange={(event) => setRelationshipSectionTitle(event.target.value.slice(0, 50))}
              placeholder="Sobre o casal"
              maxLength={50}
            />
          </div>
        </label>

        <label className={styles.fieldGroup}>
          <span>Subtitulo</span>
          <div className={styles.dateTimeField}>
            <FileText size={20} />
            <input
              type="text"
              value={relationshipSectionSubtitle}
              onChange={(event) => setRelationshipSectionSubtitle(event.target.value.slice(0, 80))}
              placeholder="Juntos desde"
              maxLength={80}
            />
          </div>
        </label>

        <div className={styles.counterTextPreview}>
          <strong>{relationshipSectionTitle || "Sobre o casal"}</strong>
          <span>
            {relationshipSectionSubtitle || "Juntos desde"} {formatDisplayDate(relationshipDate)}
          </span>
          <div>
            <p>
              <b>{relationshipDuration.years}</b>Anos
            </p>
            <p>
              <b>{relationshipDuration.months}</b>Meses
            </p>
            <p>
              <b>{relationshipDuration.days}</b>Dias
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderBuilder = () => (
    <div className={styles.builderShell}>
      <div className={styles.builderStepper}>
        {builderSteps.map((builderStepOption, index) => {
          const Icon = builderStepOption.icon;
          const isActive = index === builderStep;
          const isCompleted = index < builderStep;

          return (
            <button
              key={builderStepOption.id}
              type="button"
              className={`${styles.stepPill} ${isActive ? styles.stepPillActive : ""} ${
                isCompleted ? styles.stepPillCompleted : ""
              }`}
              onClick={() => setBuilderStep(index)}
            >
              {isCompleted ? <CheckCircle2 size={16} /> : <Icon size={16} />}
              <span>{builderStepOption.label}</span>
            </button>
          );
        })}
      </div>

      <section className={styles.builderPanel}>{renderBuilderStepContent()}</section>
    </div>
  );

  const renderPlans = () => (
    <div className={styles.plansShell}>
      <div className={styles.plansGrid}>
        {planOptions.map((plan) => (
          <button
            key={plan.id}
            type="button"
            className={`${styles.planCard} ${selectedPlan === plan.id ? styles.planCardActive : ""}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            <span className={styles.planRadio} />
            <strong>{plan.title}</strong>
            <p>{plan.description}</p>
            <div>
              <span>R$</span>
              <b>{plan.price}</b>
            </div>
            <em>{plan.note}</em>
          </button>
        ))}
      </div>

      <div className={styles.faqBox}>
        <h2>Duvidas frequentes</h2>
        <details>
          <summary>Qual e a diferenca entre os planos?</summary>
          <p>O plano Para Sempre nao expira. O So Hoje libera o link por 24 horas.</p>
        </details>
        <details>
          <summary>Posso editar depois de pagar?</summary>
          <p>Sim. A cartinha continua aparecendo no dashboard como uma memoria editavel.</p>
        </details>
        <details>
          <summary>Como entrego o presente?</summary>
          <p>Depois da ativacao, o dashboard guarda a cartinha para compartilhar por link.</p>
        </details>
      </div>
    </div>
  );

  const renderCheckout = () => {
    const PaymentIcon = selectedPaymentOption.icon;

    return (
      <div className={styles.checkoutShell}>
        <section className={styles.checkoutSummary}>
          <span>{selectedPlanOption.productId === "memoria_eterna" ? "Memoria Eterna" : "Carta Secreta"}</span>
          <h2>{selectedPlanOption.title}</h2>
          <p>{selectedPlanOption.description}</p>
          <strong>R$ {selectedPlanOption.price}</strong>
        </section>

        <div className={styles.paymentGrid}>
          {paymentOptions.map((payment) => {
            const Icon = payment.icon;
            const isActive = paymentMethod === payment.id;

            return (
              <button
                key={payment.id}
                type="button"
                className={`${styles.paymentOption} ${isActive ? styles.paymentOptionActive : ""}`}
                onClick={() => setPaymentMethod(payment.id)}
              >
                <Icon size={20} />
                <strong>{payment.title}</strong>
                <span>{payment.description}</span>
              </button>
            );
          })}
        </div>

        <section className={styles.paymentPanel}>
          <PaymentIcon size={23} />
          <div>
            <strong>{selectedPaymentOption.title}</strong>
            <p>
              {paymentMethod === "pix"
                ? "PIX copia e cola sera gerado aqui quando o checkout real for ligado."
                : paymentMethod === "card"
                  ? "Campos de cartao entram aqui com o provedor de pagamento."
                  : "Saldo da conta sera validado antes de ativar a cartinha."}
            </p>
          </div>
        </section>
      </div>
    );
  };

  const renderMainContent = () => {
    if (step === "type") {
      return (
        <>
          <div className={styles.options}>
            {giftTypes.map((giftType) => {
              const Icon = giftType.icon;
              const isActive = selectedType === giftType.id;

              return (
                <button
                  key={giftType.id}
                  type="button"
                  className={`${styles.giftCard} ${isActive ? styles.giftCardActive : ""}`}
                  onClick={() => {
                    setSelectedType(giftType.id);
                    setSelectedPalette(giftType.id === "love" ? "rose" : "amber");
                    setSelectedThemeId(giftType.id === "love" ? "aurora" : "scrapbook");
                  }}
                >
                  {giftType.badge && <span className={styles.cardBadge}>{giftType.badge}</span>}
                  <span className={styles.cardIcon}>
                    <Icon size={24} fill={giftType.id === "love" ? "currentColor" : "none"} />
                  </span>
                  <span className={styles.cardText}>
                    <strong>{giftType.title}</strong>
                    <span>{giftType.description}</span>
                    <em>{giftType.tag}</em>
                  </span>
                </button>
              );
            })}
          </div>

          <div className={styles.divider}>
            <span>Ou homenageie diretamente:</span>
          </div>

          <div className={styles.recipientGrid}>
            {directRecipients.map((recipient) => {
              const Icon = recipient.icon;
              const isActive = selectedRecipient === recipient.label;

              return (
                <button
                  key={recipient.id}
                  type="button"
                  className={`${styles.recipientButton} ${isActive ? styles.recipientButtonActive : ""}`}
                  onClick={() => {
                    setSelectedRecipient(recipient.label);
                    setSelectedType("friend");
                    setSelectedPalette("amber");
                    setSelectedThemeId("scrapbook");
                  }}
                >
                  <span>
                    <Icon size={16} />
                  </span>
                  {recipient.label}
                </button>
              );
            })}
          </div>
        </>
      );
    }

    if (step === "details") {
      return (
        <div className={styles.detailsForm}>
          <label className={styles.bigInputWrap}>
            <span className={styles.bigInputIcon}>
              <Heart size={22} fill="currentColor" />
            </span>
            <input
              type="text"
              value={recipientName}
              onChange={(event) => setRecipientName(event.target.value)}
              placeholder={fieldPlaceholder}
              autoFocus
            />
          </label>

          <div className={styles.selectedPill}>
            <span />
            {selectedTypeLabel}
          </div>

          <label className={styles.signerField}>
            <span>Assinado por</span>
            <div>
              <User size={19} />
              <input
                type="text"
                value={signerName}
                onChange={(event) => setSignerName(event.target.value)}
                placeholder="Digite seu nome"
              />
            </div>
          </label>
        </div>
      );
    }

    if (step === "relationship") {
      return (
        <div className={styles.relationshipForm}>
          <label className={styles.fieldGroup}>
            <span>Dia em que voces comecaram o relacionamento</span>
            <div className={styles.dateTimeField}>
              <CalendarDays size={20} />
              <input
                type="date"
                value={relationshipDate}
                max={getTodayIso()}
                onChange={(event) => setRelationshipDate(event.target.value)}
              />
              <span className={styles.displayDate}>{formatDisplayDate(relationshipDate)}</span>
            </div>
          </label>

          <label className={styles.fieldGroup}>
            <span>Horario em que voces comecaram o relacionamento</span>
            <div className={styles.dateTimeField}>
              <Clock3 size={20} />
              <input
                type="time"
                value={relationshipStartTime}
                onChange={(event) => setRelationshipStartTime(event.target.value)}
              />
            </div>
          </label>

          <label className={styles.fieldGroup}>
            <span>Cidade dessa historia (opcional)</span>
            <div className={styles.dateTimeField}>
              <MapPin size={20} />
              <input
                type="text"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="Busque cidade, ex: Muriae, MG"
              />
            </div>
          </label>

          <div className={styles.nasaToggleCard}>
            <div className={styles.nasaToggleText}>
              <strong>Mostrar a foto da NASA desse dia?</strong>
              <span>
                Exibe a Astronomy Picture of the Day da NASA para a data escolhida, com a explicacao daquele dia.
              </span>
            </div>
            <button
              type="button"
              className={`${styles.toggle} ${showNasaApod ? styles.toggleActive : ""}`}
              onClick={() => setShowNasaApod((current) => !current)}
              aria-pressed={showNasaApod}
              aria-label="Mostrar foto da NASA"
            >
              <span />
            </button>
          </div>

          <div className={styles.durationCard}>
            <h2>Voces estao juntos ha</h2>
            <div className={styles.durationGrid}>
              <div>
                <strong>{relationshipDuration.years}</strong>
                <span>Anos</span>
              </div>
              <div>
                <strong>{relationshipDuration.months}</strong>
                <span>Meses</span>
              </div>
              <div>
                <strong>{relationshipDuration.days}</strong>
                <span>Dias</span>
              </div>
            </div>
            {showNasaApod && (
              <p>
                <ImageIcon size={15} />
                A cartinha buscara automaticamente a imagem da NASA de {formatDisplayDate(relationshipDate)}.
              </p>
            )}
          </div>
        </div>
      );
    }

    if (step === "builder") return renderBuilder();
    if (step === "plans") return renderPlans();
    return renderCheckout();
  };

  return (
    <main className={styles.screen}>
      <header className={styles.topbar}>
        {isEditing ? `Editando cartinha: ${originalMemory?.title || letterTitle}` : "Presente especial em poucos minutos"}
      </header>

      <section className={styles.content} aria-label="Criar cartinha">
        <div className={styles.progressRow}>
          <button type="button" className={styles.backIcon} onClick={handleBack} aria-label="Voltar">
            <ChevronLeft size={20} />
          </button>
          <div className={styles.progressTrack} aria-label={progressLabel}>
            <span className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className={styles.chatRow}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>
              <img src="/Afavicon.png?v=3" alt="Afetum" />
              <span className={styles.typingDots} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </div>
            <span>Afetum</span>
          </div>
          <div className={styles.bubble}>{guideMessage}</div>
        </div>

        {renderMainContent()}
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <button type="button" className={styles.secondaryButton} onClick={handleBack}>
            Voltar
          </button>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => saveMemory(isEditing ? originalMemory?.status || "draft" : "draft")}
          >
            {isEditing ? "Salvar" : "Rascunho"}
          </button>
          <button
            type="button"
            className={`${styles.primaryButton} ${continueDisabled ? styles.primaryButtonDisabled : ""}`}
            onClick={handleContinue}
            disabled={continueDisabled}
          >
            {continueLabel}
          </button>
        </div>
      </footer>
    </main>
  );
}
