import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/logistics/Shared";
import { DetailTarget } from "@/components/logistics/DetailPanel";
import { AddEquipmentDialog, AddUserDialog } from "@/components/logistics/Dialogs";
import { mockEquipment, mockUsers, mockActivity, mockLocations, locTypeConfig } from "@/data/mockData";

interface SectionProps {
  onSelect: (target: DetailTarget) => void;
}

export function EquipmentSection({ onSelect }: SectionProps) {
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
              <tr
                key={eq.id}
                onClick={() => onSelect({ type: "equipment", id: eq.id })}
                className={`border-b border-border last:border-0 hover:bg-primary/5 transition-colors cursor-pointer ${i % 2 ? "bg-muted/10" : ""}`}
              >
                <td className="px-4 py-3 font-mono-ibm text-xs font-medium text-foreground">{eq.identifier}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{eq.type}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded border ${eq.status === "Неисправен" ? "bg-red-50 text-red-700 border-red-200" : eq.status === "Техобслуживание" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-green-50 text-green-700 border-green-200"}`}>{eq.status}</span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{eq.location}</td>
                <td className="px-4 py-3 text-xs font-mono-ibm text-foreground">{eq.nextCheck}</td>
                <td className="px-4 py-3 text-xs font-mono-ibm text-muted-foreground">{eq.serviceLife}</td>
                <td className="px-4 py-3"><Icon name="ChevronRight" size={14} className="text-muted-foreground/40" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function UsersSection({ onSelect: _ }: SectionProps) {
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
                <td className="px-4 py-3">
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Icon name="MoreHorizontal" size={14} /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ActivitySection({ onSelect }: SectionProps) {
  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Журнал действий" />
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {["Время", "Пользователь", "Действие", "Объект", ""].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockActivity.map((a, i) => (
              <tr
                key={a.id}
                onClick={() => {
                  if (a.entityType && a.entityId) {
                    const typeMap: Record<string, DetailTarget["type"]> = {
                      container: "container", equipment: "equipment",
                      vessel: "vessel", user: "container",
                    };
                    const t = typeMap[a.entityType];
                    if (t) onSelect({ type: t, id: a.entityId });
                  }
                }}
                className={`border-b border-border last:border-0 hover:bg-primary/5 transition-colors ${a.entityType ? "cursor-pointer" : ""} ${i % 2 ? "bg-muted/10" : ""}`}
              >
                <td className="px-4 py-3 font-mono-ibm text-xs text-muted-foreground whitespace-nowrap">{a.time}</td>
                <td className="px-4 py-3 text-xs font-medium text-foreground">{a.user}</td>
                <td className="px-4 py-3 text-xs text-primary">{a.action}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{a.object}</td>
                <td className="px-4 py-3">
                  {a.entityType && <Icon name="ChevronRight" size={14} className="text-muted-foreground/40" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function MapSection({ onSelect }: SectionProps) {
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
              <div
                key={loc.id}
                className="absolute group cursor-pointer"
                style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
                onClick={() => onSelect({ type: "location", id: loc.id })}
              >
                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-primary border-2 border-white shadow-lg flex items-center justify-center hover:scale-125 transition-transform">
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
            <div className="text-center opacity-20">
              <Icon name="Map" size={48} className="mx-auto mb-2 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border bg-muted/20">
          <div className="flex flex-wrap gap-2">
            {mockLocations.map(loc => {
              const cfg = locTypeConfig[loc.type];
              return (
                <div
                  key={loc.id}
                  onClick={() => onSelect({ type: "location", id: loc.id })}
                  className="flex items-center gap-1.5 text-xs bg-white border border-border rounded-md px-2.5 py-1.5 hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer"
                >
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
