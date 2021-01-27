import React from 'react'
import Carousel from 'react-bootstrap/Carousel'
import './ImgSlideshow.css'

export default function ImgSlideshow({ imageArray }) {

    const carousalItems = imageArray.map((img) => {
        return (
            <Carousel.Item>
                <img src= {img}/>
            </Carousel.Item>
        )
    })

    return (
        <div classname="img-slideshow">
            <Carousel>
                { carousalItems }
            </Carousel>
        </div>
    )
}
