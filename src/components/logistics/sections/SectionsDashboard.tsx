import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge, StatCard, SectionHeader } from "@/components/logistics/Shared";
import { DetailTarget } from "@/components/logistics/DetailPanel";
import { AddContainerDialog } from "@/components/logistics/Dialogs";
import {
  mockContainers, mockLocations, mockVessels, mockEquipment, mockActivity,
  statusConfig, ContainerStatus,
} from "@/data/mockData";

interface SectionProps {
  onSelect: (target: DetailTarget) => void;
}

export function Dashboard({ onSelect }: SectionProps) {
  const statusCounts = mockContainers.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Дашборд</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Общая сводка · 21 февраля 2026</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Контейнеров" value={122} icon="Package" sub="В системе" accent="bg-primary" />
        <StatCard label="На маршрутах" value={38} icon="Navigation" sub="Авто, ЖД, море" accent="bg-accent" />
        <StatCard label="Оборудования" value={24} icon="Zap" sub="Дженсеты и ИП" />
        <StatCard label="Судов в пути" value={2} icon="Ship" sub="Активные рейсы" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-lg border border-border p-5">
          <h3 className="text-sm font-medium text-foreground mb-4">Статусы контейнеров</h3>
          <div className="space-y-3">
            {(Object.entries(statusConfig) as [ContainerStatus, typeof statusConfig[ContainerStatus]][]).map(([key, cfg]) => {
              const count = statusCounts[key] || 0;
              const pct = Math.round((count / mockContainers.length) * 100);
              return (
                <div key={key} className="flex items-center gap-3">
                  <div className="w-32 text-xs text-muted-foreground shrink-0">{cfg.label}</div>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="w-5 text-xs text-foreground font-medium text-right">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-border p-5">
          <h3 className="text-sm font-medium text-foreground mb-4">Последние события</h3>
          <div className="space-y-3">
            {mockActivity.slice(0, 4).map(a => (
              <div key={a.id} className="text-xs">
                <div className="text-foreground font-medium leading-tight">{a.action}</div>
                <div className="text-muted-foreground truncate">{a.object}</div>
                <div className="text-muted-foreground/50 mt-0.5">{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-border p-5">
          <h3 className="text-sm font-medium text-foreground mb-3">Локации</h3>
          <div className="space-y-1">
            {mockLocations.map(loc => (
              <div
                key={loc.id}
                onClick={() => onSelect({ type: "location", id: loc.id })}
                className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <span className="text-xs text-foreground">{loc.name}</span>
                <span className="text-xs text-muted-foreground font-mono-ibm">{loc.containers} конт.</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-border p-5">
          <h3 className="text-sm font-medium text-foreground mb-3">Суда в пути</h3>
          <div className="space-y-2">
            {mockVessels.filter(v => v.status === "В пути").map(v => (
              <div
                key={v.id}
                onClick={() => onSelect({ type: "vessel", id: v.id })}
                className="text-xs px-2 py-1.5 rounded hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="font-medium text-foreground">«{v.name}»</div>
                <div className="text-muted-foreground">{v.portFrom} → {v.portTo}</div>
                <div className="text-muted-foreground/50">Прибытие: {v.arrival.split(" ")[0]}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-border p-5">
          <h3 className="text-sm font-medium text-foreground mb-3">Оборудование</h3>
          <div className="space-y-1">
            {mockEquipment.map(eq => (
              <div
                key={eq.id}
                onClick={() => onSelect({ type: "equipment", id: eq.id })}
                className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <span className="text-xs font-mono-ibm text-foreground">{eq.identifier}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${eq.status === "Неисправен" ? "bg-red-50 text-red-700" : eq.status === "Техобслуживание" ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}>{eq.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContainersSection({ onSelect }: SectionProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialog, setDialog] = useState(false);

  const filtered = mockContainers.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = c.number.toLowerCase().includes(q) || c.client.toLowerCase().includes(q) || c.location.toLowerCase().includes(q);
    return matchSearch && (filterStatus === "all" || c.status === filterStatus);
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <AddContainerDialog open={dialog} onClose={() => setDialog(false)} />
      <SectionHeader title="Контейнеры" action="Добавить контейнер" onAction={() => setDialog(true)} />
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Номер, клиент, локация..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9 text-sm" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-44 h-9 text-sm"><SelectValue placeholder="Статус" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            {Object.entries(statusConfig).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {["Номер", "Тип / Объём", "Статус", "Клиент", "Темп.", "Локация", "Проверка", ""].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr
                key={c.id}
                onClick={() => onSelect({ type: "container", id: c.id })}
                className={`border-b border-border last:border-0 hover:bg-primary/5 transition-colors cursor-pointer ${i % 2 ? "bg-muted/10" : ""}`}
              >
                <td className="px-4 py-3 font-mono-ibm text-xs font-medium text-foreground">{c.number}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{c.type} · {c.volume}м³</td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{c.client}</td>
                <td className="px-4 py-3 text-xs font-mono-ibm text-foreground">{c.temp}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground max-w-[140px] truncate">{c.location}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{c.lastCheck}</td>
                <td className="px-4 py-3">
                  <Icon name="ChevronRight" size={14} className="text-muted-foreground/40" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-10 text-sm text-muted-foreground">Контейнеры не найдены</div>}
      </div>
      <div className="text-xs text-muted-foreground">Показано {filtered.length} из {mockContainers.length}</div>
    </div>
  );
}
