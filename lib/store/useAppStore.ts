
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserRole, Job, JobStatus, VisionAnalysisResult, FDVEvent, MatrikkelData, Measure, Offer, AppNotification, DailyWeather, WeatherRecommendation, Room, Resident, UserProfile, Partner, CreditState } from '../../types';
import { DEFAULT_MATRIKKEL, DEFAULT_FDV_EVENTS, DEFAULT_JOBS, DEFAULT_USER_PROFILE, MOCK_PARTNERS } from './defaults';
import { fetchWeatherForecast } from '../../services/weatherService';
import { isSupabaseConfigured } from '../supabaseClient';

interface AppState {
    userRole: UserRole;
    userProfile: UserProfile;
    matrikkel: MatrikkelData;
    properties: MatrikkelData[];
    activePropertyIndex: number;
    jobs: Job[];
    measures: Measure[];
    partners: Partner[];
    offers: Offer[];
    fdvEvents: FDVEvent[];
    notifications: AppNotification[];
    weatherForecast: DailyWeather[];
    weatherRecommendations: WeatherRecommendation[];
    rooms: Room[];
    residents: Resident[];
    isAgentOpen: boolean;
    agentContext: any;
    simulationProgress: number;

    // Actions
    setUserRole: (role: UserRole) => void;
    setActiveProperty: (index: number) => void;
    updateJobStatus: (jobId: string, status: JobStatus) => void;
    updateJobDetails: (jobId: string, updates: Partial<Job>) => void;
    toggleAgent: (open: boolean) => void;
    openAgent: (context: any) => void;
    closeAgent: () => void;
    initializeFromSupabase: () => Promise<void>;
    getHealthScore: () => number;
    getEstimatedValue: () => { current: number; simulated: number; potential: number; debt: number; added: number; enovaPotential: number; verifiedAppreciation: number };
    getPropertyTGScore: (address: string) => number;
    getPropertyIndex: (address: string) => number;
    getEIScoreBreakdown: (address: string) => { tg: number; age: number; energy: number; history: number; total: number };
    getPortfolioStats: () => { totalValue: number, avgEIScore: number, totalCapEx: number, energyDistribution: Record<string, number> };
    setSimulationProgress: (progress: number) => void;
    saveVisionJob: (analysis: VisionAnalysisResult, imageUrl: string, initiatedBy: 'customer' | 'pro') => void;
    addDocument: (event: FDVEvent) => void;
    requestOffer: (measure: Measure | Job, description: string) => Promise<void>;
    respondToOffer: (offerId: string, accepted: boolean) => void;
    loadWeather: () => Promise<void>;
    getCalendarEvents: (role: UserRole) => any[];
    toggleMeasureStatus: (measureId: number) => void;
    markAsRead: (notificationId: string) => void;
    clearAllNotifications: () => void;
    getSystemHealth: () => { supabase: boolean; gemini: boolean; weather: boolean; storage: 'local' | 'cloud' };
}

