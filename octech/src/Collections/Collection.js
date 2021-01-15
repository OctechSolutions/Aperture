import React, { useState, useEffect } from "react";
import { useRouteMatch, Link } from "react-router-dom";
import { NewPhoto } from "./NewPhoto.js";
import { Db, Storage, SelectUser } from "../config";
import { useSelector } from "react-redux";
import Carousel from 'react-bootstrap/Carousel';


function Collection() {
    const user = useSelector(SelectUser); // Select current user from slice
    const [images, setImages] = useState([]);
    const [collectionName, setCollectionName] = useState("");

    const match = useRouteMatch("/user/:id/:collection");
    const { collection, id } = match.params;

    useEffect(() => {
        Db.collection("collections")
            .doc(id + "_" + collection)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    setCollectionName(doc.data().name);
                }
            });

    }, [collection, id]);

    useEffect(() => {
        const unmount = Db.collection("collectionImages").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
            const tempCollections = [];
            snapshot.forEach((doc) => {
                tempCollections.push({ ...doc.data() });
            });
            setImages(tempCollections);
        });
        return unmount;
    }, []);

    function deleteCollectionImage(ref) {
        Db.collection("collectionImages")
            .where("ref", "==", ref)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    if (doc.data().url[0] !== "d") {
                        const storageRef = Storage.ref()
                        var ref = storageRef.child(doc.data().fileName);


                        // Delete the file
                        ref.delete().then(function () {
                            // File deleted successfully
                            console.log(doc.data().fileName, " deleted from Storage!")
                        })
                    }
                    Db.collection("collectionImages") // The post is removed from the posts database
                        .doc(doc.data().ref)
                        .delete()
                        .then(function () {
                            console.log("deleted image successfully!");
                            console.log(doc.data().ref);
                        })
                        .catch(function (error) {
                            console.log(`Error in image delete ${error}`);
                        });

                });
            })
    }

    return (
        <>
            <section>
                <header>
                    <h1>{collectionName}</h1>
                    <p><Link to={`/user/${id}`}>Go Back</Link></p>
                </header>
            </section>
            <div style={{
                display: "block",
                width: "70%",
                maxHeight: "50vh",
                marginLeft: "auto",
                marginRight: "auto"
            }}>
                <Carousel interval={null}>
                    {images.map((image) => (
                        (image.name === collectionName) && (id === image.creator) &&
                        <Carousel.Item>
                            <img src={image.url} style={{
                                display: "block",
                                width: "90%",
                                maxHeight: "50vh",
                                marginLeft: "auto",
                                marginRight: "auto"
                            }} alt="collection" />
                            <Carousel.Caption>
                                {(id === user.displayName) && <p onClick={() => deleteCollectionImage(image.ref)} className="post__delete">Delete</p>}
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))}

                </Carousel>
            </div>
            {(id === user.displayName) &&
                <footer>
                    <NewPhoto />
                </footer>
            }

        </>
    );
};

export default Collection;