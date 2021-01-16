import React, { useState } from 'react'
import firebase from 'firebase'
import { Db, Storage, SelectUser } from '../../../config'
import { useRouteMatch } from "react-router-dom"
import { useSelector } from "react-redux"

export const NewPhoto = () => {
    const user = useSelector(SelectUser); // Select current user from slice
    const [file, setFile] = useState(null)
    const [inputImg, setInputImg] = useState("");
    const [largeImage, setLargeImage] = useState("");

    const onFileChange = (e) => {
        setFile(e.target.files[0])
        var reader = new FileReader();
        console.log(e.target.files[0], e.target.files[0].size);
        if (e.target.files[0] !== undefined) {
            reader.readAsDataURL(e.target.files[0]); // The image file is converted to its base64 equivalent string and is stored in reader as reader.result
        }
        reader.onloadend = function () { // Since this is asyncronous on completion of the loading the image is set with the base64 string
            console.log("RESULT", reader.result);
            setInputImg(reader.result);
            if (reader.result.length > 980000) {
                setLargeImage("Large File");
            }
            else {
                setLargeImage("")
            }
            // alert("Image Uploaded Sucessfully!")
        };
    }
    const match = useRouteMatch();

    const onUpload = async () => {
        if (file) {
            console.log(file);
            if (largeImage !== "") {
                const storageRef = Storage.ref()
                const fileRef = storageRef.child(file.name)
                await fileRef.put(file);
                const ref = Db.collection('collectionImages').doc() // A reference to the next entry to the database is created in advance
                ref.set({
                    ref: ref.id,
                    name: match.params.collection,
                    fileName: file.name,
                    url: await fileRef.getDownloadURL(),
                    creator: user.displayName,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                });
            }
            else {
                const ref = Db.collection('collectionImages').doc() // A reference to the next entry to the database is created in advance
                ref.set({
                    ref: ref.id,
                    name: match.params.collection,
                    url: inputImg,
                    creator: user.displayName,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        }
        console.log(match)

        setLargeImage("");
        setInputImg("");
        setFile("");
    }

    return <>
        <input type="file" onChange={onFileChange} />
        <button onClick={onUpload}>Upload image</button>
    </>
}