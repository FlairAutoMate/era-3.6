
# ERA OS - Eiendoms- og Vedlikeholdsoperativsystem

ERA er et AI-drevet operativsystem designet for å profesjonalisere og forenkle eiendomsforvaltning for boligeiere, sameier og håndverkere. Systemet bruker kunstig intelligens (Gemini) for å analysere teknisk tilstand, beregne verdiøkning og automatisere FDV-dokumentasjon.

## 🏗 Arkitektur & Teknologistack

Prosjektet er bygget som en moderne **Progressive Web App (PWA)** med fokus på ytelse, offline-støtte og sanntidsinteraksjon.

- **Core Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS (Mobile-first, Dark mode default)
- **State Management:** Zustand (Persistert lokalt + Supabase sync)
- **AI Engine:** Google Gemini (Multimodal Vision & Reasoning)
- **Backend/Database:** Supabase
- **Icons:** Lucide React

## 🧩 Kjernefunksjoner

Systemet er delt inn i fire hovedmoduler styrt av `UserRole`:

### 1. Boligeier (Homeowner)
*   **Min Bolig Dashboard:** Sanntidsvisning av estimert markedsverdi og teknisk helsescore (0-100).
*   **ERA Vision:** Kamerabasert analyse av bygningsdeler. Detekterer automatisk avvik (TG), estimerer utbedringskostnad og identifiserer Enova-støtte.
*   **Verdiplan:** Prioritert liste over tiltak som gir høyest verdisikring (ROI).
*   **FDV-Logg:** Digital, sertifisert logg som samler dokumentasjon og historikk for å øke boligens salgsverdi.

### 2. Håndverker (Professional / Partner)
*   **Partner Dashboard:** Oversikt over aktive oppdrag, nye leads og omsetning.
*   **Feltmodus:** Mobiloptimalisert grensesnitt for sjekkliste, bildedokumentasjon og HMS på byggeplass.
*   **Kalkyle & Tilbud:** AI-støttet verktøy for å generere tilbud basert på Vision-data.
*   **Synergi-radar:** Ser muligheter for samdrift med andre faggrupper på samme lokasjon.

### 3. Styret (Board Member)
*   **Livsløps-tidslinje:** Langsiktig vedlikeholdsplanlegging for sameier/BRL.
*   **Beslutningsstøtte:** Digital avstemning og godkjenning av større vedlikeholdsprosjekter.

## 🚀 Deployment

Applikasjonen er konfigurert for automatisk deployment via GitHub Actions til Vercel eller Netlify.

---
*© 2024 ERA Intelligence AS*
