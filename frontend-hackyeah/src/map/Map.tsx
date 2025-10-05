import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { api } from '../api';
import { Route } from './Route';
import { Report } from '../report/Report';
import { service } from '../api/service';
import locationIcon from "../assets/location-pin-alt-1-svgrepo-com.svg"
import L from 'leaflet';
import { CreateReport } from '../report/CreateReport';
import { Bar } from '../shared/Bar';
import { Settings } from '../shared/Options';
import garbageBin from "../assets/garbage-bin-svgrepo-com.svg"
import arrowUp from "../assets/arrow-up-svgrepo-com.svg"
import arrowDown from "../assets/arrow-down-svgrepo-com.svg"
import train from "../assets/train-svgrepo-com.svg"
const TYPE_TRAIN_DELAY = 'trainDelay';
const TYPE_TRAIN_FAILURE = 'trainFailure';
const TYPE_ROAD_FAILURE = 'roadFailure';
const TYPE_PASS_OTHER_TRAIN = 'passOtherTrain';
const TYPE_COLLISION = 'collision';
const TYPE_DERAILMENT = 'derailment';
const TYPE_OTHER = 'other';
const tabs = [
    { type: TYPE_TRAIN_DELAY, desc: "Train Delay" },
    { type: TYPE_TRAIN_FAILURE, desc: "Train Failure" },
    { type: TYPE_ROAD_FAILURE, desc: "Road Failure" },
    { type: TYPE_PASS_OTHER_TRAIN, desc: "Pass Other Train" },
    { type: TYPE_COLLISION, desc: "Collision" },
    { type: TYPE_DERAILMENT, desc: "Derailment" },
    { type: TYPE_OTHER, desc: "Other" },
]

type MarkerNode = {
    position: { lat: number, lng: number },
    title: string,
    infoWindow: {
        autoClose: boolean,
        content: string,
        extra: any[],
        headerContent: string,
        opened: boolean,
    },
    icon: any,
    extra: any[]
    id: number
}
type MapData = {
    center: { lat: number, lng: number },
    zoom: number,
    fitBoundsToMarkers: boolean,
    options: any[],
    markers: MarkerNode[]
}
type ErrorData = {
    id: number,
    tripId: string,
    type: string,
    description: string,
    userId: number,
    reportLat: number,
    reportLon: number
}
export const Map = ({ stateData }: any) => {
    const [location, setLocation] = useState({ latitude: 0, longitude: 0 })
    const [data, setData] = useState<{ map: MapData, reports: ErrorData[][], train: any }>()
    let prev: MarkerNode = {
        position: {
            lat: 0,
            lng: 0
        },
        title: '',
        infoWindow: {
            autoClose: false,
            content: '',
            extra: [],
            headerContent: '',
            opened: false
        },
        icon: undefined,
        extra: [],
        id: 0
    }
    useEffect(() => {
        if (stateData.user.tickets)
            if (stateData.user.tickets.length)
                service.getTrip(stateData.user.tickets[0].tripId).then(res => res.data)
                    .then(map => {
                        console.log(map)
                        setData(map)
                    })
    }, [stateData.user.tickets])
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation(
                    {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                )
            },
            (error) => {
                console.error('Error getting user location:', error);
            }
        );
    }, [])
    const customIcon = L.icon({
        iconUrl: locationIcon,
        iconSize: [25, 25],
        iconAnchor: [12.5, 25],
    });
    const trainIcon = L.icon({
        iconUrl: train,
        iconSize: [25, 25],
        iconAnchor: [12.5, 12.5],
    });
    return <div className="w-5/5 h-5/5  fixed   bg-black">

        {location.latitude &&
            <MapContainer className='w-full h-full z-0' center={[location.latitude, location.longitude]} zoom={10} scrollWheelZoom={false}>
                <TileLayer

                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {data?.map.markers && data?.map.markers.map((l) => {
                    if (!prev.position.lat) {
                        prev = l
                        return <div key={l.id}>
                            <Marker icon={customIcon} position={[l.position.lat, l.position.lng]}>
                                <Popup>
                                    <h1>{l.title}</h1>
                                    <p>{l.infoWindow.content}</p>
                                </Popup>
                            </Marker>
                        </div>
                    }
                    else {
                        const temp = prev
                        prev = l
                        return <div key={l.id}>
                            <Marker icon={customIcon} position={[l.position.lat, l.position.lng]}>
                                <Popup>
                                    <h1>{l.title}</h1>
                                    <p>{l.infoWindow.content}</p>
                                </Popup>
                            </Marker>
                            <Route source={temp.position} destination={l.position} />
                        </div>
                    }
                })}
                {(data?.reports) && data.reports.map(r => {
                    let ticketOwner = false
                    if (r[0].userId == stateData.user.id)
                        ticketOwner = true
                    return <div key={r[0].id}>
                        <Report position={[r[0].reportLat, r[0].reportLon]}>
                            <div className='w-40 h-30'>
                                <h1 className='text-2xl font-bold'>
                                    {tabs.filter(t => t.type == r[0].type)[0].desc}
                                </h1>
                                <h1 className='text-lg'>
                                    {r[0].description}
                                </h1>
                                {ticketOwner && <div className='absolute bottom-2 right-2 bg-red-500 text-white text-lg p-1 rounded-xl'>
                                    <button className='p-1' onClick={() => {
                                        service.deleteTicket(stateData.user.id, r[0].id)
                                    }}><img width={40} height={40} src={garbageBin} /></button>
                                </div>}
                                {!ticketOwner && <div>
                                    <button onClick={() => service.disproveReport(stateData.user.id, r[0].id)}
                                        className='bg-red-500 rounded-md'>
                                        <img width={48} height={48} src={arrowDown} />
                                    </button>
                                    <button onClick={() => service.confirmReport(stateData.user.id, r[0].id)}
                                        className='bg-green-500 rounded-md ml-4'>
                                        <img width={48} height={48} src={arrowUp} />
                                    </button>
                                </div>
                                }
                            </div>
                        </Report>
                    </div>
                })}
                {data?.train && <Marker icon={trainIcon} position={[data.train.positionLat, data.train.positionLon]}>
                    <Popup>{data.train.name}</Popup>

                </Marker>}
            </MapContainer>
        }

        <CreateReport data={stateData} />
        <Settings data={stateData} />

    </div>
}