import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';


function ImageGallery({ sliderImages }) {

    return (
        <div style={{
            // display: "block",
            // maxHeight : "50vh",
            // marginLeft: "auto",
            // marginRight: "auto",
        }}>
            <Carousel interval={null}>
                {sliderImages.map((a) => 
                    <Carousel.Item className="post__image">
                        <img
                            src={a.src}
                            style={a.style}
                            alt="Carousel"
                        />
                    </Carousel.Item>
                )}

            </Carousel>
        </div>
    )
}

export default ImageGallery