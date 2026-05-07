export type MockUser = {
  uid: string;
  email: string;
  displayName: string;
  isAdmin?: boolean;
  username?: string;
  nickname?: string;
  partnerName?: string;
  partnerNickname?: string;
  photoURL?: string;
  walletCredits: number;
};

export type MockMemoryStatus = "draft" | "paid";

export type MockMemory = {
  id: string;
  title: string;
  recipientName: string;
  recipientType: string;
  message: string;
  status: MockMemoryStatus;
  views: number;
  createdAt: string;
  palette: "night" | "sage" | "rose" | "amber" | "teal" | "indigo";
};

const SESSION_KEY = "afetum2:mock-session";
const MEMORIES_KEY = "afetum2:mock-memories";

const canUseStorage = () => typeof window !== "undefined" && Boolean(window.localStorage);

export const demoUser: MockUser = {
  uid: "mock-user-demo",
  email: "demo@afetum.com",
  displayName: "Cliente Afetum",
  isAdmin: true,
  username: "clienteafetum",
  nickname: "Cliente",
  partnerName: "Maria",
  partnerNickname: "Ma",
  walletCredits: 2,
};

export const demoMemories: MockMemory[] = [
  {
    id: "mem-001",
    title: "Nosso primeiro encontro",
    recipientName: "Maria",
    recipientType: "Namoro",
    message: "Uma pagina afetiva com fotos, musica e uma mensagem guardada para sempre.",
    status: "paid",
    views: 284,
    createdAt: "2026-04-14T12:00:00.000Z",
    palette: "rose",
  },
  {
    id: "mem-002",
    title: "Carta para o Dia das Maes",
    recipientName: "Ana",
    recipientType: "Mae",
    message: "Um rascunho com linha do tempo, dedicacao e galeria de fotos.",
    status: "draft",
    views: 18,
    createdAt: "2026-04-28T12:00:00.000Z",
    palette: "amber",
  },
  {
    id: "mem-003",
    title: "Amizade de anos",
    recipientName: "Lucas",
    recipientType: "Amizade",
    message: "Memorias compartilhadas, lugares marcantes e momentos favoritos.",
    status: "paid",
    views: 96,
    createdAt: "2026-05-02T12:00:00.000Z",
    palette: "teal",
  },
];

const readJson = <T>(key: string): T | null => {
  if (!canUseStorage()) return null;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const writeJson = <T>(key: string, value: T) => {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const loadMockUser = () => readJson<MockUser>(SESSION_KEY);

export const saveMockUser = (user: MockUser) => writeJson(SESSION_KEY, user);

export const clearMockUser = () => {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(SESSION_KEY);
};

export const loadMockMemories = () => readJson<MockMemory[]>(MEMORIES_KEY) || demoMemories;

export const saveMockMemories = (memories: MockMemory[]) => writeJson(MEMORIES_KEY, memories);
