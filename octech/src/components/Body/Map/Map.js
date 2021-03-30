import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import { db } from "../../../firebase";
import Skeleton from '@material-ui/lab/Skeleton';
import { Avatar } from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { useHistory } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, EffectFlip, Keyboard } from 'swiper';
import Zoom from 'react-medium-image-zoom'
// Import Swiper styles
import 'swiper/swiper-bundle.css';

SwiperCore.use([Navigation, Pagination, EffectFlip, Keyboard]);

var greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

require('react-leaflet-markercluster/dist/styles.min.css');


export default function Map({
    center,
    images,
    message,
    photoUrl,
    locationPosts,
    id,
    isChallengePost
}) {

    React.useEffect(() => {
        setTimeout(function () { setShowTooltip(false); }, 1000)
    }, [])

    const [loading, setLoading] = React.useState(false)
    const [showTooltip, setShowTooltip] = React.useState(true)
    const [src, setSrc] = React.useState("")
    const history = useHistory();
    const [singleImage,] = React.useState(images !== null ? Boolean(images.length - 1) : true)
    return (
        <div>

            <div style={{ width: "100%", height: "auto" }}>
                <MapContainer
                    className="markercluster-map"
                    center={center}
                    zoom={18}
                    minZoom={3}
                    maxBoundsViscosity={1.0}
                    style={{ width: "100%", height: "80vh" }}
                >
                    <TileLayer
                        url='https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png'
                        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, 
                        &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> 
                        &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                    />

                    <MarkerClusterGroup>
                        <Marker position={center} icon={greenIcon}>
                            <Popup direction="top" opacity={1} >
                                <div style={{ width: "300px" }}>
                                    <div style={{ display: "flex", alignItems: "center", alignSelf: "center" }}>
                                        <IconButton
                                            aria-label="more"
                                            aria-controls="long-menu"
                                            aria-haspopup="true"
                                        >
                                            <Avatar src={photoUrl}></Avatar>
                                        </IconButton>
                                        <h6 style={{ fontWeight: "400" }}>{message}</h6>
                                    </div>
                                    <Swiper
                                        autoHeight={true}
                                        navigation={singleImage}
                                        pagination={singleImage}
                                        effect='flip'
                                        keyboard={singleImage}
                                        style={{ width: "300px" }}
                                    >
                                        {images.map((a, index) =>
                                            <SwiperSlide>
                                                <Zoom>
                                                    <img
                                                        src={a.src}
                                                        alt="Carousel"
                                                        style={{ width: "300px", borderRadius: "20px" }}
                                                    />
                                                </Zoom>

                                            </SwiperSlide>
                                        )}
                                    </Swiper >
                                </div>
                            </Popup>
                            {showTooltip &&
                                <Tooltip direction="top" offset={[0, -35]} opacity={1} permanent>
                                    <div style={{ width: "300px" }}>
                                        <div style={{ display: "flex", alignItems: "center", alignSelf: "center" }}>
                                            <IconButton
                                                aria-label="more"
                                                aria-controls="long-menu"
                                                aria-haspopup="true"
                                            >
                                                <Avatar src={photoUrl}></Avatar>
                                            </IconButton>
                                            <h6 style={{ fontWeight: "400" }}>{message}</h6>
                                        </div>
                                        <Swiper
                                            autoHeight={true}
                                            navigation={singleImage}
                                            pagination={singleImage}
                                            effect='flip'
                                            keyboard={singleImage}
                                            style={{ width: "300px" }}
                                        >
                                            {images.map((a, index) =>
                                                <SwiperSlide>
                                                    <Zoom>
                                                        <img
                                                            src={a.src}
                                                            alt="Carousel"
                                                            style={{ width: "300px", borderRadius: "20px" }}
                                                        />
                                                    </Zoom>

                                                </SwiperSlide>
                                            )}
                                        </Swiper >
                                    </div>
                                </Tooltip>
                            }
                        </Marker>

                        {locationPosts !== undefined && locationPosts.map((p) => {
                            if (p.id !== id) {
                                return (
                                    <Marker position={{ lat: p.data.lat, lng: p.data.lng }} eventHandlers={{
                                        click: (e) => {
                                            setLoading(true)
                                            if (isChallengePost === true) {
                                                setSrc(p.data.imageSrc)
                                                setLoading(false)
                                            }
                                            else {
                                                db.collection("postImages").where("ref", "==", p.id).get().then((a) => { setSrc(a.docs[0].data().url); setLoading(false) })
                                            }

                                        },
                                    }}
                                        icon={blueIcon}
                                    >
                                        <Popup direction="top">
                                            <div style={{ width: "300px" }}>
                                                <div style={{ display: "flex", alignItems: "center", alignSelf: "center" }}>
                                                    {!loading ? <IconButton
                                                        aria-label="more"
                                                        aria-controls="long-menu"
                                                        aria-haspopup="true"
                                                    >
                                                        <Avatar src={(isChallengePost === true) ? p.data.creatorPhotoUrl : p.data.photoUrl}></Avatar>
                                                    </IconButton> : <Skeleton variant="circle" width={"40px"} height={"40px"} animation="wave" style={{ marginBottom: "10px" }} />}
                                                    {!loading ? <h6 style={{ fontWeight: "400" }}>{(isChallengePost === true) ? p.data.caption : p.data.message}</h6> : <Skeleton variant="text" width={"80%"} height={"20px"} animation="wave" style={{ marginBottom: "10px", marginLeft: "20px" }} />}
                                                </div>
                                                {!loading ?
                                                    <Swiper
                                                        autoHeight={true}
                                                        effect='flip'
                                                        style={{ width: "300px" }}
                                                    >
                                                        <SwiperSlide>
                                                            <Zoom>
                                                                <img
                                                                    src={src}
                                                                    alt="Carousel"
                                                                    style={{ width: "300px", borderRadius: "20px" }}
                                                                />
                                                            </Zoom>

                                                        </SwiperSlide>
                                                    </Swiper >
                                                    :
                                                    <Skeleton variant="rect" width={"100%"} height={"180px"} animation="wave" />}

                                                {(!loading && (isChallengePost !== true)) ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                                                    <h6>Go to Post</h6>
                                                    <IconButton onClick={() => { history.push(`post/${p.id}`); }}>
                                                        <OpenInNewIcon fontSize="small" />
                                                    </IconButton>
                                                </div>
                                                    :
                                                    <>{(isChallengePost !== true) && <Skeleton variant="text" width={"100%"} height={"40px"} animation="wave" />}</>
                                                }
                                            </div>
                                        </Popup>
                                    </Marker>
                                )

                            }
                            else
                                return <></>

                        })}
                    </MarkerClusterGroup>
                </MapContainer>
            </div>
        </div>
    )
}