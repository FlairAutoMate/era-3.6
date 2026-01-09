
import { MatrikkelData, EnergyGrade } from '../types';

interface KartverketAddress {
    adressetekst: string;
    poststed: string;
    postnummer: string;
    kommunenavn: string;
    gardsnummer: number;
    bruksnummer: number;
    representasjonspunkt: {
        lat: number;
        lon: number;
    };
}

export const searchAddresses = async (query: string): Promise<MatrikkelData[]> => {
    // Requires at least 3 chars to search
    if (!query || query.length < 3) return [];

    try {
        // Use Kartverket's open API
        // Added wildcard search (*) to make it more user friendly while typing
        const response = await fetch(
            `https://ws.geonorge.no/adresser/v1/sok?sok=${encodeURIComponent(query)}*&treffPerSide=5&asciiKompatibel=true`
        );

        if (!response.ok) throw new Error('Address search failed');

        const data = await response.json();
        const results: KartverketAddress[] = data.adresser;

        // Map Kartverket response to our internal MatrikkelData type
        return results.map(addr => ({
            address: `${addr.adressetekst}, ${addr.postnummer} ${addr.poststed}`,
            gnrBnr: `${addr.gardsnummer}/${addr.bruksnummer}`,
            // municipality, lat, lon are kept for internal use though not strictly in MatrikkelData interface
            municipality: addr.kommunenavn,
            lat: addr.representasjonspunkt.lat,
            lon: addr.representasjonspunkt.lon,
            // Fallback mock data for fields not in this specific API endpoint
            // In a real app, we would query Matrikkelen via Gnr/Bnr here to get Year/BRA
            yearBuilt: 1980 + Math.floor(Math.random() * 40),
            bra: 120 + Math.floor(Math.random() * 80),
            type: "Enebolig",
            // Added category property as it is required by the MatrikkelData interface
            category: 'Bolig',
            // Using Unsplash as placeholder for street view
            imageUrl: `https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80`,
            // Added default energy grade as it is required by the MatrikkelData interface
            energyGrade: 'C' as EnergyGrade
        }));

    } catch (error) {
        console.warn("Kartverket API error:", error);
        return [];
    }
};
