
export enum UserRole {
  HOMEOWNER = 'HOMEOWNER',
  PROFESSIONAL = 'PROFESSIONAL',
  BOARD_MEMBER = 'BOARD_MEMBER',
  CHAIN_ADMIN = 'CHAIN_ADMIN',
  NONE = 'NONE'
}

export type PropertyCategory = 'Bolig' | 'Næring' | 'Fritid' | 'Industri' | 'Sameie';

export type JobStatus =
  | 'recommended'
  | 'sent'
  | 'draft_proff'
  | 'quoted'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'declined';

export type RiskLevel = 'low' | 'moderate' | 'critical';
export type ValueEffect = 'protect' | 'increase';
export type DriverType = 'maintenance' | 'value';
export type ProjectStrategy = 'repair' | 'modernize' | 'energy';

export interface CreditState {
  balance: number;
  monthlyLimit: number;
  rollover: number;
  plan: 'gratis' | 'aktiv' | 'sameie' | 'portefølje' | 'enterprise';
}

export interface Job {
  id: string;
  propertyId: string;
  userId?: string;
  tittel: string;
  beskrivelse: string;
  adresse: string;
  before_images: string[];
  after_images: string[];
  risk_level: RiskLevel;
  tg_score?: TGScore;
  value_effect: ValueEffect;
  driver: DriverType;
  estimert_kost: number;
  proff_pris?: number;
  status: JobStatus;
  createdAt: string;
  initiatedBy: 'customer' | 'pro';
  roiEstimate?: number;
  enovaSupport?: number;
  horizon?: string;
  priorityScore?: number;
  maintenanceInterval?: number;
  predictedFailureDate?: string;
  contractorName?: string;
  warrantyPeriod?: number;
  strategy?: ProjectStrategy;
  collab_partner?: string;
}

export type EnergyGrade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export interface MatrikkelData {
  address: string;
  gnrBnr: string;
  yearBuilt: number;
  bra: number;
  type: string;
  category: PropertyCategory;
  imageUrl: string;
  energyGrade: EnergyGrade;
  municipality?: string;
  lastAiAnalysisDate?: string;
}

export interface VisionAnalysisResult {
  risk_level: RiskLevel;
  value_effect: ValueEffect;
  driver: DriverType;
  tittel: string;
  beskrivelse: string;
  estimert_kost: number;
  enovaSupport?: number;
  projectType: string;
  plainLanguageGevinst: string;
  findings: {
    technical: string[];
    aesthetic: string[];
    energy: string[];
  };
}

export type TGScore = 0 | 1 | 2 | 3;

export interface BuildingComponent {
  id: string;
  name: string;
  tg: TGScore;
  lastInspected: string;
  statusText: string;
  iconName: string;
}

export interface Measure {
  id: number;
  title: string;
  description?: string;
  why?: string;
  tg: TGScore;
  location: string;
  costMin: number;
  costMax: number;
  status: 'todo' | 'pending_offer' | 'offer_received' | 'scheduled' | 'done';
  valueEffect: ValueEffect;
  roiFactor?: number;
}

export interface Partner {
    id: string;
    name: string;
    specialties: string[];
    serviceAreas: string[];
    rating: number;
    baseMultiplier: number;
    description?: string;
    logo?: string;
}

export interface Offer {
  id: string;
  measureId: number;
  companyName: string;
  price: number;
  description: string;
  earliestStart?: string;
}

export interface DailyWeather {
  date: string;
  dayName: string;
  code: number;
  tempMax: number;
  tempMin: number;
  precip: number;
  windMax: number;
}

export interface BuildingRisk {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  score: number;
  factors: Array<{
    type: string;
    description: string;
    impact: 'positive' | 'negative';
  }>;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'alert';
  linkTo?: string;
}

export interface AgentResponse {
  text: string;
  actions?: Array<{
    label: string;
    actionId: string;
    type: string;
  }>;
}

export interface UserProfile {
  name: string;
  title: string;
  email: string;
  phone: string;
  role: UserRole;
  credits?: CreditState;
  preferences: {
    notifications: string;
    horizon: string;
  };
}

export interface WeatherRecommendation {
  id: string;
  title: string;
  description: string;
  iconName: string;
  type: 'risk' | 'info';
}

export interface Room {
  id: string;
  name: string;
  tg: TGScore;
  propertyId?: string;
}

export interface Resident {
  id: string;
  unitNumber: string;
  tg: TGScore;
  name?: string;
  lastIncident?: string;
}

/* fix: Added missing FDV types used across the app */
export type FDVCategory = 'maintenance' | 'system' | 'upgrade' | 'document';

export interface FDVEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category: FDVCategory;
  performedBy?: string;
  cost?: number;
  warrantyDate?: string;
  nextCheckDate?: string;
  images?: {
    before?: string;
    after?: string;
  };
  fileUrl?: string;
}
