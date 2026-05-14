"use client";

import {
  clearMockUser,
  loadMockMemories,
  loadMockUser,
  saveMockMemories,
  saveMockUser,
  type MockMemory,
  type MockMemoryStatus,
  type MockUser,
} from "@/lib/mockSession";
import {
  ChevronLeft,
  FileEdit,
  FileHeart,
  Home,
  Layers,
  LogOut,
  Menu,
  Plus,
  Save,
  Search,
  Settings,
  Shield,
  Trash2,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import MemoryCardPreview from "@/components/MemoryCardPreview/MemoryCardPreview";
import { getCardTheme } from "@/lib/cardThemes";

type DashboardFilter = "all" | MockMemoryStatus;
type DashboardView = "cards" | "settings";

type PaletteStyle = {
  preview: string;
  title: string;
  overlay: string;
};

const filters: Array<{ id: DashboardFilter; label: string; icon: typeof Layers }> = [
  { id: "all", label: "Tudo", icon: Layers },
  { id: "draft", label: "Rascunhos", icon: FileEdit },
  { id: "paid", label: "Ativos", icon: Zap },
];

const paletteClasses: Record<MockMemory["palette"], PaletteStyle> = {
  night: {
    preview: "bg-[linear-gradient(135deg,#020617_0%,#1E1B4B_100%)]",
    title: "text-white",
    overlay: "bg-black/10",
  },
  sage: {
    preview: "bg-[#E5ECE5]",
    title: "text-[#3E5246]",
    overlay: "bg-white/20",
  },
  rose: {
    preview: "bg-[linear-gradient(135deg,#6C201E_0%,#C65C78_100%)]",
    title: "text-white",
    overlay: "bg-black/5",
  },
  amber: {
    preview: "bg-[linear-gradient(135deg,#7C3F14_0%,#E4B363_100%)]",
    title: "text-white",
    overlay: "bg-black/5",
  },
  teal: {
    preview: "bg-[linear-gradient(135deg,#104C45_0%,#60B6A8_100%)]",
    title: "text-white",
    overlay: "bg-black/5",
  },
  indigo: {
    preview: "bg-[linear-gradient(135deg,#26315F_0%,#8490D8_100%)]",
    title: "text-white",
    overlay: "bg-black/5",
  },
};

const statusLabel: Record<MockMemoryStatus, string> = {
  draft: "Rascunho",
  paid: "Ativo",
};

const statusBadgeClass: Record<MockMemoryStatus, string> = {
  draft: "bg-white/95 text-amber-700 border-amber-200",
  paid: "bg-white/95 text-emerald-700 border-emerald-200",
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "A";

const createDraftMemory = (index: number): MockMemory => {
  const palettes: MockMemory["palette"][] = ["rose", "amber", "teal", "indigo"];
  return {
    id: `mem-${Date.now()}`,
    title: "Nova memoria",
    recipientName: "Destinatario",
    recipientType: "Personalizada",
    message: "Rascunho criado no dashboard mockado.",
    status: "draft",
    views: 0,
    createdAt: new Date().toISOString(),
    palette: palettes[index % palettes.length],
  };
};

function SidebarButton({
  active,
  collapsed,
  icon: Icon,
  label,
  count,
  onClick,
}: {
  active?: boolean;
  collapsed: boolean;
  icon: typeof Layers;
  label: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`w-full flex items-center ${
        collapsed ? "w-12 h-12 justify-center p-0 mx-auto" : "justify-between gap-4 px-5 py-4"
      } rounded-xl text-sm font-bold transition-all ${
        active
          ? "bg-[#FDFBF9] text-[#6C201E] border border-[#E0BDA2] shadow-sm"
          : "text-[#9C8276] hover:bg-gray-50"
      }`}
    >
      {collapsed ? (
        <div className="relative flex items-center justify-center w-6 h-6">
          <Icon className="w-6 h-6" />
          {typeof count === "number" && (
            <span
              className={`absolute -top-2 -right-3 min-w-4 h-4 px-1 rounded-full text-[9px] flex items-center justify-center border border-white/50 shadow-sm ${
                active ? "bg-[#6C201E] text-white" : "bg-[#ECD5C3] text-[#240C05]"
              }`}
            >
              {count}
            </span>
          )}
        </div>
      ) : (
        <>
          <span>{label}</span>
          {typeof count === "number" && (
            <span
              className={`min-w-6 h-6 px-2 rounded-full text-[10px] flex items-center justify-center ${
                active ? "bg-[#6C201E] text-white" : "bg-[#ECD5C3] text-[#240C05]"
              }`}
            >
              {count}
            </span>
          )}
        </>
      )}
    </button>
  );
}

export default function ServiceDashboard() {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [user, setUser] = useState<MockUser | null>(null);
  const [memories, setMemories] = useState<MockMemory[]>([]);
  const [activeView, setActiveView] = useState<DashboardView>("cards");
  const [activeFilter, setActiveFilter] = useState<DashboardFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [previewMemory, setPreviewMemory] = useState<MockMemory | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [profileName, setProfileName] = useState("");
  const [profileNickname, setProfileNickname] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [partnerNickname, setPartnerNickname] = useState("");
  const [profileFeedback, setProfileFeedback] = useState("");

  useEffect(() => {
    const currentUser = loadMockUser();
    if (!currentUser) {
      router.replace("/login?redirect=/dashboard");
      return;
    }

    const currentMemories = loadMockMemories();
    setUser(currentUser);
    setMemories(currentMemories);
    setProfileName(currentUser.displayName || "");
    setProfileNickname(currentUser.nickname || "");
    setPartnerName(currentUser.partnerName || "");
    setPartnerNickname(currentUser.partnerNickname || "");
    setIsCheckingSession(false);
  }, [router]);

  useEffect(() => {
    if (memories.length > 0) {
      saveMockMemories(memories);
    }
  }, [memories]);

  useEffect(() => {
    const shouldLockScroll = isMobileMenuOpen || Boolean(previewMemory) || Boolean(deleteId);
    if (!shouldLockScroll) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [deleteId, isMobileMenuOpen, previewMemory]);

  const counts = useMemo(() => {
    return memories.reduce(
      (acc, memory) => {
        acc[memory.status] += 1;
        return acc;
      },
      { draft: 0, paid: 0 } as Record<MockMemoryStatus, number>,
    );
  }, [memories]);

  const stats = useMemo(
    () => ({
      total: memories.length,
      views: memories.reduce((sum, memory) => sum + memory.views, 0),
      paid: counts.paid,
      drafts: counts.draft,
    }),
    [counts, memories],
  );

  const filteredMemories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return memories.filter((memory) => {
      const matchesFilter = activeFilter === "all" || memory.status === activeFilter;
      const matchesSearch =
        !query ||
        memory.title.toLowerCase().includes(query) ||
        memory.recipientName.toLowerCase().includes(query) ||
        memory.recipientType.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, memories, searchQuery]);

  const firstName = user?.nickname?.trim() || user?.displayName.split(" ")[0] || "Cliente";
  const walletCredits = Math.max(0, Math.floor(Number(user?.walletCredits || 0)));
  const canAccessAdmin = user?.isAdmin ?? true;
  const hasActiveFilters = activeFilter !== "all" || searchQuery.trim().length > 0;

  const handleLogout = () => {
    clearMockUser();
    router.replace("/login");
  };

  const handleCreateMemory = () => {
    router.push("/create");
  };

  const handleEditMemory = (memory: MockMemory) => {
    router.push(`/create?memoryId=${encodeURIComponent(memory.id)}`);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setMemories((current) => current.filter((memory) => memory.id !== deleteId));
    setDeleteId(null);
  };

  const handleSaveProfile = () => {
    if (!user) return;
    const updatedUser: MockUser = {
      ...user,
      displayName: profileName.trim() || user.displayName,
      nickname: profileNickname.trim(),
      partnerName: partnerName.trim(),
      partnerNickname: partnerNickname.trim(),
    };

    setUser(updatedUser);
    saveMockUser(updatedUser);
    setProfileFeedback("Perfil atualizado com sucesso.");
    window.setTimeout(() => setProfileFeedback(""), 2200);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setActiveFilter("all");
  };

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F9F7F5]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E0BDA2] border-t-[#6C201E]" />
      </main>
    );
  }

  if (!user) return null;

  const sidebar = (
    <aside
      className={`fixed inset-y-0 left-0 z-50 ${isSidebarCollapsed ? "md:w-20" : "md:w-80"} w-80 bg-white border-r border-[#E0BDA2]/30 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      } md:static md:translate-x-0`}
    >
      <div className="p-4 border-b border-[#E0BDA2]/20 flex items-center justify-between">
        {!isSidebarCollapsed && (
          <button
            type="button"
            className="w-32 cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
            onClick={() => router.push("/")}
          >
            <img src="/logotipo.svg" className="w-full h-auto" alt="Afetum" />
          </button>
        )}
        <button
          type="button"
          onClick={() => setIsSidebarCollapsed((current) => !current)}
          className={`${isSidebarCollapsed ? "mx-auto" : ""} hidden md:flex w-8 h-8 rounded-lg border border-[#E0BDA2]/40 items-center justify-center text-[#9C8276] hover:text-[#6C201E] hover:border-[#6C201E] transition-all`}
          title={isSidebarCollapsed ? "Expandir menu" : "Recolher menu"}
          aria-label={isSidebarCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${isSidebarCollapsed ? "rotate-180" : ""}`} />
        </button>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden w-8 h-8 rounded-lg border border-[#E0BDA2]/40 flex items-center justify-center text-[#9C8276]"
          aria-label="Fechar menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className={`flex-1 ${isSidebarCollapsed ? "p-4" : "p-6"} space-y-2 overflow-y-auto`}>
        {canAccessAdmin && (
          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(false);
            }}
            className={`w-full mb-6 flex items-center ${
              isSidebarCollapsed ? "w-12 h-12 justify-center p-0 mx-auto" : "justify-between gap-3 px-6 py-5"
            } rounded-2xl bg-gradient-to-r from-[#6C201E] to-[#501A15] shadow-xl text-white group transition-all hover:scale-[1.02]`}
            title={isSidebarCollapsed ? "Painel Admin" : undefined}
          >
            <Shield className={isSidebarCollapsed ? "w-6 h-6" : "w-5 h-5 hidden"} />
            {!isSidebarCollapsed && <span className="font-bold text-xs uppercase tracking-widest">Painel Admin</span>}
            {!isSidebarCollapsed && (
              <span className="text-xs font-bold opacity-80 group-hover:translate-x-0.5 transition-transform">
                Abrir
              </span>
            )}
          </button>
        )}

        {!isSidebarCollapsed && (
          <div className="px-4 py-2 text-[10px] font-bold text-[#9C8276] uppercase tracking-widest mb-1 mt-2">
            Dashboard
          </div>
        )}

        <SidebarButton
          active={activeView === "cards"}
          collapsed={isSidebarCollapsed}
          icon={FileHeart}
          label="Minhas Memorias"
          onClick={() => {
            setActiveView("cards");
            setIsMobileMenuOpen(false);
          }}
        />
        <SidebarButton
          active={activeView === "settings"}
          collapsed={isSidebarCollapsed}
          icon={Settings}
          label="Configuracoes"
          onClick={() => {
            setActiveView("settings");
            setIsMobileMenuOpen(false);
          }}
        />

        {!isSidebarCollapsed && (
          <div className="px-4 py-2 text-[10px] font-bold text-[#9C8276] uppercase tracking-widest mb-1 mt-2">
            Filtros
          </div>
        )}

        {filters.map((filter) => {
          const count = filter.id === "all" ? stats.total : counts[filter.id];
          return (
            <SidebarButton
              key={filter.id}
              active={activeFilter === filter.id}
              collapsed={isSidebarCollapsed}
              icon={filter.icon}
              label={filter.label}
              count={count}
              onClick={() => {
                setActiveView("cards");
                setActiveFilter(filter.id);
                setIsMobileMenuOpen(false);
              }}
            />
          );
        })}

        <button
          type="button"
          onClick={handleCreateMemory}
          className={`w-full mt-3 ${
            isSidebarCollapsed ? "w-12 h-12 justify-center items-center p-0 mx-auto flex" : "px-5 py-4"
          } rounded-xl text-sm font-bold text-white bg-[#240C05] hover:bg-[#6C201E] transition-colors`}
          title={isSidebarCollapsed ? "Criar Nova Memoria" : undefined}
        >
          {isSidebarCollapsed ? <Plus className="w-6 h-6" /> : "Criar Nova Memoria"}
        </button>

        {!isSidebarCollapsed && (
          <button
            type="button"
            className="w-full mt-2 px-5 py-3 rounded-xl text-xs font-bold border border-[#E0BDA2] text-[#240C05] hover:bg-[#ECD5C3] transition-colors uppercase tracking-widest"
          >
            Adicionar Saldo ({walletCredits})
          </button>
        )}

        <button
          type="button"
          onClick={() => router.push("/")}
          className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-[#9C8276] hover:bg-gray-50 transition-all mt-4 ${
            isSidebarCollapsed ? "px-0" : ""
          }`}
          title={isSidebarCollapsed ? "Voltar ao Site" : undefined}
        >
          {isSidebarCollapsed ? <Home className="w-6 h-6" /> : "Voltar ao Site"}
        </button>
      </nav>

      <div
        className={`${
          isSidebarCollapsed ? "p-4" : "p-6"
        } border-t border-[#E0BDA2]/20 bg-[#FDFBF9] transition-all duration-300`}
      >
        <div className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-4"} mb-4`}>
          <div
            className={`${isSidebarCollapsed ? "w-10 h-10 text-sm" : "w-12 h-12 text-lg"} rounded-full object-cover bg-[#6C201E] text-white flex items-center justify-center font-bold shadow-md overflow-hidden border-2 border-white`}
          >
            {getInitials(user.displayName)}
          </div>
          {!isSidebarCollapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-[#240C05] truncate">{user.displayName}</p>
              <p className="text-[10px] text-[#9C8276] truncate">{user.email}</p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className={`w-full border border-red-200 rounded-xl text-xs font-bold text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors flex ${
            isSidebarCollapsed ? "w-12 h-12 justify-center items-center p-0 mx-auto py-0" : "py-2.5 justify-center uppercase tracking-widest"
          }`}
          title={isSidebarCollapsed ? "Sair da Conta" : undefined}
        >
          {isSidebarCollapsed ? <LogOut className="w-5 h-5" /> : "Sair da Conta"}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#F9F7F5] flex font-sans text-[#240C05] overflow-x-hidden">
      {isMobileMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[#240C05]/40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Fechar menu"
        />
      )}
      {sidebar}

      <main className="flex-1 flex flex-col h-auto md:h-screen overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 pb-24 sm:pb-32">
        <div className="md:hidden flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="w-11 h-11 rounded-xl bg-white border border-[#E0BDA2]/40 flex items-center justify-center text-[#240C05]"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <img src="/logotipo.svg" className="h-10 w-auto" alt="Afetum" />
          <button
            type="button"
            onClick={handleLogout}
            className="w-11 h-11 rounded-xl bg-white border border-red-100 flex items-center justify-center text-red-500"
            aria-label="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <div className="max-w-6xl mx-auto">
          {activeView === "settings" ? (
            <section>
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-[#240C05] mb-2">Configuracoes</h1>
                <p className="text-[#9C8276] font-medium">Atualize os dados do perfil mockado.</p>
              </div>

              <div className="bg-white rounded-[2rem] border border-[#E0BDA2]/30 p-5 sm:p-7 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 bg-[#FDFBF9] border border-[#E0BDA2]/40 rounded-2xl p-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#9C8276] mb-3">
                      Perfil
                    </p>
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-28 h-28 rounded-full bg-[#6C201E] text-white flex items-center justify-center font-bold text-3xl border-4 border-white shadow-lg">
                        {getInitials(profileName || user.displayName)}
                      </div>
                      <p className="text-sm font-bold text-[#240C05]">{user.email}</p>
                    </div>
                  </div>

                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="md:col-span-2">
                      <span className="block text-[11px] font-bold uppercase tracking-widest text-[#9C8276] mb-2">
                        Nome Completo
                      </span>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(event) => setProfileName(event.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#E0BDA2]/60 focus:outline-none focus:ring-4 focus:ring-[#6C201E]/10 focus:border-[#6C201E]"
                        placeholder="Seu nome completo"
                      />
                    </label>

                    <label>
                      <span className="block text-[11px] font-bold uppercase tracking-widest text-[#9C8276] mb-2">
                        Seu Apelido
                      </span>
                      <input
                        type="text"
                        value={profileNickname}
                        onChange={(event) => setProfileNickname(event.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#E0BDA2]/60 focus:outline-none focus:ring-4 focus:ring-[#6C201E]/10 focus:border-[#6C201E]"
                        placeholder="Ex.: Ju"
                      />
                    </label>

                    <label>
                      <span className="block text-[11px] font-bold uppercase tracking-widest text-[#9C8276] mb-2">
                        Nome da Pessoa
                      </span>
                      <input
                        type="text"
                        value={partnerName}
                        onChange={(event) => setPartnerName(event.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#E0BDA2]/60 focus:outline-none focus:ring-4 focus:ring-[#6C201E]/10 focus:border-[#6C201E]"
                        placeholder="Ex.: Maria"
                      />
                    </label>

                    <label>
                      <span className="block text-[11px] font-bold uppercase tracking-widest text-[#9C8276] mb-2">
                        Apelido da Pessoa
                      </span>
                      <input
                        type="text"
                        value={partnerNickname}
                        onChange={(event) => setPartnerNickname(event.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#E0BDA2]/60 focus:outline-none focus:ring-4 focus:ring-[#6C201E]/10 focus:border-[#6C201E]"
                        placeholder="Ex.: Ma"
                      />
                    </label>

                    <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 sm:items-center pt-2">
                      <button
                        type="button"
                        onClick={handleSaveProfile}
                        className="px-5 py-3 bg-[#240C05] text-white rounded-xl text-sm font-bold hover:bg-[#6C201E] transition-colors flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Salvar Alteracoes
                      </button>
                      {profileFeedback && (
                        <span className="text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                          {profileFeedback}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
                <div className="animate-fade-in-up">
                  <h1 className="text-3xl md:text-4xl font-bold text-[#240C05] mb-2">Ola, {firstName}</h1>
                  <p className="text-[#9C8276] font-medium">Aqui estao suas memorias criadas.</p>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#6C201E] mt-2">
                    Saldo disponivel: {walletCredits} cartinha(s)
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-3">
                  <button
                    type="button"
                    className="border border-[#E0BDA2] text-[#240C05] px-6 py-4 rounded-2xl font-bold text-sm hover:bg-[#ECD5C3] transition-colors"
                  >
                    Adicionar Saldo
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateMemory}
                    className="bg-[#240C05] text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl hover:bg-[#6C201E] hover:shadow-2xl transition-all"
                  >
                    Criar Nova Memoria
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                <div className="bg-white p-5 sm:p-6 rounded-[1.5rem] shadow-sm border border-[#E0BDA2]/30 flex flex-col">
                  <span className="text-3xl sm:text-4xl font-bold text-[#240C05] mb-1">{stats.total}</span>
                  <span className="text-[10px] text-[#9C8276] uppercase font-bold tracking-widest">Memorias</span>
                </div>
                <div className="bg-white p-5 sm:p-6 rounded-[1.5rem] shadow-sm border border-[#E0BDA2]/30 flex flex-col">
                  <span className="text-3xl sm:text-4xl font-bold text-[#240C05] mb-1">{stats.views}</span>
                  <span className="text-[10px] text-[#9C8276] uppercase font-bold tracking-widest">Visualizacoes</span>
                </div>
                <div className="bg-white p-5 sm:p-6 rounded-[1.5rem] shadow-sm border border-[#E0BDA2]/30 flex flex-col col-span-2 lg:col-span-1">
                  <span className="text-3xl sm:text-4xl font-bold text-[#240C05] mb-1">{stats.paid}</span>
                  <span className="text-[10px] text-[#9C8276] uppercase font-bold tracking-widest">Cards Ativos</span>
                </div>
              </div>

              <div className="mb-8 animate-fade-in-up bg-white/80 border border-[#E0BDA2]/30 rounded-[1.75rem] p-4 sm:p-5" style={{ animationDelay: "0.2s" }}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar por nome ou titulo..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="w-full pl-4 pr-20 py-3 sm:py-4 rounded-2xl border border-[#E0BDA2]/40 bg-white focus:outline-none focus:border-[#6C201E] focus:ring-4 focus:ring-[#6C201E]/10 shadow-sm transition-all text-[#240C05] font-medium placeholder-[#9C8276]/50"
                  />
                  {searchQuery.trim().length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest text-[#9C8276] hover:bg-[#ECD5C3]"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar mt-4 pb-1">
                  {filters.map((filter) => {
                    const isActive = activeFilter === filter.id;
                    const count = filter.id === "all" ? stats.total : counts[filter.id];
                    return (
                      <button
                        type="button"
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={`shrink-0 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest transition-colors ${
                          isActive
                            ? "bg-[#240C05] text-white border-[#240C05]"
                            : "bg-white text-[#9C8276] border-[#E0BDA2]/50 hover:text-[#240C05]"
                        }`}
                      >
                        {filter.label} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {filteredMemories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 animate-fade-in-up">
                  {filteredMemories.map((memory) => {
                    const palette = paletteClasses[memory.palette] || paletteClasses.rose;
                    const cardTheme = memory.themeId ? getCardTheme(memory.themeId) : null;
                    return (
                      <article
                        key={memory.id}
                        className="group bg-white rounded-[1.5rem] overflow-hidden shadow-sm border border-[#E0BDA2]/40 hover:shadow-xl hover:-translate-y-1.5 hover:border-[#6C201E]/30 transition-all duration-500 flex flex-col"
                      >
                        <div
                          className={`h-44 ${cardTheme ? "" : palette.preview} relative p-5 flex flex-col justify-between overflow-hidden`}
                          style={cardTheme ? { background: cardTheme.preview } : undefined}
                        >
                          <div className={`absolute inset-0 ${palette.overlay} group-hover:scale-110 transition-transform duration-700`} />
                          <div className="relative z-10 flex items-start justify-between gap-2">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase tracking-wider max-w-[68%] truncate">
                              {cardTheme?.name || memory.recipientType}
                            </span>
                            <span
                              className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${statusBadgeClass[memory.status]}`}
                            >
                              {statusLabel[memory.status]}
                            </span>
                          </div>
                          <h3
                            className={`relative z-10 text-2xl font-bold leading-tight ${cardTheme ? "" : palette.title} line-clamp-2`}
                            style={cardTheme ? { color: cardTheme.text } : undefined}
                          >
                            {memory.title}
                          </h3>
                        </div>

                        <div className="p-5 flex-1 flex flex-col gap-5">
                          <div className="flex justify-between items-end text-sm gap-3">
                            <div className="min-w-0">
                              <p className="text-[10px] text-[#9C8276] font-bold uppercase tracking-wider mb-1">Para</p>
                              <p className="font-bold text-[#240C05] text-lg truncate">{memory.recipientName}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-[10px] text-[#9C8276] font-bold uppercase tracking-wider mb-1">
                                Criado em
                              </p>
                              <p className="font-bold text-[#240C05]">{formatDate(memory.createdAt)}</p>
                            </div>
                          </div>

                          <p className="text-[11px] text-[#9C8276] font-semibold uppercase tracking-widest">
                            {memory.views} visualizacoes
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {memory.productId && (
                              <span className="rounded-full border border-[#E0BDA2]/70 bg-[#FDFBF9] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#6C201E]">
                                {memory.productId === "memoria_eterna" ? "Vitalicio" : "24h"}
                              </span>
                            )}
                            {memory.showNasaApod && (
                              <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-700">
                                NASA
                              </span>
                            )}
                            {Boolean(memory.images?.length) && (
                              <span className="rounded-full border border-[#E0BDA2]/70 bg-[#FDFBF9] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#9C8276]">
                                {memory.images?.length} foto(s)
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2 mt-auto">
                            <button
                              type="button"
                              onClick={() => setPreviewMemory(memory)}
                              className="col-span-2 py-3 bg-[#240C05] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#6C201E] transition-colors shadow-lg shadow-[#240C05]/10"
                            >
                              Visualizar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEditMemory(memory)}
                              className="py-3 border border-[#E0BDA2] rounded-xl text-[#240C05] text-xs font-bold uppercase tracking-widest hover:bg-[#ECD5C3] transition-colors"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteId(memory.id)}
                              className="py-3 border border-red-100 text-red-500 bg-red-50 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-colors"
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-14 sm:py-20 px-6 bg-white/70 border border-[#E0BDA2]/30 rounded-[1.75rem]">
                  <p className="text-[#240C05] font-bold text-xl mb-2">Nenhuma memoria encontrada.</p>
                  <p className="text-sm text-[#9C8276]">Ajuste os filtros ou crie uma nova memoria para comecar.</p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="px-5 py-3 border border-[#E0BDA2] rounded-xl text-sm font-bold text-[#240C05] hover:bg-[#ECD5C3] transition-colors"
                      >
                        Limpar Filtros
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleCreateMemory}
                      className="px-5 py-3 bg-[#240C05] text-white rounded-xl text-sm font-bold hover:bg-[#6C201E] transition-colors"
                    >
                      Criar Nova Memoria
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
        </div>
      </main>

      {previewMemory && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-in fade-in">
          <div className="w-full h-full max-w-[460px] sm:max-h-[92dvh] relative overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl ring-4 sm:ring-8 ring-white/10 bg-white">
            <button
              type="button"
              onClick={() => setPreviewMemory(null)}
              className="absolute top-3 right-3 z-[110] px-3 py-2 bg-black/35 hover:bg-black/55 rounded-xl text-white text-xs font-bold uppercase tracking-widest transition-all backdrop-blur-md"
            >
              Fechar
            </button>
            <div className="absolute inset-0 overflow-y-auto no-scrollbar" data-lenis-prevent>
              <MemoryCardPreview memory={previewMemory} />
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#240C05]/40 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center border border-[#E0BDA2] animate-in zoom-in-95">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 shadow-inner">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#240C05] mb-2">Excluir Memoria?</h3>
            <p className="text-sm text-[#9C8276] mb-8 leading-relaxed">
              A memoria sera removida apenas dos dados mockados deste navegador.
            </p>
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 py-3 border border-[#E0BDA2] rounded-xl font-bold text-[#240C05] hover:bg-[#ECD5C3] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
