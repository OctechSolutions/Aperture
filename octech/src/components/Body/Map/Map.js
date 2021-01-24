import React from 'react';
import { withGoogleMap, GoogleMap, withScriptjs, Marker } from "react-google-maps";
import Autocomplete from 'react-google-autocomplete';
import { GoogleMapsAPI } from './client-config';
import Button from 'react-bootstrap/Button';



function Map({
    center,
    height,
    zoom,
    sendData,
    draggable,
    setCoordinatesSelected,
    setShowEditMap
}) {

    const onMarkerDragEnd = (event) => {
        let newLat = event.latLng.lat(),
            newLng = event.latLng.lng();
        console.log(event)
        console.log(newLat, newLng);
        sendData([newLat, newLng]);
    };


    const onPlaceSelected = (place) => {
        console.log('plc', place);
        const
            latValue = place.geometry.location.lat(),
            lngValue = place.geometry.location.lng();
        console.log(latValue, lngValue)
        // Set these values in the state.
        sendData([latValue, lngValue]);
    };

    const AsyncMap = withScriptjs(
        withGoogleMap(
            () => (
                <>


                    <GoogleMap
                        defaultZoom={zoom}
                        defaultCenter={{ lat: center.lat, lng: center.lng }}
                    >{/* For Auto complete Search Box */}
                        {draggable && <Autocomplete
                            style={{
                                width: '100%',
                                height: '40px',
                            }}
                            onPlaceSelected={onPlaceSelected}
                            types={['(regions)']}
                        />
                        }
                        {/*Marker*/}
                        <Marker
                            name={'Initial Mark'}
                            draggable={draggable}
                            onDragEnd={onMarkerDragEnd}
                            position={{ lat: center.lat, lng: center.lng }}
                            animation={2}
                        />
                        <Marker />
                        {draggable && 
                        <div>
                        <Button onClick={() => { setCoordinatesSelected(true); setShowEditMap(false) }} >Done</Button>
                        <Button onClick={() => { setCoordinatesSelected(false); setShowEditMap(false) }} >Cancel</Button>
                        </div>
                        }
                    </GoogleMap>

                </>
            )
        )
    );
    let map;
    if (center.lat !== undefined) {
        map = <div>

            <AsyncMap
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GoogleMapsAPI}&libraries=places`}
                loadingElement={
                    <div style={{ height: `100%` }} />
                }
                containerElement={
                    <div style={{ height: height }} />
                }
                mapElement={
                    <div style={{ height: `80%` }} />
                }
            />

            {/* {this.props.draggable && <button style={{width: "20%", marginTop: "3px"}}>Done</button>} */}

        </div>
    } else {
        map = <div style={{ height: height }} />
    }
    return (map)
}

export default Map