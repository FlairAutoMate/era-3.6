
import { UserRole } from '../types';

// --- EVENT SCHEMA ---

export enum AnalyticsEvent {
    CAMERA_USED = 'camera_used',
    MEASURE_SENT = 'measure_sent_to_pro',
    OFFER_SENT = 'offer_sent',
    OFFER_ACCEPTED = 'offer_accepted',
    OFFER_REJECTED = 'offer_rejected',
    JOB_COMPLETED = 'job_completed',
    JOB_STARTED = 'job_started'
}

export interface AnalyticsProps {
    [AnalyticsEvent.CAMERA_USED]: {
        outcome: 'success' | 'failure';
        durationMs: number;
        detectedTG?: number;
        roomType?: string;
    };
    [AnalyticsEvent.MEASURE_SENT]: {
        measureId: number;
        category: string;
        tg: number;
        estimatedBudgetMin: number;
        estimatedBudgetMax: number;
    };
    [AnalyticsEvent.OFFER_SENT]: {
        leadId: string;
        price: number;
        companyName: string;
    };
    [AnalyticsEvent.OFFER_ACCEPTED]: {
        offerId: string;
        price: number;
        measureId: number;
    };
    [AnalyticsEvent.OFFER_REJECTED]: {
        offerId: string;
        measureId: number;
    };
    [AnalyticsEvent.JOB_COMPLETED]: {
        leadId: string;
        hasBeforeImage: boolean;
        hasAfterImage: boolean;
        timeSpentSeconds?: number;
    };
    [AnalyticsEvent.JOB_STARTED]: {
        leadId: string;
    };
}

// --- TRACKING SERVICE ---

const LOG_PREFIX = '%c[ERA ANALYTICS]';
const LOG_STYLE = 'background: #3b82f6; color: white; padding: 2px 4px; border-radius: 2px; font-weight: bold;';

export const trackEvent = <T extends AnalyticsEvent>(
    event: T,
    properties: AnalyticsProps[T],
    userRole: UserRole = UserRole.NONE
) => {
    // 1. Enrich with metadata
    const payload = {
        event,
        properties,
        timestamp: new Date().toISOString(),
        userRole,
        url: window.location.pathname,
        device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
    };

    // 2. Log to console (Mock Backend)
    console.groupCollapsed(LOG_PREFIX, LOG_STYLE, event);
    console.log('Payload:', payload);
    console.groupEnd();

    // 3. TODO: Send to backend (Mixpanel/Amplitude/PostHog)
    // fetch('/api/analytics', { method: 'POST', body: JSON.stringify(payload) });
};
