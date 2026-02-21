// ─── Types ───────────────────────────────────────────────────────────────────
export type Section = "dashboard" | "containers" | "locations" | "transport" | "railway" | "vessels" | "equipment" | "users" | "activity" | "map";
export type ContainerStatus = "empty" | "loaded" | "broken" | "unchecked" | "ready";

export interface Container {
  id: string; number: string; type: string; volume: number; year: number;
  status: ContainerStatus; client: string; temp: string; weight: number;
  location: string; lastCheck: string;
  // связи
  vesselId?: string;
  transportId?: string;
  wagonId?: string;
  locationId?: string;
}
export interface Location {
  id: string; name: string; type: "terminal" | "port" | "station";
  city: string; containers: number; equipment: number; coords: [number, number];
}
export interface Transport {
  id: string; plate: string; type: string; driver: string;
  status: string; route: string; containers: string[]; // container numbers
}
export interface Wagon {
  id: string; number: string; type: string; capacity: number;
  route: string; departure: string; arrival: string; containers: string[];
}
export interface Vessel {
  id: string; name: string; portFrom: string; portTo: string;
  departure: string; arrival: string; containers: number; status: string;
  containerIds?: string[]; // container numbers
  equipmentIds?: string[];
}
export interface Equipment {
  id: string; identifier: string; type: string; status: string;
  location: string; serviceLife: string; nextCheck: string;
  vesselId?: string; locationId?: string; wagonId?: string;
}
export interface User {
  id: string; name: string; role: string; department: string; login: string; status: string;
}
export interface ActivityLog {
  id: string; user: string; action: string; object: string; time: string;
  entityType?: string; entityId?: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────
export const mockContainers: Container[] = [
  { id: "1", number: "MRKU3456789", type: "40HC", volume: 76, year: 2019, status: "loaded",    client: "ООО Арктик Трейд", temp: "-18°C", weight: 22400, location: "Порт Владивосток, Терм. 3",  lastCheck: "2026-02-10", locationId: "1" },
  { id: "2", number: "TCKU1234567", type: "20ST", volume: 33, year: 2021, status: "empty",     client: "АО СевТранс",      temp: "-25°C", weight: 2200,  location: "Тыловой терминал №1",       lastCheck: "2026-01-28", locationId: "2" },
  { id: "3", number: "MSCU9876543", type: "40ST", volume: 67, year: 2018, status: "broken",    client: "ИП Морозов",       temp: "0°C",   weight: 18000, location: "Станция Красный Яр",        lastCheck: "2025-12-15", locationId: "4" },
  { id: "4", number: "GESU5551234", type: "40HC", volume: 76, year: 2022, status: "ready",     client: "ООО Полюс Груп",   temp: "-20°C", weight: 24100, location: "Судно «Арктика»",           lastCheck: "2026-02-18", vesselId: "1" },
  { id: "5", number: "HLXU2223456", type: "20ST", volume: 33, year: 2020, status: "unchecked", client: "ЗАО Логистик+",    temp: "-15°C", weight: 1800,  location: "Вагон № 54321",             lastCheck: "2025-11-05", wagonId: "1" },
  { id: "6", number: "CMAU7778901", type: "40HC", volume: 76, year: 2023, status: "loaded",    client: "ООО Арктик Трейд", temp: "-18°C", weight: 21500, location: "Авто А777КМ125",            lastCheck: "2026-02-19", transportId: "1" },
  { id: "7", number: "TRLU4445678", type: "20ST", volume: 33, year: 2017, status: "empty",     client: "АО СевТранс",      temp: "-22°C", weight: 2100,  location: "Порт Санкт-Петербург",      lastCheck: "2026-02-01", locationId: "3" },
];

export const mockLocations: Location[] = [
  { id: "1", name: "Порт Владивосток",         type: "port",     city: "Владивосток",     containers: 42, equipment: 8, coords: [43.1155, 131.8855] },
  { id: "2", name: "Тыловой терминал №1",      type: "terminal", city: "Владивосток",     containers: 18, equipment: 3, coords: [43.1332, 131.9246] },
  { id: "3", name: "Порт Санкт-Петербург",     type: "port",     city: "Санкт-Петербург", containers: 31, equipment: 6, coords: [59.9311, 30.2898]  },
  { id: "4", name: "Станция Красный Яр",       type: "station",  city: "Новосибирск",     containers: 7,  equipment: 2, coords: [54.9924, 82.9155]  },
  { id: "5", name: "Терминал Москва-Товарная", type: "terminal", city: "Москва",          containers: 24, equipment: 4, coords: [55.7558, 37.6176]  },
];

export const mockTransport: Transport[] = [
  { id: "1", plate: "А777КМ125", type: "КАМАЗ 5490", driver: "Иванов С.В.",  status: "В рейсе",    route: "Владивосток → Хабаровск", containers: ["CMAU7778901"] },
  { id: "2", plate: "В234АР777", type: "VOLVO FH",   driver: "Петров А.И.",  status: "На стоянке", route: "—",                       containers: [] },
  { id: "3", plate: "К456ОП199", type: "MAN TGX",    driver: "Смирнов Д.Н.", status: "В рейсе",    route: "Москва → СПб",            containers: ["HLXU2223456"] },
];

export const mockVessels: Vessel[] = [
  { id: "1", name: "Арктика",       portFrom: "Владивосток",     portTo: "Санкт-Петербург", departure: "2026-02-15 08:00", arrival: "2026-03-05 14:00", containers: 28, status: "В пути",  containerIds: ["GESU5551234"], equipmentIds: ["GEN-001"] },
  { id: "2", name: "Полюс",         portFrom: "Санкт-Петербург", portTo: "Владивосток",     departure: "2026-02-20 10:00", arrival: "2026-03-12 09:00", containers: 15, status: "В пути",  containerIds: [], equipmentIds: [] },
  { id: "3", name: "Северный путь", portFrom: "Владивосток",     portTo: "Москва (река)",   departure: "2026-03-01 06:00", arrival: "2026-03-18 16:00", containers: 0,  status: "Ожидает", containerIds: [], equipmentIds: [] },
];

export const mockEquipment: Equipment[] = [
  { id: "1", identifier: "GEN-001", type: "Дженсет Thermo King",  status: "Работает",        location: "Судно «Арктика»",     serviceLife: "2029-06-01", nextCheck: "2026-04-01", vesselId: "1" },
  { id: "2", identifier: "GEN-002", type: "Дженсет Carrier",      status: "Работает",        location: "Порт Владивосток",    serviceLife: "2027-12-01", nextCheck: "2026-03-15", locationId: "1" },
  { id: "3", identifier: "PWR-003", type: "Источник питания ABB", status: "Техобслуживание", location: "Тыловой терминал №1", serviceLife: "2030-01-01", nextCheck: "2026-02-25", locationId: "2" },
  { id: "4", identifier: "GEN-004", type: "Дженсет Thermo King",  status: "Неисправен",      location: "Вагон № 54321",       serviceLife: "2026-08-01", nextCheck: "Требуется ремонт", wagonId: "1" },
];

export const mockUsers: User[] = [
  { id: "1", name: "Александров Игорь Петрович",   role: "Администратор", department: "ИТ",                 login: "i.alexandrov", status: "Активен" },
  { id: "2", name: "Морозова Елена Сергеевна",      role: "Логист",        department: "Логистика",          login: "e.morozova",   status: "Активен" },
  { id: "3", name: "Рыбаков Дмитрий Владимирович", role: "Механик",       department: "Техническая служба", login: "d.rybakov",    status: "Активен" },
  { id: "4", name: "Соколов Андрей Николаевич",     role: "Водитель",      department: "Автотранспорт",      login: "a.sokolov",    status: "Активен" },
];

export const mockActivity: ActivityLog[] = [
  { id: "1", user: "Морозова Е.С.",    action: "Изменён статус",    object: "Контейнер MRKU3456789 → Груженый",        time: "2026-02-21 14:32", entityType: "container", entityId: "1" },
  { id: "2", user: "Рыбаков Д.В.",     action: "Проверка ТО",        object: "Дженсет GEN-001",                         time: "2026-02-21 11:15", entityType: "equipment", entityId: "1" },
  { id: "3", user: "Морозова Е.С.",    action: "Перемещение",         object: "TCKU1234567: СПб → Тыловой терминал №1", time: "2026-02-20 16:47", entityType: "container", entityId: "2" },
  { id: "4", user: "Александров И.П.", action: "Создан пользователь", object: "Соколов А.Н. (Водитель)",                time: "2026-02-20 09:00", entityType: "user",      entityId: "4" },
  { id: "5", user: "Морозова Е.С.",    action: "Добавлен рейс",      object: "Судно «Северный путь»",                   time: "2026-02-19 15:22", entityType: "vessel",    entityId: "3" },
  { id: "6", user: "Рыбаков Д.В.",     action: "Статус изменён",     object: "GEN-004 → Неисправен",                    time: "2026-02-18 10:05", entityType: "equipment", entityId: "4" },
];

export const wagons: Wagon[] = [
  { id: "1", number: "54321-МОС", type: "Рефрижераторный", capacity: 2, route: "Владивосток → Москва",  departure: "2026-02-18", arrival: "2026-02-28", containers: ["HLXU2223456"] },
  { id: "2", number: "67890-НСК", type: "Рефрижераторный", capacity: 2, route: "Москва → Новосибирск", departure: "2026-02-22", arrival: "2026-02-26", containers: [] },
];

// ─── Configs ─────────────────────────────────────────────────────────────────
export const statusConfig: Record<ContainerStatus, { label: string; color: string }> = {
  empty:     { label: "Порожний",          color: "bg-gray-100 text-gray-600 border-gray-200"   },
  loaded:    { label: "Груженый",          color: "bg-green-50 text-green-700 border-green-200" },
  broken:    { label: "Неисправный",       color: "bg-red-50 text-red-700 border-red-200"       },
  unchecked: { label: "Не проверен",       color: "bg-amber-50 text-amber-700 border-amber-200" },
  ready:     { label: "Годен к перевозке", color: "bg-sky-50 text-sky-700 border-sky-200"       },
};

export const locTypeConfig: Record<string, { label: string; icon: string }> = {
  port:     { label: "Порт",              icon: "Anchor"    },
  terminal: { label: "Тыловой терминал", icon: "Warehouse" },
  station:  { label: "Станция",          icon: "Train"     },
};

export const navItems: { id: Section; label: string; icon: string; count?: number }[] = [
  { id: "dashboard",  label: "Дашборд",        icon: "LayoutDashboard" },
  { id: "containers", label: "Контейнеры",     icon: "Package",         count: 7 },
  { id: "locations",  label: "Локации",         icon: "MapPin",          count: 5 },
  { id: "transport",  label: "Автотранспорт",   icon: "Truck",           count: 3 },
  { id: "railway",    label: "ЖД составы",      icon: "Train",           count: 2 },
  { id: "vessels",    label: "Суда",            icon: "Ship",            count: 3 },
  { id: "equipment",  label: "Оборудование",    icon: "Zap",             count: 4 },
  { id: "map",        label: "Карта",           icon: "Map"              },
  { id: "users",      label: "Пользователи",    icon: "Users",           count: 4 },
  { id: "activity",   label: "Журнал действий", icon: "ScrollText"       },
];
