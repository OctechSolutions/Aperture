/* Farmer Motion API was used for dragging behaviour.
   Link = https://www.framer.com/api/motion/gestures#drag
*/
import React, {useRef} from 'react'
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

    function getCoordinates(event, info) {
        console.log(info.point.x, info.point.y)
    }

    return (
        <motion.div ref={constraintsRef} className="dragable">
            <motion.div 
                drag dragConstraints={props.parentRef}  
                dragElastic={0}
                style={props.style}
                dragMomentum={false}
                onTap={checkDoubleClick}
                onTapStart={getCoordinates}
            />
        </motion.div>
    )
}
