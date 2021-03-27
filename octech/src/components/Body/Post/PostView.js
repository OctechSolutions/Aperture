import React from 'react'
import { db } from "../../../firebase";

function PostView(props) {
    console.log(db.collection("posts").doc(props.match.params.id).get().then((doc) => {console.log(doc.data())}))
    return (
        <div>
            Post here
        </div>
    )
}

export default PostView
