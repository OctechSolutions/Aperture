/* Code inspired from 
   YouTube Video "How To Build A Photo Editor With React And CSS Filters"
   uploaded on Sep 12, 2020 by "Web Dev Simplified".
   Link = https://www.youtube.com/watch?v=J243ncoInNE
   
   From Bootstrap:
   -> .col-sm-2
   -> .row
*/

import React, { useState } from 'react'
import './index.css'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { Slider, EditOption, AddOverlays } from '../../components'

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
    const [editOptions, setEditOptions] = useState(DEFAULT_EDIT_OPTIONS)
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(0)
    const selectedOption = editOptions[selectedOptionIndex]
    const addOverlayBtn = <AddOverlays value={{title: "Overlay"}} />

    function handleSliderChange(event) {
        setEditOptions(prevEditOptions => {
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
        const filters = editOptions.map(option => {
            return `${option.property}(${option.value}${option.unit})`
        })
        return {filter: filters.join(` `)}
    }

    return (
        <div className="photoEditor">
            {/* Div in which to view the photo. */}
            <div className="view-image" style={getImageStyle()}></div>
            {console.log(getImageStyle())}

            {/* Div with 6 options like brightness, contrast, etc. */}
            <div className="row">
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

                {/* To add Overlays */} 
                { addOverlayBtn }
            </div>

            {/* Slider to adjust edit values. */}
            <Slider 
                min={selectedOption.range.min}
                max={selectedOption.range.max}
                value={selectedOption.value}
                handleChange={handleSliderChange}
            />
        </div>
    )
}