const DEFAULT_CREDITS: CreditState = {
    balance: 42,
    monthlyLimit: 50,
    rollover: 8,
    plan: 'aktiv'
};

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            userRole: UserRole.HOMEOWNER,
            userProfile: { ...DEFAULT_USER_PROFILE, credits: DEFAULT_CREDITS },
            matrikkel: { ...DEFAULT_MATRIKKEL, category: 'Bolig' },
            properties: [
                { ...DEFAULT_MATRIKKEL, category: 'Bolig' },
                {
                    address: "Kvadraturen Business Center, Oslo",
                    gnrBnr: "201/45",
                    yearBuilt: 1920,
                    bra: 4200,
                    type: "Kontorbygg",
                    category: 'Næring',
                    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
                    energyGrade: 'D',
                    municipality: 'Oslo',
                    lastAiAnalysisDate: '12.01.2024'
                },
                {
                    address: "Majorstuen Park, Oslo",
                    gnrBnr: "105/22",
                    yearBuilt: 1955,
                    bra: 1800,
                    type: "Leilighetsbygg",
                    category: 'Sameie',
                    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
                    energyGrade: 'F',
                    municipality: 'Oslo',
                    lastAiAnalysisDate: '05.02.2024'
                }
            ],
            activePropertyIndex: 0,
            jobs: DEFAULT_JOBS,
            measures: [],
            partners: MOCK_PARTNERS,
            offers: [],
            fdvEvents: DEFAULT_FDV_EVENTS,
            notifications: [],
            weatherForecast: [],
            weatherRecommendations: [],
            rooms: [
                { id: 'r1', name: 'Kjeller', tg: 3, propertyId: "Eksempelveien 12, 0123 Oslo" },
                { id: 'r2', name: 'Stue', tg: 1, propertyId: "Eksempelveien 12, 0123 Oslo" },
                { id: 'r3', name: 'Kjøkken', tg: 2, propertyId: "Eksempelveien 12, 0123 Oslo" },
            ],
            residents: [
                { id: '101', unitNumber: 'H0101', tg: 1, name: 'Lars Holm' },
                { id: '102', unitNumber: 'H0102', tg: 3, name: 'Siri Vang', lastIncident: 'Lekkasje på bad' },
                { id: '103', unitNumber: 'H0103', tg: 1, name: 'Erik Moen' },
                { id: '201', unitNumber: 'H0201', tg: 2, name: 'Mona Foss' },
                { id: '202', unitNumber: 'H0202', tg: 1, name: 'Jens Bakke' },
                { id: '203', unitNumber: 'H0203', tg: 3, name: 'Kari Lie', lastIncident: 'Utdatert VVB' },
                { id: '301', unitNumber: 'H0301', tg: 2, name: 'Per Øst' },
                { id: '302', unitNumber: 'H0302', tg: 1, name: 'Anita Sol' },
                { id: '303', unitNumber: 'H0303', tg: 1, name: 'Rolf Vik' },
            ],
            isAgentOpen: false,
            agentContext: null,
            simulationProgress: 0,

            getSystemHealth: () => ({
                supabase: isSupabaseConfigured,
                gemini: !!process.env.API_KEY,
                weather: get().weatherForecast.length > 0,
                storage: isSupabaseConfigured ? 'cloud' : 'local'
            }),

            setUserRole: (role) => set({ userRole: role }),

            setActiveProperty: (index) => set((s) => ({
                activePropertyIndex: index,
                matrikkel: s.properties[index]
            })),

            updateJobStatus: (jobId, status) => set((s) => ({
                jobs: s.jobs.map(j => j.id === jobId ? { ...j, status } : j)
            })),

            updateJobDetails: (jobId, updates) => set((s) => ({
                jobs: s.jobs.map(j => j.id === jobId ? { ...j, ...updates } : j)
            })),

            toggleAgent: (open) => set({ isAgentOpen: open }),
            openAgent: (context) => set({ isAgentOpen: true, agentContext: context }),
            closeAgent: () => set({ isAgentOpen: false, agentContext: null }),

            setSimulationProgress: (progress) => set({ simulationProgress: progress }),

            getHealthScore: () => {
                const { jobs } = get();
                const criticalCount = jobs.filter(j => j.risk_level === 'critical' && j.status !== 'completed').length;
                const moderateCount = jobs.filter(j => j.risk_level === 'moderate' && j.status !== 'completed').length;
                let score = 100;
                score -= (criticalCount * 25);
                score -= (moderateCount * 10);
                return Math.max(0, score);
            },

            getPortfolioStats: () => {
                const { properties, jobs } = get();
                const totalValue = properties.length * 15000000;
                const avgEIScore = Math.round(properties.reduce((acc, p) => acc + get().getEIScoreBreakdown(p.address).total, 0) / properties.length);
                const totalCapEx = jobs.filter(j => j.status !== 'completed').reduce((acc, j) => acc + j.estimert_kost, 0);

                const energyDistribution: Record<string, number> = {};
                properties.forEach(p => {
                    energyDistribution[p.energyGrade] = (energyDistribution[p.energyGrade] || 0) + 1;
                });

                return { totalValue, avgEIScore, totalCapEx, energyDistribution };
            },

            getEIScoreBreakdown: (address: string) => {
                const { properties, rooms, fdvEvents } = get();
                const property = properties.find(p => p.address === address);
                if (!property) return { tg: 0, age: 0, energy: 0, history: 0, total: 0 };

                let tgImpact = 0;
                const propertyRooms = rooms.filter(r => r.propertyId === address);
                if (propertyRooms.length > 0) {
                    const avgTg = propertyRooms.reduce((acc, r) => acc + r.tg, 0) / propertyRooms.length;
                    tgImpact = Math.round((avgTg - 1) * -20);
                }

                const age = new Date().getFullYear() - property.yearBuilt;
                const ageImpact = Math.round(Math.min(20, age * 0.2) * -1);

                const energyGrades: Record<string, number> = { 'A': 0, 'B': -3, 'C': -7, 'D': -12, 'E': -18, 'F': -25, 'G': -30 };
                const energyImpact = energyGrades[property.energyGrade] || -10;

                const historyBonus = Math.min(15, fdvEvents.length * 3);

                const total = Math.min(100, Math.max(0, 100 + tgImpact + ageImpact + energyImpact + historyBonus));

                return {
                    tg: tgImpact,
                    age: ageImpact,
                    energy: energyImpact,
                    history: historyBonus,
                    total
                };
            },

            getPropertyIndex: (address: string) => {
                return get().getEIScoreBreakdown(address).total;
            },

            getEstimatedValue: () => {
                const { jobs, simulationProgress, matrikkel, fdvEvents } = get();
                const baseValue = matrikkel.category === 'Næring' ? 85000000 : 12500000;
                const debt = jobs
                    .filter(j => j.status !== 'completed' && (j.risk_level === 'critical' || j.risk_level === 'moderate'))
                    .reduce((acc, j) => acc + (j.estimert_kost * 2.5), 0);
                const verifiedAppreciation = fdvEvents.reduce((acc, e) => acc + (e.cost || 0) * 1.2, 0);
                const potentialAppreciation = jobs
                    .filter(j => j.status === 'recommended' || j.status === 'quoted')
                    .reduce((acc, j) => acc + (j.estimert_kost * 1.5), 0);

                const current = baseValue - debt + verifiedAppreciation;
                const potential = baseValue + potentialAppreciation;
                const simulated = current + (debt * (simulationProgress / 100));

                return {
                    current,
                    simulated,
                    potential,
                    debt,
                    added: Math.round(verifiedAppreciation),
                    enovaPotential: jobs.reduce((acc, j) => acc + (j.enovaSupport || 0), 0),
                    verifiedAppreciation
                };
            },

            getPropertyTGScore: (address: string) => {
                const { rooms } = get();
                const propertyRooms = rooms.filter(r => r.propertyId === address);
                if (propertyRooms.length === 0) return 1.0;
                const sum = propertyRooms.reduce((acc, r) => acc + r.tg, 0);
                return Number((sum / propertyRooms.length).toFixed(1));
            },

            saveVisionJob: (analysis, imageUrl, initiatedBy) => set((state) => {
                const todayStr = new Date().toLocaleDateString('no-NO');
                const newJob: Job = {
                    id: `v-${Date.now()}`,
                    propertyId: 'p1',
                    tittel: analysis.tittel,
                    beskrivelse: analysis.beskrivelse,
                    adresse: state.matrikkel.address,
                    before_images: [imageUrl],
                    after_images: [],
                    risk_level: analysis.risk_level as any,
                    value_effect: analysis.value_effect as any,
                    driver: analysis.driver as any,
                    estimert_kost: analysis.estimert_kost,
                    enovaSupport: analysis.enovaSupport,
                    status: initiatedBy === 'customer' ? 'recommended' : 'draft_proff',
                    initiatedBy,
                    createdAt: new Date().toISOString()
                };

                const updatedProperties = state.properties.map((p, idx) =>
                    idx === state.activePropertyIndex ? { ...p, lastAiAnalysisDate: todayStr } : p
                );

                // DEDUCT CREDITS (Vision AI = 2)
                const currentCredits = state.userProfile.credits?.balance || 0;
                const updatedProfile = {
                    ...state.userProfile,
                    credits: { ...state.userProfile.credits!, balance: Math.max(0, currentCredits - 2) }
                };

                return {
                    jobs: [newJob, ...state.jobs],
                    properties: updatedProperties,
                    matrikkel: updatedProperties[state.activePropertyIndex],
                    userProfile: updatedProfile
                };
            }),

            addDocument: (event) => set((state) => ({
                fdvEvents: [event, ...state.fdvEvents]
            })),

            requestOffer: async (item, description) => {
                const { partners } = get();
                const itemId = 'id' in item ? item.id : (item as any).id;
                set((s) => ({
                    jobs: s.jobs.map(j => j.id === itemId ? { ...j, status: 'sent' } : j)
                }));
                await new Promise(r => setTimeout(r, 2000));
                const bestPartner = partners[0];
                const newOffer: Offer = {
                    id: `off-${Date.now()}`,
                    measureId: typeof itemId === 'number' ? itemId : 0,
                    companyName: bestPartner.name,
                    price: 15000,
                    description: `Tilbud fra ${bestPartner.name}`
                };
                set((s) => ({
                    offers: [...s.offers, newOffer],
                    jobs: s.jobs.map(j => j.id === itemId ? { ...j, status: 'quoted' } : j)
                }));
            },

            respondToOffer: (offerId, accepted) => set((s) => ({
                jobs: s.jobs.map(j => j.id === offerId ? { ...j, status: accepted ? 'accepted' : 'declined' } : j)
            })),

            loadWeather: async () => {
                const forecast = await fetchWeatherForecast();
                set({ weatherForecast: forecast });
            },

            getCalendarEvents: (role) => get().jobs.map(j => ({ id: j.id, title: j.tittel, date: j.createdAt })),
            toggleMeasureStatus: (id) => {},
            markAsRead: (id) => {},
            clearAllNotifications: () => set({ notifications: [] }),

            initializeFromSupabase: async () => {
                get().loadWeather();
            }
        }),
        {
            name: 'era-os-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                jobs: state.jobs,
                fdvEvents: state.fdvEvents,
                userRole: state.userRole,
                properties: state.properties,
                activePropertyIndex: state.activePropertyIndex,
                userProfile: state.userProfile
            }),
        }
    )
);
