import { useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionHeader } from "@/components/logistics/Shared";
import { DetailTarget } from "@/components/logistics/DetailPanel";
import { AddLocationDialog, AddTransportDialog, AddRailwayDialog, AddVesselDialog } from "@/components/logistics/Dialogs";
import { mockLocations, mockTransport, mockVessels, wagons, locTypeConfig } from "@/data/mockData";

interface SectionProps {
  onSelect: (target: DetailTarget) => void;
}

export function LocationsSection({ onSelect }: SectionProps) {
  const [dialog, setDialog] = useState(false);
  return (
    <div className="space-y-5 animate-fade-in">
      <AddLocationDialog open={dialog} onClose={() => setDialog(false)} />
      <SectionHeader title="Локации" action="Добавить локацию" onAction={() => setDialog(true)} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockLocations.map(loc => {
          const cfg = locTypeConfig[loc.type];
          return (
            <div
              key={loc.id}
              onClick={() => onSelect({ type: "location", id: loc.id })}
              className="bg-white rounded-lg border border-border p-5 hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name={cfg.icon as "Anchor"} size={13} className="text-primary" />
                    <span className="text-xs text-muted-foreground">{cfg.label}</span>
                  </div>
                  <div className="font-medium text-foreground text-sm">{loc.name}</div>
                  <div className="text-xs text-muted-foreground">{loc.city}</div>
                </div>
                <Icon name="ChevronRight" size={15} className="text-muted-foreground/40 mt-1" />
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

export function TransportSection({ onSelect }: SectionProps) {
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
              <tr
                key={t.id}
                onClick={() => onSelect({ type: "transport", id: t.id })}
                className={`border-b border-border last:border-0 hover:bg-primary/5 transition-colors cursor-pointer ${i % 2 ? "bg-muted/10" : ""}`}
              >
                <td className="px-4 py-3 font-mono-ibm text-xs font-medium text-foreground">{t.plate}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{t.type}</td>
                <td className="px-4 py-3 text-xs text-foreground">{t.driver}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded border ${t.status === "В рейсе" ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}>{t.status}</span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{t.route}</td>
                <td className="px-4 py-3 text-xs font-mono-ibm text-muted-foreground">{t.containers.length > 0 ? t.containers.join(", ") : "—"}</td>
                <td className="px-4 py-3"><Icon name="ChevronRight" size={14} className="text-muted-foreground/40" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function RailwaySection({ onSelect }: SectionProps) {
  const [dialog, setDialog] = useState(false);
  return (
    <div className="space-y-5 animate-fade-in">
      <AddRailwayDialog open={dialog} onClose={() => setDialog(false)} />
      <SectionHeader title="ЖД составы" action="Добавить вагон" onAction={() => setDialog(true)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wagons.map(w => (
          <div
            key={w.id}
            onClick={() => onSelect({ type: "wagon", id: w.id })}
            className="bg-white rounded-lg border border-border p-5 hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-mono-ibm text-sm font-medium text-foreground">Вагон № {w.number}</div>
                <div className="text-xs text-muted-foreground">{w.type}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded border ${w.containers.length > 0 ? "bg-sky-50 text-sky-700 border-sky-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}>
                  {w.containers.length}/{w.capacity} конт.
                </span>
                <Icon name="ChevronRight" size={14} className="text-muted-foreground/40" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <Icon name="ArrowRight" size={12} /><span>{w.route}</span>
            </div>
            <div className="flex gap-6 text-xs pt-3 border-t border-border">
              <div><span className="text-foreground font-medium">Отпр: </span>{w.departure}</div>
              <div><span className="text-foreground font-medium">Приб: </span>{w.arrival}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function VesselsSection({ onSelect }: SectionProps) {
  const [dialog, setDialog] = useState(false);
  return (
    <div className="space-y-5 animate-fade-in">
      <AddVesselDialog open={dialog} onClose={() => setDialog(false)} />
      <SectionHeader title="Суда" action="Добавить судно" onAction={() => setDialog(true)} />
      <div className="space-y-3">
        {mockVessels.map(v => (
          <div
            key={v.id}
            onClick={() => onSelect({ type: "vessel", id: v.id })}
            className="bg-white rounded-lg border border-border p-5 hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-medium text-foreground">«{v.name}»</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span>{v.portFrom}</span><Icon name="ArrowRight" size={12} /><span>{v.portTo}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded border ${v.status === "В пути" ? "bg-sky-50 text-sky-700 border-sky-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}>{v.status}</span>
                <Icon name="ChevronRight" size={14} className="text-muted-foreground/40" />
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
