
import { UserRole } from './types';

export const APP_NAME = "ERA OS";

export const BRAND_DEFINITION = {
  primary: "ERA er KI-en som sikrer og utvikler dine eiendomsverdier.",
  explanation: "ERA analyserer eiendom og bygg, prioriterer riktige tiltak og kobler behov direkte til utførelse – med dokumentert verdi over tid.",
  subtext: "ERA identifiserer risiko og anbefaler riktige tiltak før små avvik blir kostbare problemer.",
  process: ["Analyse", "Anbefaling", "Utførelse", "Dokumentasjon"]
};

export const ROLE_CONFIG = {
  [UserRole.HOMEOWNER]: {
    label: "Eiendomsbesitter",
    description: "Beskyttelse og utvikling av eiendomsverdier. Identifisering av risiko."
  },
  [UserRole.PROFESSIONAL]: {
    label: "Fagpartner",
    description: "Presist definerte jobber. Mindre friksjon. Bedre kvalitet."
  },
  [UserRole.CHAIN_ADMIN]: {
    label: "Admin",
    description: "Systemadministrasjon."
  },
  [UserRole.NONE]: {
    label: "Gjest",
    description: ""
  }
};

export const RBAC_CONFIG = {
    [UserRole.HOMEOWNER]: {
        canScan: true,
        canOrder: true,
        canViewHistory: true,
        canManageLeads: false
    },
    [UserRole.PROFESSIONAL]: {
        canScan: true,
        canOrder: false,
        canViewHistory: false,
        canManageLeads: true
    },
    [UserRole.CHAIN_ADMIN]: {
        canScan: false,
        canOrder: false,
        canViewHistory: true,
        canManageLeads: true
    },
    [UserRole.NONE]: {
        canScan: false,
        canOrder: false,
        canViewHistory: false,
        canManageLeads: false
    }
};

export const MOCK_MATRIKKEL = {
  address: "Eksempelveien 12, 0123 Oslo",
  gnrBnr: "42/105",
  yearBuilt: 1985,
  bra: 145,
  type: "Enebolig"
};

export const TG_COLORS = {
  0: "bg-green-500",
  1: "bg-green-400",
  2: "bg-amber-500",
  3: "bg-red-600"
};
