export type Category =
  | "obra"
  | "basura"
  | "agua"
  | "luz"
  | "ambiente"
  | "pista"
  | "parque"
  | "seguridad"
  | "propuesta"
  | "otro";

export type ReportStatus = "active" | "pending" | "resolved" | "critical";

export const CATEGORY_LABEL: Record<Category, string> = {
  obra: "Obra paralizada",
  basura: "Basura / residuos",
  agua: "Agua / desagüe",
  luz: "Alumbrado",
  ambiente: "Contaminación",
  pista: "Pista / vereda",
  parque: "Parque / área verde",
  seguridad: "Inseguridad",
  propuesta: "Propuesta vecinal",
  otro: "Otro",
};

export const CATEGORY_ICON: Record<Category, string> = {
  obra: "🏗️",
  basura: "🗑️",
  agua: "💧",
  luz: "💡",
  ambiente: "🌿",
  pista: "🛣️",
  parque: "🌳",
  seguridad: "🚨",
  propuesta: "💡",
  otro: "📋",
};

export const STATUS_LABEL: Record<ReportStatus, string> = {
  active: "Activo",
  pending: "Pendiente respuesta",
  resolved: "Resuelto",
  critical: "Sin respuesta (30+ días)",
};

export interface StateData {
  responsible?: string;
  infobras?: string;
  budget?: string;
  progress?: number;
  daysInactive?: number;
  source?: string;
  found: boolean;
  critical?: boolean;
  note?: string;
}

export interface Report {
  id: string;
  title: string;
  category: Category;
  status: ReportStatus;
  address: string;
  district: string;
  date: string;
  description: string;
  photo: string;
  supports: number;
  // Map position (% within map container)
  x: number;
  y: number;
  stateData: StateData;
  expediente?: string;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  address: string;
  district: string;
  date: string;
  supports: number;
  x: number;
  y: number;
  status: "petition" | "convertible" | "active";
  stateData: StateData;
}

export const MOCK_REPORTS: Report[] = [
  {
    id: "r-001",
    title: "Obra de pista paralizada en Av. Próceres",
    category: "obra",
    status: "critical",
    address: "Av. Próceres de la Independencia 1820",
    district: "San Juan de Lurigancho",
    date: "2025-03-24",
    description:
      "La obra de mejoramiento de pista lleva más de tres meses paralizada. Hay materiales abandonados, zanjas abiertas y riesgo para peatones y vehículos.",
    photo:
      "https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?w=1200&q=80&auto=format&fit=crop",
    supports: 16,
    x: 62,
    y: 28,
    stateData: {
      found: true,
      critical: true,
      responsible: "Municipalidad Distrital de San Juan de Lurigancho",
      infobras: "12394",
      budget: "S/. 480,000",
      progress: 20,
      daysInactive: 94,
      source: "INFOBRAS · MEF Consulta Amigable",
    },
  },
  {
    id: "r-002",
    title: "Basura acumulada frente al Mercado Ceres",
    category: "basura",
    status: "active",
    address: "Jr. Las Magnolias cdra. 4",
    district: "Ate",
    date: "2025-06-12",
    description:
      "Acumulación constante de residuos sólidos a un costado del mercado. No hay recojo desde hace varios días.",
    photo:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200&q=80&auto=format&fit=crop",
    supports: 8,
    x: 48,
    y: 52,
    stateData: {
      found: true,
      responsible: "Municipalidad Distrital de Ate",
      source: "Portal de Transparencia Municipal",
      note: "Servicio de limpieza pública registrado en el distrito.",
    },
  },
  {
    id: "r-003",
    title: "Alumbrado público dañado en parque vecinal",
    category: "luz",
    status: "pending",
    address: "Parque Los Olivos, Mz. F",
    district: "Los Olivos",
    date: "2025-06-18",
    description:
      "Tres postes del parque no encienden hace semanas. El parque queda completamente a oscuras y se han reportado robos.",
    photo:
      "https://images.unsplash.com/photo-1519750013411-d23d44e470a2?w=1200&q=80&auto=format&fit=crop",
    supports: 11,
    x: 30,
    y: 22,
    stateData: {
      found: true,
      responsible: "Enel Distribución Perú · Municipalidad de Los Olivos",
      source: "OSINERGMIN · Portal Municipal",
    },
  },
  {
    id: "r-004",
    title: "Pista rota cerca de I.E. José Olaya",
    category: "pista",
    status: "active",
    address: "Calle Las Acacias 215",
    district: "Comas",
    date: "2025-06-20",
    description:
      "Hueco profundo en la pista a 30 metros del colegio. Riesgo alto para escolares y vehículos en horas de salida.",
    photo:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d6?w=1200&q=80&auto=format&fit=crop",
    supports: 5,
    x: 22,
    y: 64,
    stateData: {
      found: false,
      note: "No se encontró obra registrada en INFOBRAS para esta dirección.",
    },
  },
];

export const MOCK_PROPOSALS: Proposal[] = [
  {
    id: "p-001",
    title: "Ciclovía en Av. Universitaria",
    description:
      "Proponemos una ciclovía segregada en Av. Universitaria que conecte San Miguel con Los Olivos para reducir accidentes y promover movilidad sostenible.",
    address: "Av. Universitaria, tramo Norte",
    district: "Lima Norte",
    date: "2025-05-30",
    supports: 23,
    x: 40,
    y: 38,
    status: "convertible",
    stateData: {
      found: true,
      critical: true,
      responsible: "Municipalidad Metropolitana de Lima",
      infobras: "8821",
      budget: "S/. 2,300,000",
      progress: 0,
      daysInactive: 210,
      source: "INFOBRAS · MEF",
      note: "Proyecto aprobado con presupuesto asignado sin ejecución.",
    },
  },
  {
    id: "p-002",
    title: "Nuevo punto de reciclaje vecinal",
    description:
      "Habilitar un punto vecinal de reciclaje (papel, vidrio, plástico) con recojo semanal coordinado con la municipalidad.",
    address: "Parque 12 de Octubre",
    district: "San Borja",
    date: "2025-06-14",
    supports: 9,
    x: 70,
    y: 60,
    status: "petition",
    stateData: {
      found: false,
      note: "No se encontró proyecto público asociado.",
    },
  },
];

export const SUPPORT_THRESHOLD = 15;
