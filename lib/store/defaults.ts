
import { FDVEvent, UserRole, Job, BuildingComponent, Partner } from '../../types';

export const DEFAULT_JOBS: Job[] = [
    {
        id: 'j1',
        propertyId: 'p1',
        userId: 'u1',
        tittel: 'Kritisk Utbedring: VVB',
        beskrivelse: 'Varmtvannsbereder har passert teknisk levealder (22 år). Signifikant risiko for lekkasje i teknisk rom.',
        adresse: 'Eksempelveien 12',
        before_images: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"],
        after_images: [],
        risk_level: 'critical',
        tg_score: 3,
        value_effect: 'protect',
        driver: 'maintenance',
        estimert_kost: 14500,
        status: 'recommended',
        createdAt: new Date().toISOString(),
        /* fix: added missing initiatedBy property */
        initiatedBy: 'customer',
        predictedFailureDate: 'Februar 2025',
        horizon: 'Nå'
    },
    {
        id: 'j2',
        propertyId: 'p1',
        tittel: 'Varmepumpe (Luft-til-vann)',
        beskrivelse: 'Erstatt elektrisk oppvarming med et energieffektivt luft-til-vann system for lavere strømregning og høyere komfort.',
        adresse: 'Eksempelveien 12',
        before_images: [],
        after_images: [],
        risk_level: 'low',
        tg_score: 1,
        value_effect: 'increase',
        driver: 'value',
        estimert_kost: 125000,
        enovaSupport: 10000,
        status: 'recommended',
        createdAt: new Date().toISOString(),
        /* fix: added missing initiatedBy property */
        initiatedBy: 'customer',
        horizon: '1-2 år',
        priorityScore: 85
    },
    {
        id: 'j3',
        propertyId: 'p1',
        tittel: 'Etterisolering av loft',
        beskrivelse: 'Reduser varmetap betraktelig ved å legge 20cm ekstra isolasjon på loftet. Et av de mest lønnsomme enkelttiltakene.',
        adresse: 'Eksempelveien 12',
        before_images: [],
        after_images: [],
        risk_level: 'moderate',
        tg_score: 2,
        value_effect: 'increase',
        driver: 'value',
        estimert_kost: 35000,
        enovaSupport: 5000,
        status: 'recommended',
        createdAt: new Date().toISOString(),
        /* fix: added missing initiatedBy property */
        initiatedBy: 'customer',
        horizon: 'Neste vinter',
        priorityScore: 92
    },
    {
        id: 'j4',
        propertyId: 'p1',
        tittel: 'Utskifting av vinduer (3-lags)',
        beskrivelse: 'Bytt ut eldre 2-lags vinduer med moderne 3-lags lavenergivinduer for bedre isolering og støydemping.',
        adresse: 'Eksempelveien 12',
        before_images: [],
        after_images: [],
        risk_level: 'moderate',
        tg_score: 2,
        value_effect: 'increase',
        driver: 'value',
        estimert_kost: 85000,
        enovaSupport: 15000,
        status: 'recommended',
        createdAt: new Date().toISOString(),
        /* fix: added missing initiatedBy property */
        initiatedBy: 'customer',
        horizon: '2-5 år',
        priorityScore: 78
    },
    {
        id: 'j5',
        propertyId: 'p1',
        tittel: 'Solcelleanlegg (8kWp)',
        beskrivelse: 'Produser din egen strøm. Inkluderer montering og tilkobling til strømnettet. Utløser høy Enova-støtte.',
        adresse: 'Eksempelveien 12',
        before_images: [],
        after_images: [],
        risk_level: 'low',
        tg_score: 0,
        value_effect: 'increase',
        driver: 'value',
        estimert_kost: 145000,
        enovaSupport: 32500,
        status: 'recommended',
        createdAt: new Date().toISOString(),
        /* fix: added missing initiatedBy property */
        initiatedBy: 'customer',
        horizon: 'Sommer 2025',
        priorityScore: 88
    }
];

