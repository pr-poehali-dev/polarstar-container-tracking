import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge, StatCard, SectionHeader } from "@/components/logistics/Shared";
import {
  AddContainerDialog, AddLocationDialog, AddTransportDialog,
  AddRailwayDialog, AddVesselDialog, AddEquipmentDialog, AddUserDialog,
} from "@/components/logistics/Dialogs";
import {
  mockContainers, mockLocations, mockTransport, mockVessels,
  mockEquipment, mockUsers, mockActivity, wagons,
  statusConfig, locTypeConfig, ContainerStatus,
} from "@/data/mockData";

export function Dashboard() {
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
          <div className="space-y-2">
            {mockLocations.map(loc => (
              <div key={loc.id} className="flex items-center justify-between">
                <span className="text-xs text-foreground">{loc.name}</span>
                <span className="text-xs text-muted-foreground font-mono-ibm">{loc.containers} конт.</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-border p-5">
          <h3 className="text-sm font-medium text-foreground mb-3">Суда в пути</h3>
          <div className="space-y-3">
            {mockVessels.filter(v => v.status === "В пути").map(v => (
              <div key={v.id} className="text-xs">
                <div className="font-medium text-foreground">«{v.name}»</div>
                <div className="text-muted-foreground">{v.portFrom} → {v.portTo}</div>
                <div className="text-muted-foreground/50">Прибытие: {v.arrival.split(" ")[0]}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-border p-5">
          <h3 className="text-sm font-medium text-foreground mb-3">Оборудование</h3>
          <div className="space-y-2">
            {mockEquipment.map(eq => (
              <div key={eq.id} className="flex items-center justify-between">
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

export function ContainersSection() {
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
          <SelectTrigger className="w-44 h-9 text-sm">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
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
              <tr key={c.id} className={`border-b border-border last:border-0 hover:bg-muted/20 transition-colors ${i % 2 ? "bg-muted/10" : ""}`}>
                <td className="px-4 py-3 font-mono-ibm text-xs font-medium text-foreground">{c.number}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{c.type} · {c.volume}м³</td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{c.client}</td>
                <td className="px-4 py-3 text-xs font-mono-ibm text-foreground">{c.temp}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground max-w-[140px] truncate">{c.location}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{c.lastCheck}</td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Icon name="MoreHorizontal" size={14} /></Button>
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

export function LocationsSection() {
  const [dialog, setDialog] = useState(false);
  return (
    <div className="space-y-5 animate-fade-in">
      <AddLocationDialog open={dialog} onClose={() => setDialog(false)} />
      <SectionHeader title="Локации" action="Добавить локацию" onAction={() => setDialog(true)} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockLocations.map(loc => {
          const cfg = locTypeConfig[loc.type];
          return (
            <div key={loc.id} className="bg-white rounded-lg border border-border p-5 hover:border-primary/40 transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name={cfg.icon as "Anchor"} size={13} className="text-primary" />
                    <span className="text-xs text-muted-foreground">{cfg.label}</span>
                  </div>
                  <div className="font-medium text-foreground text-sm">{loc.name}</div>
                  <div className="text-xs text-muted-foreground">{loc.city}</div>
                </div>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Icon name="MoreHorizontal" size={14} /></Button>
              </div>
              <div className="flex gap-6 pt-3 border-t border-border">
                <div>
                  <div className="text-xl font-semibold text-foreground">{loc.containers}</div>
                  <div className="text-xs text-muted-foreground">Контейнеров</div>
                </div>
                <div>
                  <div className="text-xl font-semibold text-foreground">{loc.equipment}</div>
                  <div className="text-xs text-muted-foreground">Оборудования</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TransportSection() {
  const [dialog, setDialog] = useState(false);
  return (
    <div className="space-y-5 animate-fade-in">
      <AddTransportDialog open={dialog} onClose={() => setDialog(false)} />
      <SectionHeader title="Автотранспорт" action="Добавить транспорт" onAction={() => setDialog(true)} />
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {["Госномер", "Тип", "Водитель", "Статус", "Маршрут", "Контейнеры", ""].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockTransport.map((t, i) => (
              <tr key={t.id} className={`border-b border-border last:border-0 hover:bg-muted/20 ${i % 2 ? "bg-muted/10" : ""}`}>
                <td className="px-4 py-3 font-mono-ibm text-xs font-medium text-foreground">{t.plate}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{t.type}</td>
                <td className="px-4 py-3 text-xs text-foreground">{t.driver}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded border ${t.status === "В рейсе" ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}>{t.status}</span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{t.route}</td>
                <td className="px-4 py-3 text-xs font-mono-ibm text-muted-foreground">{t.containers.length > 0 ? t.containers.join(", ") : "—"}</td>
                <td className="px-4 py-3"><Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Icon name="MoreHorizontal" size={14} /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function RailwaySection() {
  const [dialog, setDialog] = useState(false);
  return (
    <div className="space-y-5 animate-fade-in">
      <AddRailwayDialog open={dialog} onClose={() => setDialog(false)} />
      <SectionHeader title="ЖД составы" action="Добавить вагон" onAction={() => setDialog(true)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wagons.map(w => (
          <div key={w.id} className="bg-white rounded-lg border border-border p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-mono-ibm text-sm font-medium text-foreground">Вагон № {w.number}</div>
                <div className="text-xs text-muted-foreground">{w.type}</div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded border ${w.containers.length > 0 ? "bg-sky-50 text-sky-700 border-sky-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}>
                {w.containers.length}/{w.capacity} конт.
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <Icon name="ArrowRight" size={12} />
              <span>{w.route}</span>
            </div>
            <div className="flex gap-6 text-xs pt-3 border-t border-border">
              <div><span className="text-foreground font-medium">Отпр: </span>{w.departure}</div>
              <div><span className="text-foreground font-medium">Приб: </span>{w.arrival}</div>
            </div>
            {w.containers.length > 0 && <div className="mt-2 text-xs font-mono-ibm text-primary">{w.containers.join(", ")}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function VesselsSection() {
  const [dialog, setDialog] = useState(false);
  return (
    <div className="space-y-5 animate-fade-in">
      <AddVesselDialog open={dialog} onClose={() => setDialog(false)} />
      <SectionHeader title="Суда" action="Добавить судно" onAction={() => setDialog(true)} />
      <div className="space-y-3">
        {mockVessels.map(v => (
          <div key={v.id} className="bg-white rounded-lg border border-border p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-medium text-foreground">«{v.name}»</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span>{v.portFrom}</span><Icon name="ArrowRight" size={12} /><span>{v.portTo}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded border ${v.status === "В пути" ? "bg-sky-50 text-sky-700 border-sky-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}>{v.status}</span>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Icon name="MoreHorizontal" size={14} /></Button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border">
              <div><div className="text-xs text-muted-foreground">Отправление</div><div className="text-xs font-medium text-foreground mt-0.5">{v.departure}</div></div>
              <div><div className="text-xs text-muted-foreground">Прибытие</div><div className="text-xs font-medium text-foreground mt-0.5">{v.arrival}</div></div>
              <div><div className="text-xs text-muted-foreground">Контейнеров</div><div className="text-sm font-semibold text-foreground mt-0.5">{v.containers}</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EquipmentSection() {
  const [dialog, setDialog] = useState(false);
  return (
    <div className="space-y-5 animate-fade-in">
      <AddEquipmentDialog open={dialog} onClose={() => setDialog(false)} />
      <SectionHeader title="Оборудование" action="Добавить оборудование" onAction={() => setDialog(true)} />
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {["ID", "Тип", "Состояние", "Локация", "Следующий ТО", "Срок службы до", ""].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockEquipment.map((eq, i) => (
              <tr key={eq.id} className={`border-b border-border last:border-0 hover:bg-muted/20 ${i % 2 ? "bg-muted/10" : ""}`}>
                <td className="px-4 py-3 font-mono-ibm text-xs font-medium text-foreground">{eq.identifier}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{eq.type}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded border ${eq.status === "Неисправен" ? "bg-red-50 text-red-700 border-red-200" : eq.status === "Техобслуживание" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-green-50 text-green-700 border-green-200"}`}>{eq.status}</span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{eq.location}</td>
                <td className="px-4 py-3 text-xs font-mono-ibm text-foreground">{eq.nextCheck}</td>
                <td className="px-4 py-3 text-xs font-mono-ibm text-muted-foreground">{eq.serviceLife}</td>
                <td className="px-4 py-3"><Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Icon name="MoreHorizontal" size={14} /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function UsersSection() {
  const [dialog, setDialog] = useState(false);
  const roleColors: Record<string, string> = {
    "Администратор": "bg-purple-50 text-purple-700 border-purple-200",
    "Логист":        "bg-sky-50 text-sky-700 border-sky-200",
    "Механик":       "bg-amber-50 text-amber-700 border-amber-200",
    "Водитель":      "bg-green-50 text-green-700 border-green-200",
  };
  return (
    <div className="space-y-5 animate-fade-in">
      <AddUserDialog open={dialog} onClose={() => setDialog(false)} />
      <SectionHeader title="Пользователи" action="Добавить пользователя" onAction={() => setDialog(true)} />
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {["Сотрудник", "Роль", "Отдел", "Логин", "Статус", ""].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((u, i) => (
              <tr key={u.id} className={`border-b border-border last:border-0 hover:bg-muted/20 ${i % 2 ? "bg-muted/10" : ""}`}>
                <td className="px-4 py-3 text-sm text-foreground font-medium">{u.name}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded border ${roleColors[u.role] || ""}`}>{u.role}</span></td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{u.department}</td>
                <td className="px-4 py-3 font-mono-ibm text-xs text-muted-foreground">{u.login}</td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded border bg-green-50 text-green-700 border-green-200">{u.status}</span></td>
                <td className="px-4 py-3"><Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Icon name="MoreHorizontal" size={14} /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ActivitySection() {
  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Журнал действий" />
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {["Время", "Пользователь", "Действие", "Объект"].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockActivity.map((a, i) => (
              <tr key={a.id} className={`border-b border-border last:border-0 hover:bg-muted/20 ${i % 2 ? "bg-muted/10" : ""}`}>
                <td className="px-4 py-3 font-mono-ibm text-xs text-muted-foreground whitespace-nowrap">{a.time}</td>
                <td className="px-4 py-3 text-xs font-medium text-foreground">{a.user}</td>
                <td className="px-4 py-3 text-xs text-primary">{a.action}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{a.object}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function MapSection() {
  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Карта объектов" />
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 h-[420px]">
          <div className="absolute inset-0 opacity-[0.07]">
            {[...Array(18)].map((_, i) => (
              <div key={`h${i}`} className="absolute border-t border-slate-500 w-full" style={{ top: `${i * 5.56}%` }} />
            ))}
            {[...Array(18)].map((_, i) => (
              <div key={`v${i}`} className="absolute border-l border-slate-500 h-full" style={{ left: `${i * 5.56}%` }} />
            ))}
          </div>

          {mockLocations.map(loc => {
            const x = ((loc.coords[1] - 28) / (134 - 28)) * 88 + 6;
            const y = ((62 - loc.coords[0]) / (62 - 43)) * 80 + 8;
            const cfg = locTypeConfig[loc.type];
            return (
              <div key={loc.id} className="absolute group cursor-pointer" style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}>
                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-primary border-2 border-white shadow-lg flex items-center justify-center">
                    <Icon name={cfg.icon as "Anchor"} size={11} className="text-white" />
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 opacity-0 group-hover:opacity-100 transition-all duration-150 bg-foreground text-background text-xs rounded-md px-3 py-2 whitespace-nowrap shadow-xl z-20 pointer-events-none">
                    <div className="font-semibold">{loc.name}</div>
                    <div className="text-background/60 text-[11px]">{loc.containers} конт. · {loc.equipment} обор.</div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-foreground" />
                  </div>
                </div>
              </div>
            );
          })}

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center opacity-30">
              <Icon name="Map" size={48} className="mx-auto mb-2 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border bg-muted/20">
          <div className="flex flex-wrap gap-2">
            {mockLocations.map(loc => {
              const cfg = locTypeConfig[loc.type];
              return (
                <div key={loc.id} className="flex items-center gap-1.5 text-xs bg-white border border-border rounded-md px-2.5 py-1.5 hover:border-primary/40 transition-colors cursor-pointer">
                  <Icon name={cfg.icon as "Anchor"} size={11} className="text-primary" />
                  <span className="font-medium text-foreground">{loc.name}</span>
                  <span className="text-muted-foreground ml-1">{loc.containers}+{loc.equipment}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}