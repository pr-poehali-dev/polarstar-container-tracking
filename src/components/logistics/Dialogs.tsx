import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ─── Generic form field helpers ───────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-foreground">{label}</Label>
      {children}
    </div>
  );
}

function TextInput({ placeholder, value, onChange }: { placeholder?: string; value: string; onChange: (v: string) => void }) {
  return <Input className="h-9 text-sm" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />;
}

function Sel({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
      <SelectContent>
        {options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

function DialogFooter({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  return (
    <div className="flex justify-end gap-2 pt-2 border-t border-border mt-4">
      <Button variant="ghost" size="sm" onClick={onClose} className="h-8 text-xs">Отмена</Button>
      <Button size="sm" onClick={onSave} className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90">Сохранить</Button>
    </div>
  );
}

// ─── Container Dialog ─────────────────────────────────────────────────────────
export function AddContainerDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ number: "", type: "40HC", volume: "76", year: "", status: "empty", client: "", temp: "-18°C", weight: "", location: "" });
  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle className="text-base">Добавить контейнер</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <Field label="Номер контейнера"><TextInput placeholder="MRKU1234567" value={form.number} onChange={set("number")} /></Field>
          <Field label="Тип"><Sel value={form.type} onChange={set("type")} options={["20ST", "40ST", "40HC", "45HC"]} /></Field>
          <Field label="Объём (м³)"><TextInput placeholder="76" value={form.volume} onChange={set("volume")} /></Field>
          <Field label="Год выпуска"><TextInput placeholder="2022" value={form.year} onChange={set("year")} /></Field>
          <Field label="Статус">
            <Sel value={form.status} onChange={set("status")} options={["empty", "loaded", "broken", "unchecked", "ready"]} />
          </Field>
          <Field label="Температурный режим"><TextInput placeholder="-18°C" value={form.temp} onChange={set("temp")} /></Field>
          <Field label="Клиент"><TextInput placeholder="ООО Название" value={form.client} onChange={set("client")} /></Field>
          <Field label="Вес (кг)"><TextInput placeholder="22400" value={form.weight} onChange={set("weight")} /></Field>
          <div className="col-span-2">
            <Field label="Текущее местоположение"><TextInput placeholder="Порт Владивосток, Терм. 3" value={form.location} onChange={set("location")} /></Field>
          </div>
        </div>
        <DialogFooter onClose={onClose} onSave={onClose} />
      </DialogContent>
    </Dialog>
  );
}

// ─── Location Dialog ──────────────────────────────────────────────────────────
export function AddLocationDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", type: "port", city: "" });
  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="text-base">Добавить локацию</DialogTitle></DialogHeader>
        <div className="space-y-4 mt-2">
          <Field label="Название"><TextInput placeholder="Порт Новороссийск" value={form.name} onChange={set("name")} /></Field>
          <Field label="Тип">
            <Sel value={form.type} onChange={set("type")} options={["port", "terminal", "station"]} />
          </Field>
          <Field label="Город"><TextInput placeholder="Новороссийск" value={form.city} onChange={set("city")} /></Field>
        </div>
        <DialogFooter onClose={onClose} onSave={onClose} />
      </DialogContent>
    </Dialog>
  );
}

// ─── Transport Dialog ─────────────────────────────────────────────────────────
export function AddTransportDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ plate: "", type: "", driver: "", status: "На стоянке", route: "" });
  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="text-base">Добавить транспорт</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <Field label="Госномер"><TextInput placeholder="А000АА000" value={form.plate} onChange={set("plate")} /></Field>
          <Field label="Тип ТС"><TextInput placeholder="КАМАЗ 5490" value={form.type} onChange={set("type")} /></Field>
          <Field label="Водитель"><TextInput placeholder="Иванов И.И." value={form.driver} onChange={set("driver")} /></Field>
          <Field label="Статус">
            <Sel value={form.status} onChange={set("status")} options={["В рейсе", "На стоянке", "Ремонт"]} />
          </Field>
          <div className="col-span-2">
            <Field label="Маршрут"><TextInput placeholder="Владивосток → Хабаровск" value={form.route} onChange={set("route")} /></Field>
          </div>
        </div>
        <DialogFooter onClose={onClose} onSave={onClose} />
      </DialogContent>
    </Dialog>
  );
}

