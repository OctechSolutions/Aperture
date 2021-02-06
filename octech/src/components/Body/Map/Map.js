import React from 'react';
import { withGoogleMap, GoogleMap, withScriptjs, Marker } from "react-google-maps";
import { GoogleMapsAPI } from './client-config';
import Button from 'react-bootstrap/Button';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';



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
        setValue(null);
        sendData([newLat, newLng]);
        
    };

    const searchPlace = (a) => {
        if (a) {
            geocodeByAddress(a.label)
                .then(results => getLatLng(results[0]))
                .then(({ lat, lng }) =>
                    sendData([lat, lng])
                );
        }

    }

    const [value, setValue] = React.useState(null);


    const AsyncMap = withScriptjs(
        withGoogleMap(
            () => (
                <>

                    <GoogleMap
                        defaultZoom={zoom}
                        defaultCenter={{ lat: center.lat, lng: center.lng }}
                        onClick = {onMarkerDragEnd}
                    >{/* For Auto complete Search Box */}

                        {/*Marker*/}
                        <Marker
                            name={'Initial Mark'}
                            draggable={draggable}
                            onDragEnd={onMarkerDragEnd}
                            position={{ lat: center.lat, lng: center.lng }}
                            animation={2}
                        />
                        <Marker />

                    </GoogleMap>

                </>
            )
        )
    );
    let map;
    if (center.lat !== undefined) {
        map = <div>

            {/* {draggable && <Autocomplete
                        style={{
                            width: '100%',
                            height: '40px',
                        }}
                        onPlaceSelected={onPlaceSelected}
                        types={['(regions)']}
                    /> */}




            {/* } */}

            {draggable &&
                <div>
                    <br />
                <GooglePlacesAutocomplete
                    // apiKey='AIzaSyC1EfNasAc6J8vIFP3Lephiv4sKQwFmvFQ'
                    selectProps={{
                        value,
                        onChange: setValue,
                    }}
                />
                {value && searchPlace(value)}
                </div>
            }

            <AsyncMap
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GoogleMapsAPI}&libraries=places`}
                loadingElement={
                    <div style={{ height: `100%` }} />
                }
                containerElement={
                    <div style={{ height: height }} />
                }
                mapElement={
                    <div style={{ height: `90%` }} />
                }
            />


            {draggable &&
                <>

                    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                        <br />
                        <Button onClick={() => { setCoordinatesSelected(true); setShowEditMap(false) }} >Add Coordinates</Button>
                        <Button onClick={() => { setCoordinatesSelected(false); setShowEditMap(false) }} >Cancel</Button>
                    </div>
                </>
            }
            {/* {this.props.draggable && <button style={{width: "20%", marginTop: "3px"}}>Done</button>} */}

        </div>
    } else {
        map = <div style={{ height: height }} />
    }
    return (map)
}

export default Map