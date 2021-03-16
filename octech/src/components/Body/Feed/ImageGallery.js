import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, EffectFlip, Keyboard } from 'swiper';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

// Import Swiper styles
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';
import 'swiper/components/zoom/zoom.min.css';
import 'swiper/components/effect-flip/effect-flip.scss'

SwiperCore.use([Navigation, Pagination, EffectFlip, Keyboard]);
function ImageGallery({ sliderImages }) {

    return (
        <Swiper
            autoHeight={true}
            navigation
            pagination={{ clickable: true }}
            loop={true}
            effect='flip'
            keyboard={true}
        >
            {sliderImages.map((a) =>
                <SwiperSlide style={{textAlign: "center"}}>
                    <Zoom>
                        <img
                            src={a.src}
                            style={a.style}
                            alt="Carousel"
                            className="post__image"
                        />
                    </Zoom>
                </SwiperSlide>
            )}
        </Swiper >
    )
}

export default ImageGallery
