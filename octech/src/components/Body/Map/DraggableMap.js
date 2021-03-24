import React, { useRef, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvent } from "react-leaflet";
import L from "leaflet";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import "./Map.css"
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button'
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import Modal from 'react-bootstrap/Modal';

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
            console.log(a)
            setSearch(false);
            setSpace(false)
            setValue(null)
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
    const [search, setSearch] = React.useState(false);
    const [space, setSpace] = React.useState(false);
    return (
        <>
            {!search && <><div >
                <MapContainer
                    center={center}
                    zoom={13}
                    minZoom={5}
                    style={{ width: "100%", height: "70vh" }}
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
            </div>
                <br />
                <center>
                    <IconButton >
                        <SearchIcon fontSize="large" onClick={() => { setSearch(true) }} />
                    </IconButton>
                </center>
                <br />
                <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: "-15px" }}>
                    <br />
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<DoneIcon />}
                        onClick={() => {
                            const marker = markerRef.current
                            if (marker !== null) {
                                marker._mapToAdd.setView(marker.getLatLng(), marker._mapToAdd.getZoom(), {
                                    animate: true
                                })
                            } sendData(markerRef.current.getLatLng()); setCoordinatesSelected(true); setShowEditMap(false)
                        }} >Add Coordinates</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<CloseIcon />}
                        onClick={() => {
                            const marker = markerRef.current
                            if (marker !== null) {
                                marker._mapToAdd.setView(marker.getLatLng(), marker._mapToAdd.getZoom(), {
                                    animate: true
                                })
                            } sendData(markerRef.current.getLatLng()); setCoordinatesSelected(false); setShowEditMap(false)
                        }} >Cancel</Button>
                </div></>}
                {search &&
                    <div style={{ width: "100%",marginBottom: "15px" }} onClick={() => {setSpace(true)}}>
                    <GooglePlacesAutocomplete
                        apiKey='AIzaSyC1EfNasAc6J8vIFP3Lephiv4sKQwFmvFQ'
                        selectProps={{
                            value,
                            onChange: setValue,
                        }} 
                    />
                    {value && searchPlace(value)}
                    {space && <><br/>
                    <br/>
                    <br/>
                    <br/>
                    <center>Search For a Location...</center>
                    <br/>
                    <br/>
                    <br/></>}
                </div>
                }
        </>
    );
}

