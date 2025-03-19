import { useState, useEffect } from "react";
import * as Location from "expo-location";

interface ReverseGeocodeResult {
    formattedAddress: string;
    error?: string;
}

export default function useReverseGeocode(latitude?: number, longitude?: number) {
    const [data, setData] = useState<ReverseGeocodeResult>({ formattedAddress: "" });

    useEffect(() => {
        let isMounted = true;

        // Only attempt reverse geocoding if user lat/lon are valid
        if (latitude == null || longitude == null) return;

        async function fetchAddress() {
            try {
                // Reverse-geocode the coordinates
                const [result] = await Location.reverseGeocodeAsync({ latitude: latitude!, longitude: longitude! });

                if (result && isMounted) {
                    // Address string format customization:
                    const { name, street, postalCode, city, region, country } = result;
                    const formattedAddress = [name, street, postalCode, city, region, country]
                        .filter(Boolean)
                        .join(", ");

                    setData({ formattedAddress });
                }
            } catch (error: any) {
                if (isMounted) {
                    setData({ formattedAddress: "", error: error.message });
                }
            }
        }

        fetchAddress();
        return () => {
            isMounted = false;
        };
    }, [latitude, longitude]);

    return data;
}
