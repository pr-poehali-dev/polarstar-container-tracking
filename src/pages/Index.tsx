import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Section, navItems } from "@/data/mockData";
import {
  Dashboard, ContainersSection, LocationsSection, TransportSection,
  RailwaySection, VesselsSection, EquipmentSection,
  UsersSection, ActivitySection, MapSection,
} from "@/components/logistics/Sections";
import DetailPanel, { DetailTarget } from "@/components/logistics/DetailPanel";

export default function Index() {
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [detail, setDetail] = useState<DetailTarget | null>(null);

  const handleSelect = (target: DetailTarget) => setDetail(target);
  const handleNavigate = (target: DetailTarget) => setDetail(target);
  const handleClose = () => setDetail(null);

  const sectionProps = { onSelect: handleSelect };

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":  return <Dashboard {...sectionProps} />;
      case "containers": return <ContainersSection {...sectionProps} />;
      case "locations":  return <LocationsSection {...sectionProps} />;
      case "transport":  return <TransportSection {...sectionProps} />;
      case "railway":    return <RailwaySection {...sectionProps} />;
      case "vessels":    return <VesselsSection {...sectionProps} />;
      case "equipment":  return <EquipmentSection {...sectionProps} />;
      case "map":        return <MapSection {...sectionProps} />;
      case "users":      return <UsersSection {...sectionProps} />;
      case "activity":   return <ActivitySection {...sectionProps} />;
      default:           return <Dashboard {...sectionProps} />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-ibm">
      {/* Detail Panel */}
      <DetailPanel target={detail} onClose={handleClose} onNavigate={handleNavigate} />

      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-56" : "w-14"} transition-all duration-200 flex-shrink-0 flex flex-col`}
        style={{ background: "hsl(220,28%,12%)" }}
      >
        <div className="flex items-center gap-2.5 px-4 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0 bg-accent">
            <Icon name="Star" size={14} className="text-white" />
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <div className="text-white text-sm font-semibold leading-tight truncate">Полярная звезда</div>
              <div className="text-[10px] leading-tight" style={{ color: "rgba(255,255,255,0.35)" }}>Логистика</div>
            </div>
          )}
        </div>

        <nav className="flex-1 py-2 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setDetail(null); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-all relative
                ${activeSection === item.id ? "text-white" : "hover:text-white/80"}`}
              style={{
                background: activeSection === item.id ? "rgba(255,255,255,0.1)" : "transparent",
                color: activeSection === item.id ? "white" : "rgba(255,255,255,0.45)",
              }}
            >
              <Icon name={item.icon as "Home"} size={15} className="flex-shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="text-xs font-medium flex-1 truncate">{item.label}</span>
                  {item.count !== undefined && (
                    <span
                      className="text-[10px] px-1.5 rounded-full font-mono-ibm"
                      style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }}
                    >
                      {item.count}
                    </span>
                  )}
                </>
              )}
              {activeSection === item.id && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r bg-accent" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-2 px-0.5 py-1 transition-colors"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            <Icon name={sidebarOpen ? "PanelLeftClose" : "PanelLeftOpen"} size={15} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-xs">Свернуть</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-border px-6 h-12 flex items-center justify-between flex-shrink-0">
          <div className="text-sm text-muted-foreground font-medium">
            {navItems.find(n => n.id === activeSection)?.label}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
              <Icon name="Bell" size={15} />
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent" />
            </Button>
            <div className="flex items-center gap-2 hover:bg-muted/50 px-2 py-1 rounded cursor-pointer transition-colors">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white text-[10px] font-semibold">АИ</span>
              </div>
              {sidebarOpen && (
                <div className="text-xs">
                  <div className="font-medium text-foreground">Александров И.</div>
                  <div className="text-muted-foreground text-[10px]">Администратор</div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {renderSection()}
        </div>
      </main>
    </div>
  );
}
