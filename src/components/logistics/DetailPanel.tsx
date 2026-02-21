import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Icon from "@/components/ui/icon";
import { StatusBadge } from "@/components/logistics/Shared";
import {
  Container, Location, Transport, Vessel, Equipment, Wagon, ActivityLog,
  mockContainers, mockLocations, mockTransport, mockVessels, mockEquipment, wagons, mockActivity,
  locTypeConfig,
} from "@/data/mockData";

export type DetailType = "container" | "location" | "transport" | "wagon" | "vessel" | "equipment";

export interface DetailTarget {
  type: DetailType;
  id: string;
}

interface Props {
  target: DetailTarget | null;
  onClose: () => void;
  onNavigate: (target: DetailTarget) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground w-40 shrink-0">{label}</span>
      <span className="text-xs text-foreground font-medium text-right">{value}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 mt-5 first:mt-0">{children}</div>;
}

function ActivityList({ items }: { items: ActivityLog[] }) {
  if (!items.length) return <p className="text-xs text-muted-foreground py-1">Нет событий</p>;
  return (
    <div className="space-y-2">
      {items.map(a => (
        <div key={a.id} className="text-xs bg-muted/30 rounded-md px-3 py-2">
          <div className="font-medium text-foreground">{a.action}</div>
          <div className="text-muted-foreground">{a.object}</div>
          <div className="text-muted-foreground/50 mt-0.5">{a.time} · {a.user}</div>
        </div>
      ))}
    </div>
  );
}

function LinkCard({ icon, label, color, onClick }: { icon: string; label: string; color: string; onClick: () => void }) {
  return (
    <div onClick={onClick} className={`flex items-center gap-2 px-3 py-2.5 rounded-md cursor-pointer transition-colors border ${color}`}>
      <Icon name={icon as "Ship"} size={14} />
      <span className="text-xs font-medium flex-1">{label}</span>
      <Icon name="ChevronRight" size={13} className="opacity-50" />
    </div>
  );
}

// ─── Drag-and-drop container list ─────────────────────────────────────────────
function DraggableContainerList({
  containers,
  onSelect,
}: {
  containers: Container[];
  onSelect: (id: string) => void;
}) {
  const [order, setOrder] = useState(containers.map(c => c.id));
  const dragId = useRef<string | null>(null);
  const dragOverId = useRef<string | null>(null);

  // Keep order in sync if containers prop changes
  const ordered = order
    .map(id => containers.find(c => c.id === id))
    .filter(Boolean) as Container[];

  const handleDragStart = (id: string) => {
    dragId.current = id;
  };

  const handleDragEnter = (id: string) => {
    dragOverId.current = id;
  };

  const handleDragEnd = () => {
    if (!dragId.current || !dragOverId.current || dragId.current === dragOverId.current) {
      dragId.current = null;
      dragOverId.current = null;
      return;
    }
    const next = [...order];
    const from = next.indexOf(dragId.current);
    const to = next.indexOf(dragOverId.current);
    next.splice(from, 1);
    next.splice(to, 0, dragId.current);
    setOrder(next);
    dragId.current = null;
    dragOverId.current = null;
  };

  if (!ordered.length) return <p className="text-xs text-muted-foreground py-1">Нет контейнеров</p>;

  return (
    <div className="space-y-1.5">
      {ordered.map(c => (
        <div
          key={c.id}
          draggable
          onDragStart={() => handleDragStart(c.id)}
          onDragEnter={() => handleDragEnter(c.id)}
          onDragEnd={handleDragEnd}
          onDragOver={e => e.preventDefault()}
          onClick={() => onSelect(c.id)}
          className="flex items-center gap-2 py-2.5 px-3 rounded-md border border-border bg-white hover:bg-primary/5 cursor-grab active:cursor-grabbing transition-colors group select-none"
        >
          <Icon name="GripVertical" size={13} className="text-muted-foreground/30 group-hover:text-muted-foreground/60 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-mono-ibm font-medium text-foreground truncate">{c.number}</div>
            <div className="text-xs text-muted-foreground truncate">{c.type} · {c.client}</div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={c.status} />
            <Icon name="ChevronRight" size={13} className="text-muted-foreground/40" />
          </div>
        </div>
      ))}
      <p className="text-[10px] text-muted-foreground/50 text-center pt-1">Перетащите для изменения порядка</p>
    </div>
  );
}

