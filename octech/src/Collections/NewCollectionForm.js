import React, { useState } from "react";
import { db,storage } from "../firebase";
import firebase from 'firebase'
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { useHistory } from "react-router-dom";


export const NewCollectionForm = () => {
    const user = useSelector(selectUser); // Select current user from slice
    const history = useHistory();
    const [collectionName, setCollectionName] = useState("");
    const [active, setActive] = useState("");
    const [file, setFile] = useState(null)
    const [inputImg, setInputImg] = useState("");
    const [largeFile, setLargeFile] = useState("");

    const onCollectionNameChange = (e) => {
        setCollectionName(e.target.value);
    };

    const onCollectionCreate = async () => {
        if (!collectionName) {
            return;
        }
        if (largeFile === "") {
            console.log("Small file using base64");
            const name = user.displayName + "_" + collectionName;
            db.collection("collections").doc(name).set({
                name: collectionName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                creator: user.displayName,
                cover: inputImg
            });
          }
    
          else {
            console.log("Large file using firebase storage");
            const storageRef = storage.ref()
            const fileRef = storageRef.child(file.name)
            await fileRef.put(file)
            db.collection("collections").doc(user.displayName + "_" + collectionName).set({
                name: collectionName,
                fileName: file.name,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                creator: user.displayName,
                cover: await fileRef.getDownloadURL() || ""
            });
        }
        history.push(`/user/${user.displayName + "/" + collectionName}`);
        setCollectionName("");
    };

    const newCollection = () => {
        setActive("active now")
    }

    const coverUpload = (e) => { // When a file is uploaded this function is called
        e.preventDefault();
        var reader = new FileReader();
        console.log(e.target.files[0]);
 
        if (e.target.files[0] !== undefined) {
          reader.readAsDataURL(e.target.files[0]); // The image file is converted to its base64 equivalent string and is stored in reader as reader.result
          setFile(e.target.files[0]);
        }
        reader.onloadend = function () { // Since this is asyncronous on completion of the loading the image is set with the base64 string
          console.log("RESULT", reader.result);
          setInputImg(reader.result);
          if (reader.result.length > 980000) {
            setLargeFile("Large File");
          }
          else {
            setLargeFile("")
          }
          // alert("Image Uploaded Sucessfully!")
        };
      };

    return (
        <>
            {((active) ? (
                <>
                    <input value={collectionName} onChange={onCollectionNameChange} type="text" />
                    <div>Upload Cover Image<input type="file" onChange={coverUpload}></input></div>
                    
                    <button onClick={onCollectionCreate}>Create Collection</button>
                </>
            ) : (
                    <button onClick={newCollection}>Create New Collection</button>
                ))}


        </>
    );
};
