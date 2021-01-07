/* Farmer Motion API was used for dragging behaviour.
   Link = https://www.framer.com/api/motion/gestures#drag
*/
import React, { useState, useRef } from 'react'
import { motion } from "framer-motion"
import './index.css'

export default function Dragable({parentRef, style}) {
    const constraintsRef = useRef(null)
    return (
        <motion.div ref={constraintsRef}>
            <motion.div 
                drag dragConstraints={parentRef} 
                className="dragable" 
                style={style}
            />
        </motion.div>
    )
}
