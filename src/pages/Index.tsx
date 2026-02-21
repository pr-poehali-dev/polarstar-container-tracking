import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ─── Types ───────────────────────────────────────────────────────────────────
type Section = "dashboard" | "containers" | "locations" | "transport" | "railway" | "vessels" | "equipment" | "users" | "activity" | "map";
type ContainerStatus = "empty" | "loaded" | "broken" | "unchecked" | "ready";

interface Container {
  id: string; number: string; type: string; volume: number; year: number;
  status: ContainerStatus; client: string; temp: string; weight: number;
  location: string; lastCheck: string;
}
interface Location {
  id: string; name: string; type: "terminal" | "port" | "station";
  city: string; containers: number; equipment: number; coords: [number, number];
}
interface Transport {
  id: string; plate: string; type: string; driver: string;
  status: string; route: string; containers: string[];
}
interface Vessel {
  id: string; name: string; portFrom: string; portTo: string;
  departure: string; arrival: string; containers: number; status: string;
}
interface Equipment {
  id: string; identifier: string; type: string; status: string;
  location: string; serviceLife: string; nextCheck: string;
}
interface User {
  id: string; name: string; role: string; department: string; login: string; status: string;
}
interface ActivityLog {
  id: string; user: string; action: string; object: string; time: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────
const mockContainers: Container[] = [
  { id: "1", number: "MRKU3456789", type: "40HC", volume: 76, year: 2019, status: "loaded",    client: "ООО Арктик Трейд", temp: "-18°C", weight: 22400, location: "Порт Владивосток, Терм. 3",  lastCheck: "2026-02-10" },
  { id: "2", number: "TCKU1234567", type: "20ST", volume: 33, year: 2021, status: "empty",     client: "АО СевТранс",      temp: "-25°C", weight: 2200,  location: "Тыловой терминал №1",       lastCheck: "2026-01-28" },
  { id: "3", number: "MSCU9876543", type: "40ST", volume: 67, year: 2018, status: "broken",    client: "ИП Морозов",       temp: "0°C",   weight: 18000, location: "Станция Красный Яр",        lastCheck: "2025-12-15" },
  { id: "4", number: "GESU5551234", type: "40HC", volume: 76, year: 2022, status: "ready",     client: "ООО Полюс Груп",   temp: "-20°C", weight: 24100, location: "Судно «Арктика»",           lastCheck: "2026-02-18" },
  { id: "5", number: "HLXU2223456", type: "20ST", volume: 33, year: 2020, status: "unchecked", client: "ЗАО Логистик+",    temp: "-15°C", weight: 1800,  location: "Вагон № 54321",             lastCheck: "2025-11-05" },
  { id: "6", number: "CMAU7778901", type: "40HC", volume: 76, year: 2023, status: "loaded",    client: "ООО Арктик Трейд", temp: "-18°C", weight: 21500, location: "Авто А777КМ125",            lastCheck: "2026-02-19" },
  { id: "7", number: "TRLU4445678", type: "20ST", volume: 33, year: 2017, status: "empty",     client: "АО СевТранс",      temp: "-22°C", weight: 2100,  location: "Порт Санкт-Петербург",      lastCheck: "2026-02-01" },
];

const mockLocations: Location[] = [
  { id: "1", name: "Порт Владивосток",       type: "port",     city: "Владивосток",    containers: 42, equipment: 8, coords: [43.1155, 131.8855] },
  { id: "2", name: "Тыловой терминал №1",    type: "terminal", city: "Владивосток",    containers: 18, equipment: 3, coords: [43.1332, 131.9246] },
  { id: "3", name: "Порт Санкт-Петербург",   type: "port",     city: "Санкт-Петербург",containers: 31, equipment: 6, coords: [59.9311, 30.2898]  },
  { id: "4", name: "Станция Красный Яр",     type: "station",  city: "Новосибирск",    containers: 7,  equipment: 2, coords: [54.9924, 82.9155]  },
  { id: "5", name: "Терминал Москва-Товарная",type: "terminal", city: "Москва",         containers: 24, equipment: 4, coords: [55.7558, 37.6176]  },
];

const mockTransport: Transport[] = [
  { id: "1", plate: "А777КМ125", type: "КАМАЗ 5490",   driver: "Иванов С.В.",   status: "В рейсе",    route: "Владивосток → Хабаровск", containers: ["CMAU7778901"] },
  { id: "2", plate: "В234АР777", type: "VOLVO FH",      driver: "Петров А.И.",   status: "На стоянке", route: "—",                       containers: [] },
  { id: "3", plate: "К456ОП199", type: "MAN TGX",       driver: "Смирнов Д.Н.",  status: "В рейсе",    route: "Москва → СПб",            containers: ["HLXU2223456"] },
];

const mockVessels: Vessel[] = [
  { id: "1", name: "Арктика",       portFrom: "Владивосток",   portTo: "Санкт-Петербург", departure: "2026-02-15 08:00", arrival: "2026-03-05 14:00", containers: 28, status: "В пути"  },
  { id: "2", name: "Полюс",         portFrom: "Санкт-Петербург",portTo: "Владивосток",    departure: "2026-02-20 10:00", arrival: "2026-03-12 09:00", containers: 15, status: "В пути"  },
  { id: "3", name: "Северный путь", portFrom: "Владивосток",   portTo: "Москва (река)",   departure: "2026-03-01 06:00", arrival: "2026-03-18 16:00", containers: 0,  status: "Ожидает" },
];

const mockEquipment: Equipment[] = [
  { id: "1", identifier: "GEN-001", type: "Дженсет Thermo King", status: "Работает",       location: "Судно «Арктика»",    serviceLife: "2029-06-01", nextCheck: "2026-04-01" },
  { id: "2", identifier: "GEN-002", type: "Дженсет Carrier",     status: "Работает",       location: "Порт Владивосток",   serviceLife: "2027-12-01", nextCheck: "2026-03-15" },
  { id: "3", identifier: "PWR-003", type: "Источник питания ABB",status: "Техобслуживание",location: "Тыловой терминал №1",serviceLife: "2030-01-01", nextCheck: "2026-02-25" },
  { id: "4", identifier: "GEN-004", type: "Дженсет Thermo King", status: "Неисправен",     location: "Вагон № 54321",      serviceLife: "2026-08-01", nextCheck: "Требуется ремонт" },
];

const mockUsers: User[] = [
  { id: "1", name: "Александров Игорь Петрович",      role: "Администратор", department: "ИТ",                login: "i.alexandrov", status: "Активен" },
  { id: "2", name: "Морозова Елена Сергеевна",         role: "Логист",        department: "Логистика",         login: "e.morozova",   status: "Активен" },
  { id: "3", name: "Рыбаков Дмитрий Владимирович",    role: "Механик",       department: "Техническая служба",login: "d.rybakov",    status: "Активен" },
  { id: "4", name: "Соколов Андрей Николаевич",        role: "Водитель",      department: "Автотранспорт",     login: "a.sokolov",    status: "Активен" },
];

const mockActivity: ActivityLog[] = [
  { id: "1", user: "Морозова Е.С.",    action: "Изменён статус",   object: "Контейнер MRKU3456789 → Груженый",        time: "2026-02-21 14:32" },
  { id: "2", user: "Рыбаков Д.В.",     action: "Проверка ТО",       object: "Дженсет GEN-001",                         time: "2026-02-21 11:15" },
  { id: "3", user: "Морозова Е.С.",    action: "Перемещение",        object: "TCKU1234567: СПб → Тыловой терминал №1", time: "2026-02-20 16:47" },
  { id: "4", user: "Александров И.П.", action: "Создан пользователь",object: "Соколов А.Н. (Водитель)",                time: "2026-02-20 09:00" },
  { id: "5", user: "Морозова Е.С.",    action: "Добавлен рейс",     object: "Судно «Северный путь»",                   time: "2026-02-19 15:22" },
  { id: "6", user: "Рыбаков Д.В.",     action: "Статус изменён",    object: "GEN-004 → Неисправен",                    time: "2026-02-18 10:05" },
];

const wagons = [
  { id: "1", number: "54321-МОС", type: "Рефрижераторный", capacity: 2, route: "Владивосток → Москва",      departure: "2026-02-18", arrival: "2026-02-28", containers: ["HLXU2223456"] },
  { id: "2", number: "67890-НСК", type: "Рефрижераторный", capacity: 2, route: "Москва → Новосибирск",      departure: "2026-02-22", arrival: "2026-02-26", containers: [] },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const statusConfig: Record<ContainerStatus, { label: string; color: string }> = {
  empty:     { label: "Порожний",          color: "bg-gray-100 text-gray-600 border-gray-200"   },
  loaded:    { label: "Груженый",          color: "bg-green-50 text-green-700 border-green-200" },
  broken:    { label: "Неисправный",       color: "bg-red-50 text-red-700 border-red-200"       },
  unchecked: { label: "Не проверен",       color: "bg-amber-50 text-amber-700 border-amber-200" },
  ready:     { label: "Годен к перевозке", color: "bg-sky-50 text-sky-700 border-sky-200"       },
};

const locTypeConfig: Record<string, { label: string; icon: string }> = {
  port:     { label: "Порт",              icon: "Anchor"    },
  terminal: { label: "Тыловой терминал", icon: "Warehouse" },
  station:  { label: "Станция",          icon: "Train"     },
};

const navItems: { id: Section; label: string; icon: string; count?: number }[] = [
  { id: "dashboard",  label: "Дашборд",         icon: "LayoutDashboard" },
  { id: "containers", label: "Контейнеры",      icon: "Package",         count: 7  },
  { id: "locations",  label: "Локации",          icon: "MapPin",          count: 5  },
  { id: "transport",  label: "Автотранспорт",    icon: "Truck",           count: 3  },
  { id: "railway",    label: "ЖД составы",       icon: "Train",           count: 2  },
  { id: "vessels",    label: "Суда",             icon: "Ship",            count: 3  },
  { id: "equipment",  label: "Оборудование",     icon: "Zap",             count: 4  },
  { id: "map",        label: "Карта",            icon: "Map"              },
  { id: "users",      label: "Пользователи",     icon: "Users",           count: 4  },
  { id: "activity",   label: "Журнал действий",  icon: "ScrollText"       },
];

// ─── Reusable ─────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ContainerStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function StatCard({ label, value, icon, sub, accent }: { label: string; value: string | number; icon: string; sub?: string; accent?: string }) {
  return (
    <div className="bg-white rounded-lg border border-border p-5">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
        <div className={`w-8 h-8 rounded-md flex items-center justify-center ${accent || "bg-secondary"}`}>
          <Icon name={icon as "Home"} size={16} className={accent ? "text-white" : "text-primary"} />
        </div>
      </div>
      <div className="text-2xl font-semibold text-foreground">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {action && (
        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-8">
          <Icon name="Plus" size={14} className="mr-1" />
          {action}
        </Button>
      )}
    </div>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────
function Dashboard() {
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

function ContainersSection() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = mockContainers.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = c.number.toLowerCase().includes(q) || c.client.toLowerCase().includes(q) || c.location.toLowerCase().includes(q);
    return matchSearch && (filterStatus === "all" || c.status === filterStatus);
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Контейнеры" action="Добавить контейнер" />
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

function LocationsSection() {
  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Локации" action="Добавить локацию" />
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

function TransportSection() {
  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Автотранспорт" action="Добавить транспорт" />
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

function RailwaySection() {
  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="ЖД составы" action="Добавить вагон" />
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

function VesselsSection() {
  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Суда" action="Добавить судно" />
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

function EquipmentSection() {
  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Оборудование" action="Добавить оборудование" />
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

function UsersSection() {
  const roleColors: Record<string, string> = {
    "Администратор": "bg-purple-50 text-purple-700 border-purple-200",
    "Логист":        "bg-sky-50 text-sky-700 border-sky-200",
    "Механик":       "bg-amber-50 text-amber-700 border-amber-200",
    "Водитель":      "bg-green-50 text-green-700 border-green-200",
  };
  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Пользователи" action="Добавить пользователя" />
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

function ActivitySection() {
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

function MapSection() {
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

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function Index() {
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":  return <Dashboard />;
      case "containers": return <ContainersSection />;
      case "locations":  return <LocationsSection />;
      case "transport":  return <TransportSection />;
      case "railway":    return <RailwaySection />;
      case "vessels":    return <VesselsSection />;
      case "equipment":  return <EquipmentSection />;
      case "map":        return <MapSection />;
      case "users":      return <UsersSection />;
      case "activity":   return <ActivitySection />;
      default:           return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-ibm">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-56" : "w-14"} transition-all duration-200 flex-shrink-0 flex flex-col`} style={{ background: "hsl(220,28%,12%)" }}>
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
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-all relative
                ${activeSection === item.id
                  ? "text-white"
                  : "hover:text-white/80"}`}
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
                    <span className="text-[10px] px-1.5 rounded-full font-mono-ibm" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }}>
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
