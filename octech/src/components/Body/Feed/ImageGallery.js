import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, EffectFlip, Keyboard } from 'swiper';
import Zoom from 'react-medium-image-zoom'
import Chip from '@material-ui/core/Chip'
import Avatar from '@material-ui/core/Avatar'
import 'react-medium-image-zoom/dist/styles.css'
import 'swiper/swiper-bundle.css';

SwiperCore.use([Navigation, Pagination, EffectFlip, Keyboard]);
function ImageGallery({ sliderImages }) {

    const [singleImage, ] = useState(sliderImages !== null ? Boolean(sliderImages.length - 1) : true)
    const [index, setIndex] = useState(0)
    const [loaded, setLoaded] = useState(false)
    return (
        <>
            <Swiper
                autoHeight={true}
                navigation={singleImage}
                pagination={singleImage}
                effect='flip'
                keyboard={singleImage}
                className="post__imageWrapper"
                onSlideChange={(swiper) => {setIndex(swiper.realIndex);setLoaded(true)}}
                onSlideChangeTransitionStart={() => {setLoaded(false)}}
                onSlideChangeTransitionEnd={() => {setLoaded(true)}}
                updateOnWindowResize={true}
            >
                {sliderImages.map((a, index) =>
                    <SwiperSlide style={{ textAlign: "center" }} key={index}>
                        <Zoom>
                            <img
                                src={a.src}
                                style={a.style}
                                alt="Carousel"
                                className="post__image"
                                id={`${a.src.length}${index}`}
                                onLoad={() => {setLoaded(true)}}
                            />
                            {loaded && a.overlayGifs !== undefined && a !== undefined && document.getElementById(`${a.src.length}${index}`) !== null && a.overlayGifs.map((b, i) => {
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
            <div style={{ display: "flex", flexWrap: "wrap", marginBottom: "10px" }}>
                {sliderImages[index]!==undefined && sliderImages[index].tags!==undefined && sliderImages[index].tags.map((tag) => {
                    return (
                            <Chip
                                avatar={<Avatar src={sliderImages[index].src} />}
                                className="tag-chip"
                                label={tag}
                                color="primary"
                                style={{margin: "3px"}}
                            />
                    );
                })}
            </div>
        </>
    )
}

export default ImageGallery
