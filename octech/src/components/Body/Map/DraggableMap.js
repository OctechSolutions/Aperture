import React, { useRef, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvent } from "react-leaflet";
import L from "leaflet";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';

export default function DraggableMap({
    center,
    sendData,
    setCoordinatesSelected,
    setShowEditMap
}) {
    const [info, setInfo] = React.useState({

        zoom: 15,
        draggable: true,
    })

    useEffect(() => { setLoaded(true) }, [])
    const eventHandlers = useMemo(
        () => ({
            dragend() {
                console.log(markerRef);
                const marker = markerRef.current
                if (marker !== null) {
                    marker.setLatLng({ lat: marker.getLatLng().lat, lng: marker.getLatLng().lng })
                    marker._mapToAdd.setView(marker.getLatLng(), marker._mapToAdd.getZoom(), {
                        animate: true
                    })
                }
            },
        }),
        [],
    )

    const markerRef = useRef();
    const mapRef = useRef();
    const searchPlace = (a) => {
        if (a) {
            geocodeByAddress(a.label)
                .then(results => getLatLng(results[0]))
                .then(({ lat, lng }) => {
                    const marker = markerRef.current
                    if (marker !== null) {
                        marker.setLatLng({ lat: lat, lng: lng })
                        marker._mapToAdd.setView({ lat: lat, lng: lng }, marker._mapToAdd.getZoom(), {
                            animate: true
                        })
                    }
                }
                );
        }

    }

    const [value, setValue] = React.useState(null);
    const [loaded, setLoaded] = React.useState(false);
    return (
        <>
            {loaded && <div style={{ width: "100%", zIndex: 100 }}>
                <br />
                <GooglePlacesAutocomplete
                    apiKey='AIzaSyC1EfNasAc6J8vIFP3Lephiv4sKQwFmvFQ'
                    selectProps={{
                        value,
                        onChange: setValue,
                    }}
                    style={{ width: "100%" }}
                />
                {value && searchPlace(value)}
            </div>}
            <MapContainer
                center={center}
                zoom={13}
                minZoom={5}
                style={{ width: "100%", height: "80vh", zIndex: 1 }}
                ref={mapRef}
            >

                <TileLayer
                    url='https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png'
                    attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                />
                {<Marker
                    position={center}
                    eventHandlers={eventHandlers}
                    draggable={true}
                    ref={markerRef}
                >

                </Marker>}

            </MapContainer>

            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                <br />
                <button onClick={() => { const marker = markerRef.current
                if (marker !== null) {
                    marker._mapToAdd.setView(marker.getLatLng(), marker._mapToAdd.getZoom(), {
                        animate: true
                    })
                }sendData(markerRef.current.getLatLng()); setCoordinatesSelected(true); setShowEditMap(false) }} >Add Coordinates</button>
                <button onClick={() => { const marker = markerRef.current
                if (marker !== null) {
                    marker._mapToAdd.setView(marker.getLatLng(), marker._mapToAdd.getZoom(), {
                        animate: true
                    })
                }sendData(markerRef.current.getLatLng()); setCoordinatesSelected(false); setShowEditMap(false) }} >Cancel</button>
            </div>
        </>
    );
}

