/* Parts of code inspired from 
   YouTube Video "How To Build A Photo Editor With React And CSS Filters"
   uploaded on Sep 12, 2020 by "Web Dev Simplified".
   Link = https://www.youtube.com/watch?v=J243ncoInNE
   
   From Bootstrap:
   -> .col-sm-2
   -> .row
*/

import React, { useState, useRef} from 'react'

import './index.css'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

import { 
    Slider, 
    EditOption,
    Giphy, 
    Dragable
} from '../../components'

/* List of initial values of properties that will be assigned to the image. */
const DEFAULT_EDIT_OPTIONS = [
    {   
        name: 'Brightness',
        property: 'brightness',
        value: 100,
        range: { min: 0, max: 200},
        unit: '%'
    },
    {   
        name: 'Contrast',
        property: 'contrast',
        value: 100,
        range: { min: 0, max: 200},
        unit: '%'
    },
    {   
        name: 'Saturation',
        property: 'saturate',
        value: 100,
        range: { min: 0, max: 200},
        unit: '%'
    },
    {   
        name: 'Grayscale',
        property: 'grayscale',
        value: 0,
        range: { min: 0, max: 100},
        unit: '%'
    },
    {   
        name: 'Hue',
        property: 'hue-rotate',
        value: 0,
        range: { min: 0, max: 360},
        unit: 'deg'
    }
]

export default function PhotoEditor() {
    const [editOptions, setEditOptions] = useState(DEFAULT_EDIT_OPTIONS) // editOptions = Current values of image properties.
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(0) // selectedOptionIndex = Index of the currently selected option.
    const selectedOption = editOptions[selectedOptionIndex] 
    const [imgOverlays, setImgOverlays] = useState([]) // imgOverlays = array of giffs ot stickers on the image.
    const overlayParentRef = useRef() // Reference to the parent element of overlays.

    function handleSliderChange(event) {
        setEditOptions(prevEditOptions => {
            /* Loop through all the options.
               Once the currently selected,
               then change the value of that option to 
               the current one on the slider.
            */
            return(
                (prevEditOptions.map((option, index) => {
                    
                    if (index !== selectedOptionIndex) {
                        return option 
                    }
                    return { ...option, value: event.target.value }
                }))
            )
        })
    }

    function getImageStyle() {
        /* filters and stores all the current image property values 
           as a string that is returned.
        */
        const filters = editOptions.map(option => {
            return `${option.property}(${option.value}${option.unit})`
        })
        return {filter: filters.join(` `)}
    }

    function handleOverlayClick (overlay, e) {
        /* When am overlay is clicked, it is added to the list of overlays
           causing it to be rendered on screen. */
        e.preventDefault();
        setImgOverlays(imgOverlays.concat(overlay.images.preview_gif)) /* Add new overlay url to the list of overlays. */
    }

    function removeOverlay(preview_gif) {
        setImgOverlays(imgOverlays.filter(obj => obj !== preview_gif))
    }

    return (
        <div className="photoEditor">
            {/* Div with 6 options like brightness, contrast, etc. */}
            <div className="row edit-options">
                {/* Loop through all options and create EditOption 
                    components using their values. */}
                {editOptions.map((option, index) => {
                    return(
                            <EditOption 
                                key={index}
                                name={option.name}
                                active={index === selectedOptionIndex ? true : false}
                                handleClick={() => setSelectedOptionIndex(index)}
                            />
                    )
                })}

            </div>

            {/* Slider to adjust edit values. */}
            <Slider 
                min={selectedOption.range.min}
                max={selectedOption.range.max}
                value={selectedOption.value}
                handleChange={handleSliderChange}
            />

            {/* Search for Giffs and Stickers from https://giphy.com/ */}
            <Giphy handleGiffClick={handleOverlayClick}/>

            {/* Div in which to view the photo. */}
                <img 
                    className="view-image" 
                    src="https://cdn.pixabay.com/photo/2017/11/05/18/11/dogs-2921382_1280.jpg" 
                    style={getImageStyle()} 
                    ref={overlayParentRef}
                />
                {imgOverlays.map((preview_gif, index) => {
                        return (
                            <Dragable 
                                key={index}
                                preview_gif={preview_gif}
                                parentRef={overlayParentRef} 
                                style={{
                                    backgroundImage: "url(" + preview_gif.url + ")",
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "contain",
                                    height: preview_gif.height + "px",
                                    width: preview_gif.width + "px"
                                }} 
                                handleDblClick={removeOverlay}
                            />
                        )
                })}
        </div>
    )
}
