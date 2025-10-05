import React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import alertIcon from "../assets/alert-error-svgrepo-com.svg"
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

interface ReportProps {
    position: L.LatLngExpression;
    children: React.ReactNode; // Content to display inside the marker
}

export const Report: React.FC<ReportProps> = ({ position, children }) => {
    const map = useMap();

    const customIcon = L.icon({
        iconUrl: alertIcon,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });

    return (
        <Marker position={position} icon={customIcon}>
            <Popup>{children}</Popup>
        </Marker>
    );
};
