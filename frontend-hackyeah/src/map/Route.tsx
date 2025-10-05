import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

type RouteProps = {
    source: { lat: number, lng: number },
    destination: { lat: number, lng: number }
}
export const Route = ({ source, destination }: RouteProps) => {
    const map = useMap();
    useEffect(() => {
        const fetchRoute = async () => {
            L.polyline([source, destination], { color: "green", weight: 7 }).addTo(map);
        };

        fetchRoute();
    }, [source, destination, map]);

    return null;
};