export const MOCK_PARTNERS: Partner[] = [
    {
        id: 'p-mal-1',
        name: 'Mesterfarge Oslo AS',
        specialties: ['maling', 'fasade', 'interiør'],
        serviceAreas: ['Oslo', 'Bærum', 'Asker'],
        rating: 4.8,
        baseMultiplier: 0.95,
        description: "Spesialister på utvendig og innvendig malerarbeid med over 20 års erfaring. Vi garanterer fagmessig utførelse iht. god malerskikk."
    },
    {
        id: 'p-vvs-1',
        name: 'Rørlegger-Vakten Teknikk',
        specialties: ['vvs', 'vvb', 'oppvarming', 'varmepumpe'],
        serviceAreas: ['Oslo', 'Lillestrøm', 'Drammen'],
        rating: 4.9,
        baseMultiplier: 1.05,
        description: "Din totalleverandør av rørleggertjenester. Vi har døgnvakt og spesialkompetanse på varmepumper og modernisering av bad."
    },
    {
        id: 'p-sne-1',
        name: 'Oslo Snekker & Tak',
        specialties: ['snekker', 'vindu', 'isolering', 'tak'],
        serviceAreas: ['Oslo', 'Follo'],
        rating: 4.7,
        baseMultiplier: 1.0,
        description: "Vi tar på oss alt fra små reparasjoner til større rehabilitering av tak og fasader. Fokus på energieffektive løsninger."
    },
    {
        id: 'p-sol-1',
        name: 'Nordic Solar Solutions',
        specialties: ['solcelle', 'elektro', 'enova'],
        serviceAreas: ['Hele Landet'],
        rating: 4.6,
        baseMultiplier: 1.1,
        description: "Ledende på solceller og smarthus-løsninger. Vi hjelper deg gjennom hele prosessen, fra Enova-søknad til ferdig anlegg."
    },
    {
        id: 'p-mur-1',
        name: 'Murergutta AS',
        specialties: ['murer', 'flis', 'piperehab'],
        serviceAreas: ['Oslo', 'Asker'],
        rating: 4.5,
        baseMultiplier: 1.0,
        description: "Kvalitetsarbeid innen mur, puss og flis. Spesialister på rehabilitering av skorstein og ildsted."
    }
];

export const BUILDING_COMPONENTS: BuildingComponent[] = [
    { id: 'c1', name: 'Fasade & Skall', tg: 2, lastInspected: '2023-10-12', statusText: 'Maling slitt (sørvegg)', iconName: 'Home' },
    { id: 'c2', name: 'Tak & Drenering', tg: 1, lastInspected: '2024-01-15', statusText: 'Optimal funksjon', iconName: 'CloudRain' },
    { id: 'c3', name: 'VVS & Rør', tg: 3, lastInspected: '2023-11-01', statusText: 'Utdatert bereder', iconName: 'Droplets' },
    { id: 'c4', name: 'El-anlegg', tg: 1, lastInspected: '2024-02-20', statusText: 'Sertifisert 2024', iconName: 'Zap' },
    { id: 'c5', name: 'Ventilasjon', tg: 2, lastInspected: '2023-08-10', statusText: 'Bør rense kanaler', iconName: 'Wind' },
    { id: 'c6', name: 'Oppvarming', tg: 2, lastInspected: '2024-01-05', statusText: 'Panelovner (Inneffektiv)', iconName: 'Thermometer' },
    { id: 'c7', name: 'Vinduer & Dører', tg: 2, lastInspected: '2023-12-15', statusText: 'Punktert glass (stue)', iconName: 'Sunset' },
    { id: 'c8', name: 'Brannsikring', tg: 1, lastInspected: '2024-01-20', statusText: 'Batterier skiftet', iconName: 'ShieldAlert' },
];

export const DEFAULT_FDV_EVENTS: FDVEvent[] = [
    { id: '101', date: '15.01.2024', title: 'Service: Varmepumpe', description: 'Rens av filter og teknisk sjekk av utedel.', category: 'system', performedBy: 'KlimaService AS', cost: 2400 },
];

export const DEFAULT_USER_PROFILE = {
    name: 'Ola Nordmann',
    title: 'Eiendomsbesitter',
    email: 'ola@nordmann.no',
    phone: '987 65 432',
    role: UserRole.HOMEOWNER,
    preferences: { notifications: 'normal', horizon: 'now' }
};

export const DEFAULT_MATRIKKEL = {
    address: "Eksempelveien 12, 0123 Oslo",
    gnrBnr: "42/105",
    yearBuilt: 1985,
    bra: 145,
    type: "Enebolig",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    energyGrade: 'C' as any,
    municipality: 'Oslo',
    lastAiAnalysisDate: '24.02.2024'
};
