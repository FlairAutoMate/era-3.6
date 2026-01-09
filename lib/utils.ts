
import { BuildingRisk, Job, DailyWeather, Room, MatrikkelData } from '../types';

export const calculateJobPriority = (job: Job, currentRisk: BuildingRisk): number => {
    let score = 0;
    const riskWeights: Record<string, number> = { 'critical': 40, 'moderate': 20, 'low': 5 };
    score += riskWeights[job.risk_level] || 0;
    const effectWeights: Record<string, number> = { 'protect': 30, 'increase': 15 };
    score += effectWeights[job.value_effect] || 0;
    const roiBoost = Math.min(20, (job.roiEstimate || 1) * 4);
    score += roiBoost;
    if (currentRisk.level === 'CRITICAL' && job.risk_level === 'critical') score += 10;
    return Math.min(100, Math.round(score));
};

export const predictFailureDate = (job: Job): string => {
    if (job.status === 'completed') return 'N/A';
    const baseInterval = job.maintenanceInterval || 10;
    const riskFactor = job.risk_level === 'critical' ? 0.2 : job.risk_level === 'moderate' ? 0.6 : 1.0;
    const remainingDays = Math.floor(baseInterval * 365 * riskFactor);
    const failureDate = new Date();
    failureDate.setDate(failureDate.getDate() + remainingDays);
    return failureDate.toISOString().split('T')[0];
};

export const calculateBuildingRisk = (weather: DailyWeather[], rooms: Room[]): BuildingRisk => {
    const highRain = weather.some(w => w.precip > 10);
    const highWind = weather.some(w => w.windMax > 12);

    let score = 20;
    const factors: BuildingRisk['factors'] = [];

    if (highRain) {
        score += 40;
        factors.push({ type: 'weather', description: 'Kraftig nedbør ventet: Sjekk drenering og takrenner.', impact: 'negative' });
    }
    if (highWind) {
        score += 15;
        factors.push({ type: 'weather', description: 'Høy vindstyrke: Sjekk løse takstein/beslag.', impact: 'negative' });
    }

    const criticalRooms = rooms.filter(r => r.tg >= 3);
    if (criticalRooms.length > 0) {
        score += 30;
        factors.push({ type: 'structure', description: `${criticalRooms.length} kritiske avvik i bygningsmassen.`, impact: 'negative' });
    }

    const level = score > 70 ? 'CRITICAL' : score > 50 ? 'HIGH' : score > 30 ? 'MEDIUM' : 'LOW';
    return { level, score: Math.min(100, score), factors };
};

export const generateSmartTasks = (rooms: Room[], matrikkel?: MatrikkelData): any[] => {
    const tasks: any[] = [];
    const currentYear = new Date().getFullYear();
    const buildingAge = matrikkel ? currentYear - matrikkel.yearBuilt : 20;

    // 1. Age-based Logic (Strategic)
    if (buildingAge > 30) {
        tasks.push({
            id: 'st-age-pipes',
            title: 'Rørinspeksjon (Alder)',
            description: `Boligen er ${buildingAge} år. ERA anbefaler kontroll av avløpsrør for å unngå skjulte lekkasjer.`,
            date: new Date(currentYear, 9, 15).toISOString(),
            type: 'smart_task',
            priority: 'high',
            status: 'todo'
        });
    }

    // 2. Material-based (Assumption: Wood facade for demo)
    tasks.push({
        id: 'st-facade-paint',
        title: 'Maling/Beis Fasade',
        description: 'ERA har beregnet slitasje basert på lokalt vær. Tid for vedlikehold av sørvegg.',
        date: new Date(currentYear, 5, 20).toISOString(),
        type: 'smart_task',
        priority: buildingAge > 15 ? 'high' : 'medium',
        status: 'todo'
    });

    // 3. Technical intervals
    tasks.push({
        id: 'st-vent-filter',
        title: 'Bytte ventilasjonsfilter',
        description: 'Halvårlig rutine for optimalt inneklima og ENØK.',
        date: new Date(currentYear, 3, 1).toISOString(),
        type: 'smart_task',
        priority: 'medium',
        status: 'todo'
    });

    // 4. Room specific TG-logic
    rooms.forEach(room => {
        if (room.tg >= 2) {
            tasks.push({
                id: `st-${room.id}`,
                title: `Oppfølging: ${room.name}`,
                description: `Tilstandsklasse ${room.tg} detektert. Planlegg utbedring for å hindre verdifall.`,
                date: new Date().toISOString(),
                type: 'smart_task',
                priority: room.tg === 3 ? 'high' : 'medium',
                status: 'todo'
            });
        }
    });

    return tasks;
};
