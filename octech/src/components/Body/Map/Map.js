import React from 'react';
import Button from 'react-bootstrap/Button';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;
require('react-leaflet-markercluster/dist/styles.min.css');




export default function Map({
    center,
    height,
    zoom,
    sendData,
    draggable,
    setCoordinatesSelected,
    setShowEditMap
}) {

    // const onMarkerDragEnd = (event) => {
    //     let newLat = event.latLng.lat(),
    //         newLng = event.latLng.lng();
    //     console.log(event)
    //     console.log(newLat, newLng);
    //     setValue(null);
    //     sendData([newLat, newLng]);

    // };

    const searchPlace = (a) => {
        if (a) {
            geocodeByAddress(a.label)
                .then(results => getLatLng(results[0]))
                .then(({ lat, lng }) =>
                    // sendData([lat, lng])
                    console.log([lat, lng])
                );
        }

    }

    const [value, setValue] = React.useState(null);
    return (
        <div>
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

            <div style={{ width: "100%", height: "auto" }}>
                <MapContainer
                    className="markercluster-map"
                    center={[20, 30]}
                    zoom={4}
                    minZoom={1}
                    maxBoundsViscosity={1.0}
                    style={{ width: "100%", height: "80vh" }}
                >
                    <TileLayer
                        url='https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png'
                        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                    />

                    <MarkerClusterGroup>
                        {/* <Marker position={[lat, lng]}><Popup>
              <div style={{ width: "300px" }}>
                <div style={{display: "flex" ,alignItems: "center", alignSelf: "center"}}>
                  <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
            > */}
                        {/* <Avatar src={user.photoUrl}></Avatar>  */}
                        {/* Material ui component for avatar */}
                        {/* </IconButton>Post Caption Here</div><img src="https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png" style={{ width: "300px" }}></img></div> */}
                        {/* </Popup></Marker> */}
                        <Marker position={[52.2297, 21.0122]} eventHandlers={{
                            click: (e) => {
                            },
                        }}><Tooltip direction="top" offset={[12, -5]} opacity={1} permanent>
                                <div style={{ width: "300px" }}><img src="https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png" style={{ width: "300px" }}></img></div>
                            </Tooltip></Marker>
                        <Marker position={[51.5074, -0.0901]} eventHandlers={{
                            click: (e) => {
                            },
                        }}><Popup>
                                <div style={{ width: "300px" }}><img src="https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png" style={{ width: "300px" }}></img></div>
                            </Popup></Marker>
                    </MarkerClusterGroup>;
      </MapContainer>
            </div>
            {draggable &&
                <>

                    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                        <br />
                        <Button onClick={() => { setCoordinatesSelected(true); setShowEditMap(false) }} >Add Coordinates</Button>
                        <Button onClick={() => { setCoordinatesSelected(false); setShowEditMap(false) }} >Cancel</Button>
                    </div>
                </>
            }
        </div>
    )
}