// ─── Railway Dialog ───────────────────────────────────────────────────────────
export function AddRailwayDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ number: "", type: "Рефрижераторный", capacity: "2", route: "", departure: "", arrival: "" });
  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="text-base">Добавить вагон</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <Field label="Номер вагона"><TextInput placeholder="54321-МОС" value={form.number} onChange={set("number")} /></Field>
          <Field label="Тип"><Sel value={form.type} onChange={set("type")} options={["Рефрижераторный", "Изотермический", "Крытый"]} /></Field>
          <Field label="Вместимость (конт.)"><Sel value={form.capacity} onChange={set("capacity")} options={["1", "2"]} /></Field>
          <Field label="Маршрут">
            <Sel value={form.route} onChange={set("route")} options={["Владивосток → Москва", "Владивосток → Санкт-Петербург", "Владивосток → Новосибирск", "Москва → Новосибирск"]} />
          </Field>
          <Field label="Дата отправления"><TextInput placeholder="2026-03-01" value={form.departure} onChange={set("departure")} /></Field>
          <Field label="Дата прибытия"><TextInput placeholder="2026-03-10" value={form.arrival} onChange={set("arrival")} /></Field>
        </div>
        <DialogFooter onClose={onClose} onSave={onClose} />
      </DialogContent>
    </Dialog>
  );
}

// ─── Vessel Dialog ────────────────────────────────────────────────────────────
export function AddVesselDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", portFrom: "", portTo: "", departure: "", arrival: "", status: "Ожидает" });
  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));
  const ports = ["Владивосток", "Санкт-Петербург", "Москва (река)", "Мурманск", "Новороссийск"];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="text-base">Добавить судно</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="col-span-2">
            <Field label="Название судна"><TextInput placeholder="Арктика" value={form.name} onChange={set("name")} /></Field>
          </div>
          <Field label="Порт отправления"><Sel value={form.portFrom} onChange={set("portFrom")} options={ports} /></Field>
          <Field label="Порт прибытия"><Sel value={form.portTo} onChange={set("portTo")} options={ports} /></Field>
          <Field label="Время отправления"><TextInput placeholder="2026-03-01 08:00" value={form.departure} onChange={set("departure")} /></Field>
          <Field label="Время прибытия"><TextInput placeholder="2026-03-15 14:00" value={form.arrival} onChange={set("arrival")} /></Field>
          <div className="col-span-2">
            <Field label="Статус"><Sel value={form.status} onChange={set("status")} options={["Ожидает", "В пути", "Прибыл"]} /></Field>
          </div>
        </div>
        <DialogFooter onClose={onClose} onSave={onClose} />
      </DialogContent>
    </Dialog>
  );
}

// ─── Equipment Dialog ─────────────────────────────────────────────────────────
export function AddEquipmentDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ identifier: "", type: "Дженсет Thermo King", status: "Работает", location: "", serviceLife: "", nextCheck: "" });
  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="text-base">Добавить оборудование</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <Field label="Идентификатор"><TextInput placeholder="GEN-005" value={form.identifier} onChange={set("identifier")} /></Field>
          <Field label="Тип">
            <Sel value={form.type} onChange={set("type")} options={["Дженсет Thermo King", "Дженсет Carrier", "Источник питания ABB", "Источник питания Schneider", "Прочее оборудование"]} />
          </Field>
          <Field label="Состояние">
            <Sel value={form.status} onChange={set("status")} options={["Работает", "Техобслуживание", "Неисправен", "На складе"]} />
          </Field>
          <Field label="Локация"><TextInput placeholder="Порт Владивосток" value={form.location} onChange={set("location")} /></Field>
          <Field label="Следующий ТО"><TextInput placeholder="2026-06-01" value={form.nextCheck} onChange={set("nextCheck")} /></Field>
          <Field label="Срок службы до"><TextInput placeholder="2030-01-01" value={form.serviceLife} onChange={set("serviceLife")} /></Field>
        </div>
        <DialogFooter onClose={onClose} onSave={onClose} />
      </DialogContent>
    </Dialog>
  );
}

// ─── User Dialog ──────────────────────────────────────────────────────────────
export function AddUserDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", role: "Логист", department: "", login: "", password: "" });
  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="text-base">Добавить пользователя</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="col-span-2">
            <Field label="ФИО"><TextInput placeholder="Иванов Иван Иванович" value={form.name} onChange={set("name")} /></Field>
          </div>
          <Field label="Роль">
            <Sel value={form.role} onChange={set("role")} options={["Администратор", "Логист", "Механик", "Водитель", "Диспетчер"]} />
          </Field>
          <Field label="Отдел"><TextInput placeholder="Логистика" value={form.department} onChange={set("department")} /></Field>
          <Field label="Логин"><TextInput placeholder="i.ivanov" value={form.login} onChange={set("login")} /></Field>
          <Field label="Пароль"><TextInput placeholder="••••••••" value={form.password} onChange={set("password")} /></Field>
        </div>
        <DialogFooter onClose={onClose} onSave={onClose} />
      </DialogContent>
    </Dialog>
  );
}
