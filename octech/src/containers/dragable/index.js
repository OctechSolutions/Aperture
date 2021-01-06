/* Code inspired from YouTube video 
   "How to create a Draggable Component in React" 
   uploaded on April 18, 2020 by "TechLife with Jo".
   Link = https://www.youtube.com/watch?v=jfJ5ON05JKk
*/
import React, { useState } from 'react'

export default function Dragable() {
    const [x, setX] = useState(0)
    const [y, setY] = useState(0)
    const [dragging, setDragging] = useState(false)
    const [style, setStyle] = useState({})

    function startDrag() {
        setDragging(() => true)
    }

    function continueDrag(e) {
        if(dragging) {
            let left = e.screenX - (e.screenX - e.currentTarget.getBoundingClientRect().left)
            let top = e.screenY - (e.screenX - e.currentTarget.getBoundingClientRect().top)

            setX(() => e.screenX)
            setY(() => e.screenY)
            setStyle((prevStyle) => { 
                return ({ ...prevStyle, left: left, top: top })
            })
        }
    }

    function stopDrag() {
        setDragging(() => false)
    }

    return(
        <div 
            className='dragable' 
            onMouseUp={ startDrag } 
            onMouseMove={ continueDrag } 
            onMouseDown={ stopDrag }
        ></div>
    )
}

// class Dragable extends React.Component {
//     constructor(props){
//         super(props)

//         this.state = {
//             x: 0,
//             y: 0,
//             dragging: false,
//             style: {}
//         }

//         this.startDrag = this.startDrag.bind(this)
//         this.continueDrag = this.continueDrag.bind(this)
//         this.stopDrag = this.stopDrag.bind(this)
//     }

//     startDrag(e) {
//         this.setState({ dragging: true })
//     }

//     continueDrag(e) {
//         if(this.state.dragging){
//             let left = e.screenX - (e.screenX - e.currentTarget.getBoundingClientRect().left)
//             let top = e.screenY - (e.screenX - e.currentTarget.getBoundingClientRect().top)

//             this.setState({
//                 x: e.screenX,
//                 y: e.screenY,
//                 style: {
//                     left: left,
//                     top: top
//                 }
//             })
//         }
//     } 

//     endDrag(e) {
//         this.setState({ dragging: false })
//     }

//     render(){
//         return(
//             <div 
//                 className='dragable' 
//                 onMouseUp={startDrag} 
//                 onMouseMove={continueDrag} 
//                 onMouseDown={stopDrag}
//             ></div>
//         )
//     } 
// }

// export default Dragable