// ─── Container detail ─────────────────────────────────────────────────────────
function ContainerDetail({ c, onNavigate }: { c: Container; onNavigate: (t: DetailTarget) => void }) {
  const history = mockActivity.filter(a => a.entityType === "container" && a.entityId === c.id);
  const vessel = c.vesselId ? mockVessels.find(v => v.id === c.vesselId) : null;
  const transport = c.transportId ? mockTransport.find(t => t.id === c.transportId) : null;
  const wagon = c.wagonId ? wagons.find(w => w.id === c.wagonId) : null;
  const loc = c.locationId ? mockLocations.find(l => l.id === c.locationId) : null;

  return (
    <div>
      <div className="bg-muted/30 rounded-lg p-4 mb-4">
        <InfoRow label="Номер" value={<span className="font-mono-ibm">{c.number}</span>} />
        <InfoRow label="Тип / Объём" value={`${c.type} · ${c.volume} м³`} />
        <InfoRow label="Год выпуска" value={c.year} />
        <InfoRow label="Статус" value={<StatusBadge status={c.status} />} />
        <InfoRow label="Клиент" value={c.client} />
        <InfoRow label="Температура" value={<span className="font-mono-ibm">{c.temp}</span>} />
        <InfoRow label="Вес" value={`${c.weight.toLocaleString()} кг`} />
        <InfoRow label="Последняя проверка" value={c.lastCheck} />
      </div>

      <SectionTitle>Местоположение</SectionTitle>
      <div className="space-y-1.5">
        {vessel && <LinkCard icon="Ship" label={`Судно «${vessel.name}»`} color="bg-sky-50 border-sky-200 text-sky-700" onClick={() => onNavigate({ type: "vessel", id: vessel.id })} />}
        {transport && <LinkCard icon="Truck" label={`Авто ${transport.plate}`} color="bg-green-50 border-green-200 text-green-700" onClick={() => onNavigate({ type: "transport", id: transport.id })} />}
        {wagon && <LinkCard icon="Train" label={`Вагон № ${wagon.number}`} color="bg-amber-50 border-amber-200 text-amber-700" onClick={() => onNavigate({ type: "wagon", id: wagon.id })} />}
        {loc && <LinkCard icon={locTypeConfig[loc.type].icon} label={loc.name} color="bg-primary/5 border-primary/20 text-primary" onClick={() => onNavigate({ type: "location", id: loc.id })} />}
        {!vessel && !transport && !wagon && !loc && <p className="text-xs text-muted-foreground">{c.location}</p>}
      </div>

      <SectionTitle>История изменений</SectionTitle>
      <ActivityList items={history} />
    </div>
  );
}

