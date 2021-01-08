/* Farmer Motion API was used for dragging behaviour.
   Link = https://www.framer.com/api/motion/gestures#drag
*/
import React, {useState, useRef, useEffect } from 'react'
import { motion } from "framer-motion"
import './index.css'

export default function Dragable(props) {
    const constraintsRef = useRef(null)
    var timestamp = 0.0
    var tapCount = 0

    function checkDoubleClick(event) {
        if(tapCount === 1){
            if(event.timeStamp - timestamp <= 1000){
                props.handleDblClick(props.preview_gif)
            }
            tapCount = 0
        }
        else {
            timestamp = event.timeStamp
            tapCount = tapCount + 1
        }
    }

    return (
        <motion.div ref={constraintsRef}>
            <motion.div
                className="dragable" 
                drag dragConstraints={props.parentRef}  
                dragElastic={0}
                style={props.style}
                dragMomentum={false}
                onTap={checkDoubleClick}
            />
        </motion.div>
    )
}
