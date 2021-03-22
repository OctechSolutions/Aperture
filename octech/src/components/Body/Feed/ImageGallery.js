import React, { useEffect, useState, useRef } from 'react';


import 'bootstrap/dist/css/bootstrap.min.css';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, EffectFlip, Keyboard } from 'swiper';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

// Import Swiper styles
import 'swiper/swiper-bundle.css';

SwiperCore.use([Navigation, Pagination, EffectFlip, Keyboard]);
function ImageGallery({ sliderImages }) {

    const [, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    })
    useEffect(() => {
        function handleResize() {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
            })
        }
        setSingleImage(Boolean(sliderImages.length - 1))
        window.addEventListener('resize', handleResize)

        return _ => {
            window.removeEventListener('resize', handleResize)

        }

    }, [sliderImages.length])
    function handleResize() {
        setDimensions({
            height: window.innerHeight,
            width: window.innerWidth
        })

    }
    const [singleImage, setSingleImage] = useState(sliderImages !== null ? Boolean(sliderImages.length - 1) : true)
    return (

        <Swiper
            autoHeight={true}
            navigation={singleImage}
            pagination={singleImage}
            loop={singleImage}
            effect='flip'
            keyboard={singleImage}
            className="post__imageWrapper"
        >
            {sliderImages.map((a, index) =>
                <SwiperSlide style={{ textAlign: "center" }}>
                    <Zoom>
                        <img
                            src={a.src}
                            style={a.style}
                            alt="Carousel"
                            className="post__image"
                            id={`${a.src.length}${index}`}
                            onLoad={handleResize}
                        />
                        {a.overlayGifs !== undefined && a !== undefined && document.getElementById(`${a.src.length}${index}`) !== null && a.overlayGifs.map((b, i) => {
                            return (
                                <div
                                    id={`test`}
                                    style={{
                                        backgroundImage: "url(" + b.url + ")",
                                        backgroundRepeat: "no-repeat",
                                        backgroundSize: "contain",
                                        width: (document.getElementById(`${a.src.length}${index}`).getBoundingClientRect().width / 5) + "px",
                                        height: (((document.getElementById(`${a.src.length}${index}`).getBoundingClientRect().width / 5) / b.width) * b.height) + "px",
                                        position: "absolute",
                                        left: ((document.getElementById(`${a.src.length}${index}`).getBoundingClientRect().width / a.orignalDimensions.width) * a.overlayCoordinates[i].x) + "px",
                                        top: ((document.getElementById(`${a.src.length}${index}`).getBoundingClientRect().height / a.orignalDimensions.height) * a.overlayCoordinates[i].y) + "px",
                                    }}
                                >
                                </div>
                            )
                        }
                        )}
                    </Zoom>
                </SwiperSlide>
            )}
        </Swiper >
    )
}

export default ImageGallery
