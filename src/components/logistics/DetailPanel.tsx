import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Icon from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/logistics/Shared";
import {
  Container, Location, Transport, Vessel, Equipment, Wagon, ActivityLog,
  mockContainers, mockLocations, mockTransport, mockVessels, mockEquipment, wagons, mockActivity,
  statusConfig, locTypeConfig, ContainerStatus,
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

// ─── Mini container list ──────────────────────────────────────────────────────
function ContainerRow({ c, onSelect }: { c: Container; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className="flex items-center justify-between py-2.5 px-3 rounded-md hover:bg-muted/50 cursor-pointer transition-colors border border-transparent hover:border-border"
    >
      <div>
        <div className="text-xs font-mono-ibm font-medium text-foreground">{c.number}</div>
        <div className="text-xs text-muted-foreground">{c.type} · {c.client}</div>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={c.status} />
        <Icon name="ChevronRight" size={13} className="text-muted-foreground" />
      </div>
    </div>
  );
}

function EquipmentRow({ eq }: { eq: Equipment }) {
  const color = eq.status === "Неисправен" ? "bg-red-50 text-red-700 border-red-200"
    : eq.status === "Техобслуживание" ? "bg-amber-50 text-amber-700 border-amber-200"
    : "bg-green-50 text-green-700 border-green-200";
  return (
    <div className="flex items-center justify-between py-2.5 px-3 rounded-md bg-muted/30">
      <div>
        <div className="text-xs font-mono-ibm font-medium text-foreground">{eq.identifier}</div>
        <div className="text-xs text-muted-foreground">{eq.type}</div>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded border ${color}`}>{eq.status}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground w-36 shrink-0">{label}</span>
      <span className="text-xs text-foreground font-medium text-right">{value}</span>
    </div>
  );
}

function ActivityList({ items }: { items: ActivityLog[] }) {
  if (!items.length) return <p className="text-xs text-muted-foreground py-2">Нет событий</p>;
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

// ─── Container detail ─────────────────────────────────────────────────────────
function ContainerDetail({ c, onNavigate }: { c: Container; onNavigate: (t: DetailTarget) => void }) {
  const history = mockActivity.filter(a => a.entityType === "container" && a.entityId === c.id);
  const vessel = c.vesselId ? mockVessels.find(v => v.id === c.vesselId) : null;
  const transport = c.transportId ? mockTransport.find(t => t.id === c.transportId) : null;
  const wagon = c.wagonId ? wagons.find(w => w.id === c.wagonId) : null;
  const loc = c.locationId ? mockLocations.find(l => l.id === c.locationId) : null;

  return (
    <div className="space-y-5">
      <div className="bg-muted/30 rounded-lg p-4">
        <InfoRow label="Номер" value={<span className="font-mono-ibm">{c.number}</span>} />
        <InfoRow label="Тип / Объём" value={`${c.type} · ${c.volume} м³`} />
        <InfoRow label="Год выпуска" value={c.year} />
        <InfoRow label="Статус" value={<StatusBadge status={c.status} />} />
        <InfoRow label="Клиент" value={c.client} />
        <InfoRow label="Температура" value={<span className="font-mono-ibm">{c.temp}</span>} />
        <InfoRow label="Вес" value={`${c.weight.toLocaleString()} кг`} />
        <InfoRow label="Последняя проверка" value={c.lastCheck} />
      </div>

      <div>
        <div className="text-xs font-medium text-foreground mb-2">Текущее местоположение</div>
        {vessel && (
          <div
            onClick={() => onNavigate({ type: "vessel", id: vessel.id })}
            className="flex items-center gap-2 px-3 py-2.5 bg-sky-50 border border-sky-200 rounded-md cursor-pointer hover:bg-sky-100 transition-colors"
          >
            <Icon name="Ship" size={14} className="text-sky-600" />
            <span className="text-xs font-medium text-sky-700">Судно «{vessel.name}»</span>
            <Icon name="ChevronRight" size={13} className="text-sky-500 ml-auto" />
          </div>
        )}
        {transport && (
          <div
            onClick={() => onNavigate({ type: "transport", id: transport.id })}
            className="flex items-center gap-2 px-3 py-2.5 bg-green-50 border border-green-200 rounded-md cursor-pointer hover:bg-green-100 transition-colors"
          >
            <Icon name="Truck" size={14} className="text-green-600" />
            <span className="text-xs font-medium text-green-700">Авто {transport.plate}</span>
            <Icon name="ChevronRight" size={13} className="text-green-500 ml-auto" />
          </div>
        )}
        {wagon && (
          <div
            onClick={() => onNavigate({ type: "wagon", id: wagon.id })}
            className="flex items-center gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-md cursor-pointer hover:bg-amber-100 transition-colors"
          >
            <Icon name="Train" size={14} className="text-amber-600" />
            <span className="text-xs font-medium text-amber-700">Вагон № {wagon.number}</span>
            <Icon name="ChevronRight" size={13} className="text-amber-500 ml-auto" />
          </div>
        )}
        {loc && (
          <div
            onClick={() => onNavigate({ type: "location", id: loc.id })}
            className="flex items-center gap-2 px-3 py-2.5 bg-primary/5 border border-primary/20 rounded-md cursor-pointer hover:bg-primary/10 transition-colors"
          >
            <Icon name={locTypeConfig[loc.type].icon as "Anchor"} size={14} className="text-primary" />
            <span className="text-xs font-medium text-primary">{loc.name}</span>
            <Icon name="ChevronRight" size={13} className="text-primary/50 ml-auto" />
          </div>
        )}
        {!vessel && !transport && !wagon && !loc && (
          <div className="text-xs text-muted-foreground px-3 py-2">{c.location}</div>
        )}
      </div>

      <div>
        <div className="text-xs font-medium text-foreground mb-2">История изменений</div>
        <ActivityList items={history} />
      </div>
    </div>
  );
}

// ─── Vessel detail ────────────────────────────────────────────────────────────
function VesselDetail({ v, onNavigate }: { v: Vessel; onNavigate: (t: DetailTarget) => void }) {
  const containers = mockContainers.filter(c => c.vesselId === v.id);
  const equipment = mockEquipment.filter(e => e.vesselId === v.id);
  const history = mockActivity.filter(a => a.entityType === "vessel" && a.entityId === v.id);

  return (
    <div className="space-y-5">
      <div className="bg-muted/30 rounded-lg p-4">
        <InfoRow label="Статус" value={
          <span className={`text-xs px-2 py-0.5 rounded border ${v.status === "В пути" ? "bg-sky-50 text-sky-700 border-sky-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}>{v.status}</span>
        } />
        <InfoRow label="Маршрут" value={`${v.portFrom} → ${v.portTo}`} />
        <InfoRow label="Отправление" value={v.departure} />
        <InfoRow label="Прибытие" value={v.arrival} />
        <InfoRow label="Контейнеров" value={v.containers} />
      </div>

      <div>
        <div className="text-xs font-medium text-foreground mb-2">Контейнеры на борту ({containers.length})</div>
        {containers.length > 0 ? (
          <div className="space-y-1.5">
            {containers.map(c => (
              <ContainerRow key={c.id} c={c} onSelect={() => onNavigate({ type: "container", id: c.id })} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground px-3 py-2">Нет контейнеров</p>
        )}
      </div>

      <div>
        <div className="text-xs font-medium text-foreground mb-2">Оборудование ({equipment.length})</div>
        {equipment.length > 0 ? (
          <div className="space-y-1.5">
            {equipment.map(eq => <EquipmentRow key={eq.id} eq={eq} />)}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground px-3 py-2">Нет оборудования</p>
        )}
      </div>

      <div>
        <div className="text-xs font-medium text-foreground mb-2">История</div>
        <ActivityList items={history} />
      </div>
    </div>
  );
}

// ─── Location detail ──────────────────────────────────────────────────────────
function LocationDetail({ loc, onNavigate }: { loc: Location; onNavigate: (t: DetailTarget) => void }) {
  const cfg = locTypeConfig[loc.type];
  const containers = mockContainers.filter(c => c.locationId === loc.id);
  const equipment = mockEquipment.filter(e => e.locationId === loc.id);

  return (
    <div className="space-y-5">
      <div className="bg-muted/30 rounded-lg p-4">
        <InfoRow label="Тип" value={cfg.label} />
        <InfoRow label="Город" value={loc.city} />
        <InfoRow label="Контейнеров" value={loc.containers} />
        <InfoRow label="Оборудования" value={loc.equipment} />
      </div>

      <div>
        <div className="text-xs font-medium text-foreground mb-2">Контейнеры ({containers.length})</div>
        {containers.length > 0 ? (
          <div className="space-y-1.5">
            {containers.map(c => (
              <ContainerRow key={c.id} c={c} onSelect={() => onNavigate({ type: "container", id: c.id })} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground px-3 py-2">Нет контейнеров с привязкой к локации</p>
        )}
      </div>

      <div>
        <div className="text-xs font-medium text-foreground mb-2">Оборудование ({equipment.length})</div>
        {equipment.length > 0 ? (
          <div className="space-y-1.5">
            {equipment.map(eq => <EquipmentRow key={eq.id} eq={eq} />)}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground px-3 py-2">Нет оборудования</p>
        )}
      </div>
    </div>
  );
}

// ─── Transport detail ─────────────────────────────────────────────────────────
function TransportDetail({ t, onNavigate }: { t: Transport; onNavigate: (tgt: DetailTarget) => void }) {
  const containers = mockContainers.filter(c => c.transportId === t.id);

  return (
    <div className="space-y-5">
      <div className="bg-muted/30 rounded-lg p-4">
        <InfoRow label="Тип ТС" value={t.type} />
        <InfoRow label="Водитель" value={t.driver} />
        <InfoRow label="Статус" value={
          <span className={`text-xs px-2 py-0.5 rounded border ${t.status === "В рейсе" ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}>{t.status}</span>
        } />
        <InfoRow label="Маршрут" value={t.route} />
      </div>

      <div>
        <div className="text-xs font-medium text-foreground mb-2">Контейнеры ({containers.length})</div>
        {containers.length > 0 ? (
          <div className="space-y-1.5">
            {containers.map(c => (
              <ContainerRow key={c.id} c={c} onSelect={() => onNavigate({ type: "container", id: c.id })} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground px-3 py-2">Нет контейнеров</p>
        )}
      </div>
    </div>
  );
}

// ─── Wagon detail ─────────────────────────────────────────────────────────────
function WagonDetail({ w, onNavigate }: { w: Wagon; onNavigate: (t: DetailTarget) => void }) {
  const containers = mockContainers.filter(c => c.wagonId === w.id);
  const equipment = mockEquipment.filter(e => e.wagonId === w.id);

  return (
    <div className="space-y-5">
      <div className="bg-muted/30 rounded-lg p-4">
        <InfoRow label="Тип" value={w.type} />
        <InfoRow label="Вместимость" value={`${w.capacity} конт.`} />
        <InfoRow label="Маршрут" value={w.route} />
        <InfoRow label="Отправление" value={w.departure} />
        <InfoRow label="Прибытие" value={w.arrival} />
      </div>

      <div>
        <div className="text-xs font-medium text-foreground mb-2">Контейнеры ({containers.length}/{w.capacity})</div>
        {containers.length > 0 ? (
          <div className="space-y-1.5">
            {containers.map(c => (
              <ContainerRow key={c.id} c={c} onSelect={() => onNavigate({ type: "container", id: c.id })} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground px-3 py-2">Нет контейнеров</p>
        )}
      </div>

      <div>
        <div className="text-xs font-medium text-foreground mb-2">Оборудование ({equipment.length})</div>
        {equipment.length > 0 ? (
          <div className="space-y-1.5">
            {equipment.map(eq => <EquipmentRow key={eq.id} eq={eq} />)}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground px-3 py-2">Нет оборудования</p>
        )}
      </div>
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
    <div className="space-y-5">
      <div className="bg-muted/30 rounded-lg p-4">
        <InfoRow label="Тип" value={eq.type} />
        <InfoRow label="Состояние" value={<span className={`text-xs px-2 py-0.5 rounded border ${statusColor}`}>{eq.status}</span>} />
        <InfoRow label="Следующий ТО" value={eq.nextCheck} />
        <InfoRow label="Срок службы до" value={eq.serviceLife} />
      </div>

      <div>
        <div className="text-xs font-medium text-foreground mb-2">Текущее местоположение</div>
        {vessel && (
          <div onClick={() => onNavigate({ type: "vessel", id: vessel.id })} className="flex items-center gap-2 px-3 py-2.5 bg-sky-50 border border-sky-200 rounded-md cursor-pointer hover:bg-sky-100 transition-colors">
            <Icon name="Ship" size={14} className="text-sky-600" />
            <span className="text-xs font-medium text-sky-700">Судно «{vessel.name}»</span>
            <Icon name="ChevronRight" size={13} className="text-sky-500 ml-auto" />
          </div>
        )}
        {loc && (
          <div onClick={() => onNavigate({ type: "location", id: loc.id })} className="flex items-center gap-2 px-3 py-2.5 bg-primary/5 border border-primary/20 rounded-md cursor-pointer hover:bg-primary/10 transition-colors">
            <Icon name={locTypeConfig[loc.type].icon as "Anchor"} size={14} className="text-primary" />
            <span className="text-xs font-medium text-primary">{loc.name}</span>
            <Icon name="ChevronRight" size={13} className="text-primary/50 ml-auto" />
          </div>
        )}
        {wagon && (
          <div onClick={() => onNavigate({ type: "wagon", id: wagon.id })} className="flex items-center gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-md cursor-pointer hover:bg-amber-100 transition-colors">
            <Icon name="Train" size={14} className="text-amber-600" />
            <span className="text-xs font-medium text-amber-700">Вагон № {wagon.number}</span>
            <Icon name="ChevronRight" size={13} className="text-amber-500 ml-auto" />
          </div>
        )}
        {!vessel && !loc && !wagon && (
          <p className="text-xs text-muted-foreground px-3 py-2">{eq.location}</p>
        )}
      </div>

      <div>
        <div className="text-xs font-medium text-foreground mb-2">История</div>
        <ActivityList items={history} />
      </div>
    </div>
  );
}

// ─── Titles ───────────────────────────────────────────────────────────────────
function getTitle(target: DetailTarget): string {
  switch (target.type) {
    case "container": {
      const c = mockContainers.find(x => x.id === target.id);
      return c ? `Контейнер ${c.number}` : "Контейнер";
    }
    case "vessel": {
      const v = mockVessels.find(x => x.id === target.id);
      return v ? `Судно «${v.name}»` : "Судно";
    }
    case "location": {
      const l = mockLocations.find(x => x.id === target.id);
      return l ? l.name : "Локация";
    }
    case "transport": {
      const t = mockTransport.find(x => x.id === target.id);
      return t ? `Авто ${t.plate}` : "Транспорт";
    }
    case "wagon": {
      const w = wagons.find(x => x.id === target.id);
      return w ? `Вагон № ${w.number}` : "Вагон";
    }
    case "equipment": {
      const e = mockEquipment.find(x => x.id === target.id);
      return e ? e.identifier : "Оборудование";
    }
  }
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function DetailPanel({ target, onClose, onNavigate }: Props) {
  if (!target) return null;

  const renderContent = () => {
    switch (target.type) {
      case "container": {
        const c = mockContainers.find(x => x.id === target.id);
        return c ? <ContainerDetail c={c} onNavigate={onNavigate} /> : null;
      }
      case "vessel": {
        const v = mockVessels.find(x => x.id === target.id);
        return v ? <VesselDetail v={v} onNavigate={onNavigate} /> : null;
      }
      case "location": {
        const l = mockLocations.find(x => x.id === target.id);
        return l ? <LocationDetail loc={l} onNavigate={onNavigate} /> : null;
      }
      case "transport": {
        const t = mockTransport.find(x => x.id === target.id);
        return t ? <TransportDetail t={t} onNavigate={onNavigate} /> : null;
      }
      case "wagon": {
        const w = wagons.find(x => x.id === target.id);
        return w ? <WagonDetail w={w} onNavigate={onNavigate} /> : null;
      }
      case "equipment": {
        const e = mockEquipment.find(x => x.id === target.id);
        return e ? <EquipmentDetail eq={e} onNavigate={onNavigate} /> : null;
      }
    }
  };

  return (
    <Sheet open={!!target} onOpenChange={onClose}>
      <SheetContent className="w-[420px] sm:w-[480px] overflow-y-auto">
        <SheetHeader className="mb-5">
          <SheetTitle className="text-base font-semibold">{getTitle(target)}</SheetTitle>
        </SheetHeader>
        {renderContent()}
      </SheetContent>
    </Sheet>
  );
}
