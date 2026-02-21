import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { ContainerStatus, statusConfig } from "@/data/mockData";

export function StatusBadge({ status }: { status: ContainerStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

export function StatCard({ label, value, icon, sub, accent }: {
  label: string; value: string | number; icon: string; sub?: string; accent?: string;
}) {
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

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {action && (
        <Button size="sm" onClick={onAction} className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-8">
          <Icon name="Plus" size={14} className="mr-1" />
          {action}
        </Button>
      )}
    </div>
  );
}