// ─── Vessel detail ────────────────────────────────────────────────────────────
function VesselDetail({ v, onNavigate }: { v: Vessel; onNavigate: (t: DetailTarget) => void }) {
  // Ищем контейнеры по vesselId ИЛИ по location-строке содержащей название судна
  const containers = mockContainers.filter(c =>
    c.vesselId === v.id || c.location.includes(v.name)
  );
  const equipment = mockEquipment.filter(e => e.vesselId === v.id || e.location.includes(v.name));
  const history = mockActivity.filter(a => a.entityType === "vessel" && a.entityId === v.id);

  return (
    <div>
      <div className="bg-muted/30 rounded-lg p-4 mb-4">
        <InfoRow label="Статус" value={
          <span className={`text-xs px-2 py-0.5 rounded border ${v.status === "В пути" ? "bg-sky-50 text-sky-700 border-sky-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}>{v.status}</span>
        } />
        <InfoRow label="Маршрут" value={`${v.portFrom} → ${v.portTo}`} />
        <InfoRow label="Отправление" value={v.departure} />
        <InfoRow label="Прибытие" value={v.arrival} />
        <InfoRow label="Всего контейнеров" value={v.containers} />
      </div>

      <SectionTitle>Контейнеры на борту ({containers.length})</SectionTitle>
      <DraggableContainerList containers={containers} onSelect={id => onNavigate({ type: "container", id })} />

      {equipment.length > 0 && (
        <>
          <SectionTitle>Оборудование ({equipment.length})</SectionTitle>
          <div className="space-y-1.5">
            {equipment.map(eq => {
              const color = eq.status === "Неисправен" ? "bg-red-50 text-red-700 border-red-200"
                : eq.status === "Техобслуживание" ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-green-50 text-green-700 border-green-200";
              return (
                <div key={eq.id} className="flex items-center justify-between py-2.5 px-3 rounded-md bg-muted/30">
                  <div>
                    <div className="text-xs font-mono-ibm font-medium text-foreground">{eq.identifier}</div>
                    <div className="text-xs text-muted-foreground">{eq.type}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded border ${color}`}>{eq.status}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {history.length > 0 && (
        <>
          <SectionTitle>История</SectionTitle>
          <ActivityList items={history} />
        </>
      )}
    </div>
  );
}

// ─── Location detail ──────────────────────────────────────────────────────────
function LocationDetail({ loc, onNavigate }: { loc: Location; onNavigate: (t: DetailTarget) => void }) {
  const cfg = locTypeConfig[loc.type];

  // Ищем по locationId ИЛИ по строке location содержащей название локации
  const containers = mockContainers.filter(c =>
    c.locationId === loc.id || c.location.toLowerCase().includes(loc.name.toLowerCase().split(",")[0])
  );
  const equipment = mockEquipment.filter(e =>
    e.locationId === loc.id || e.location.toLowerCase().includes(loc.name.toLowerCase().split(",")[0])
  );

  return (
    <div>
      <div className="bg-muted/30 rounded-lg p-4 mb-4">
        <InfoRow label="Тип" value={cfg.label} />
        <InfoRow label="Город" value={loc.city} />
        <InfoRow label="Всего контейнеров" value={loc.containers} />
        <InfoRow label="Всего оборудования" value={loc.equipment} />
      </div>

      <SectionTitle>Контейнеры ({containers.length} показано)</SectionTitle>
      <DraggableContainerList containers={containers} onSelect={id => onNavigate({ type: "container", id })} />

      {equipment.length > 0 && (
        <>
          <SectionTitle>Оборудование ({equipment.length})</SectionTitle>
          <div className="space-y-1.5">
            {equipment.map(eq => {
              const color = eq.status === "Неисправен" ? "bg-red-50 text-red-700 border-red-200"
                : eq.status === "Техобслуживание" ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-green-50 text-green-700 border-green-200";
              return (
                <div key={eq.id} className="flex items-center justify-between py-2.5 px-3 rounded-md bg-muted/30">
                  <div>
                    <div className="text-xs font-mono-ibm font-medium text-foreground">{eq.identifier}</div>
                    <div className="text-xs text-muted-foreground">{eq.type}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded border ${color}`}>{eq.status}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Transport detail ─────────────────────────────────────────────────────────
function TransportDetail({ t, onNavigate }: { t: Transport; onNavigate: (tgt: DetailTarget) => void }) {
  const containers = mockContainers.filter(c =>
    c.transportId === t.id || c.location.includes(t.plate)
  );

  return (
    <div>
      <div className="bg-muted/30 rounded-lg p-4 mb-4">
        <InfoRow label="Тип ТС" value={t.type} />
        <InfoRow label="Водитель" value={t.driver} />
        <InfoRow label="Статус" value={
          <span className={`text-xs px-2 py-0.5 rounded border ${t.status === "В рейсе" ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}>{t.status}</span>
        } />
        <InfoRow label="Маршрут" value={t.route} />
      </div>

      <SectionTitle>Контейнеры ({containers.length})</SectionTitle>
      <DraggableContainerList containers={containers} onSelect={id => onNavigate({ type: "container", id })} />
    </div>
  );
}

// ─── Wagon detail ─────────────────────────────────────────────────────────────
function WagonDetail({ w, onNavigate }: { w: Wagon; onNavigate: (t: DetailTarget) => void }) {
  const containers = mockContainers.filter(c =>
    c.wagonId === w.id || c.location.includes(w.number)
  );
  const equipment = mockEquipment.filter(e =>
    e.wagonId === w.id || e.location.includes(w.number)
  );

  return (
    <div>
      <div className="bg-muted/30 rounded-lg p-4 mb-4">
        <InfoRow label="Тип" value={w.type} />
        <InfoRow label="Вместимость" value={`${w.capacity} конт.`} />
        <InfoRow label="Маршрут" value={w.route} />
        <InfoRow label="Отправление" value={w.departure} />
        <InfoRow label="Прибытие" value={w.arrival} />
      </div>

      <SectionTitle>Контейнеры ({containers.length}/{w.capacity})</SectionTitle>
      <DraggableContainerList containers={containers} onSelect={id => onNavigate({ type: "container", id })} />

      {equipment.length > 0 && (
        <>
          <SectionTitle>Оборудование ({equipment.length})</SectionTitle>
          <div className="space-y-1.5">
            {equipment.map(eq => {
              const color = eq.status === "Неисправен" ? "bg-red-50 text-red-700 border-red-200"
                : eq.status === "Техобслуживание" ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-green-50 text-green-700 border-green-200";
              return (
                <div key={eq.id} className="flex items-center justify-between py-2.5 px-3 rounded-md bg-muted/30">
                  <div>
                    <div className="text-xs font-mono-ibm font-medium text-foreground">{eq.identifier}</div>
                    <div className="text-xs text-muted-foreground">{eq.type}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded border ${color}`}>{eq.status}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Equipment detail ─────────────────────────────────────────────────────────
function EquipmentDetail({ eq, onNavigate }: { eq: Equipment; onNavigate: (t: DetailTarget) => void }) {
  const history = mockActivity.filter(a => a.entityType === "equipment" && a.entityId === eq.id);
  const vessel = eq.vesselId ? mockVessels.find(v => v.id === eq.vesselId) : null;
  const loc = eq.locationId ? mockLocations.find(l => l.id === eq.locationId) : null;
  const wagon = eq.wagonId ? wagons.find(w => w.id === eq.wagonId) : null;
  const statusColor = eq.status === "Неисправен" ? "bg-red-50 text-red-700 border-red-200"
    : eq.status === "Техобслуживание" ? "bg-amber-50 text-amber-700 border-amber-200"
    : "bg-green-50 text-green-700 border-green-200";

  return (
    <div>
      <div className="bg-muted/30 rounded-lg p-4 mb-4">
        <InfoRow label="Тип" value={eq.type} />
        <InfoRow label="Состояние" value={<span className={`text-xs px-2 py-0.5 rounded border ${statusColor}`}>{eq.status}</span>} />
        <InfoRow label="Следующий ТО" value={eq.nextCheck} />
        <InfoRow label="Срок службы до" value={eq.serviceLife} />
      </div>

      <SectionTitle>Местоположение</SectionTitle>
      <div className="space-y-1.5">
        {vessel && <LinkCard icon="Ship" label={`Судно «${vessel.name}»`} color="bg-sky-50 border-sky-200 text-sky-700" onClick={() => onNavigate({ type: "vessel", id: vessel.id })} />}
        {loc && <LinkCard icon={locTypeConfig[loc.type].icon} label={loc.name} color="bg-primary/5 border-primary/20 text-primary" onClick={() => onNavigate({ type: "location", id: loc.id })} />}
        {wagon && <LinkCard icon="Train" label={`Вагон № ${wagon.number}`} color="bg-amber-50 border-amber-200 text-amber-700" onClick={() => onNavigate({ type: "wagon", id: wagon.id })} />}
        {!vessel && !loc && !wagon && <p className="text-xs text-muted-foreground">{eq.location}</p>}
      </div>

      {history.length > 0 && (
        <>
          <SectionTitle>История</SectionTitle>
          <ActivityList items={history} />
        </>
      )}
    </div>
  );
}

// ─── Title helper ─────────────────────────────────────────────────────────────
function getTitle(target: DetailTarget): string {
  switch (target.type) {
    case "container": return `Контейнер ${mockContainers.find(x => x.id === target.id)?.number ?? ""}`;
    case "vessel":    return `Судно «${mockVessels.find(x => x.id === target.id)?.name ?? ""}»`;
    case "location":  return mockLocations.find(x => x.id === target.id)?.name ?? "Локация";
    case "transport": return `Авто ${mockTransport.find(x => x.id === target.id)?.plate ?? ""}`;
    case "wagon":     return `Вагон № ${wagons.find(x => x.id === target.id)?.number ?? ""}`;
    case "equipment": return mockEquipment.find(x => x.id === target.id)?.identifier ?? "Оборудование";
  }
}

function getIcon(type: DetailType): string {
  const map: Record<DetailType, string> = {
    container: "Package", vessel: "Ship", location: "MapPin",
    transport: "Truck", wagon: "Train", equipment: "Zap",
  };
  return map[type];
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function DetailPanel({ target, onClose, onNavigate }: Props) {
  if (!target) return null;

  const renderContent = () => {
    switch (target.type) {
      case "container": { const c = mockContainers.find(x => x.id === target.id); return c ? <ContainerDetail c={c} onNavigate={onNavigate} /> : null; }
      case "vessel":    { const v = mockVessels.find(x => x.id === target.id);    return v ? <VesselDetail v={v} onNavigate={onNavigate} /> : null; }
      case "location":  { const l = mockLocations.find(x => x.id === target.id);  return l ? <LocationDetail loc={l} onNavigate={onNavigate} /> : null; }
      case "transport": { const t = mockTransport.find(x => x.id === target.id);  return t ? <TransportDetail t={t} onNavigate={onNavigate} /> : null; }
      case "wagon":     { const w = wagons.find(x => x.id === target.id);          return w ? <WagonDetail w={w} onNavigate={onNavigate} /> : null; }
      case "equipment": { const e = mockEquipment.find(x => x.id === target.id);  return e ? <EquipmentDetail eq={e} onNavigate={onNavigate} /> : null; }
    }
  };

  return (
    <Dialog open={!!target} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-hidden flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <Icon name={getIcon(target.type) as "Ship"} size={16} className="text-primary" />
            </div>
            <DialogTitle className="text-base font-semibold">{getTitle(target)}</DialogTitle>
          </div>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
