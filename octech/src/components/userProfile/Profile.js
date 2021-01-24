import React, { useState, useEffect } from 'react';
import { db, storage } from "../../firebase";
import FlipMove from "react-flip-move";
import Post from "../Body/Post/Post.js";
import { Link } from 'react-router-dom';
import { NewCollectionForm } from '../../Collections/NewCollectionForm';
import '../../Collections/Collection.css';
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import Channels from "../Channels/Channels";
import Tabs from "react-bootstrap/Tabs";
import Tab from 'react-bootstrap/Tab';
import Portfolio from '../Body/Portfolio/Portfolio.js';


function Profile({ match }) {
    const user = useSelector(selectUser); // Select current user from slice
    const [profileInfo, setProfileInfo] = useState({}); // Stores the info of the user from the db
    const [posts, setPosts] = useState([]); // Stores the posts of the user
    const [collections, setCollections] = useState([]);
    const [key, setKey] = useState('posts');
    useEffect(() => {
        const unmount = db.collection("collections").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
            const tempCollections = [];
            snapshot.forEach((doc) => {
                tempCollections.push({ ...doc.data(), id: doc.id });
            });
            setCollections(tempCollections);
        });
        return unmount;
    }, []);

    useEffect(() => {
        console.log(match); // match returns a lot of properties from the react router dom including the id we set for the urls of the router to be dynamic
        db.collection("users").doc(match.params.id) // We get the user from the db whose id matches the name of the user
            .get().then(function (doc) {
                if (doc.exists) {
                    setProfileInfo(doc.data()); // profileInfo is set with the data recieved from the db
                } else {
                    console.log("No such document!");
                }
            }).catch(function (error) {
                console.log("Error getting document:", error);
            });
    }, [match]);

    useEffect(() => {

        db.collection("posts") // Posts are fetched from the db
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) =>
                setPosts(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                )
            );
    }, []);

    function deleteCollection(collection) {

        db.collection("collectionImages")
            .where("name", "==", collection.name)
            .where("creator", "==", collection.creator)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    if (doc.data().url[0] !== "d") {
                        const storageRef = storage.ref()
                        var ref = storageRef.child(doc.data().fileName);


                        // Delete the file
                        ref.delete().then(function () {
                            // File deleted successfully
                            console.log(doc.data().fileName, " deleted from storage!")
                        })
                    }
                    db.collection("collectionImages") // The post is removed from the posts database
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

        db.collection("collections").doc(collection.id).get().then(function (doc) {
            if (doc.data().cover && (doc.data().cover[0] !== 'd')) {
                const storageRef = storage.ref()
                var ref = storageRef.child(doc.data().fileName);
                // Delete the file
                ref.delete().then(function () {
                    // File deleted successfully
                    console.log(doc.data().fileName, " deleted from storage!")
                })
            }
        }).then(function () {
            db.collection("collections").doc(collection.id).delete().then(function () {
                console.log("deleted collection successfully!");
                console.log(collection.id);
            })
                .catch(function (error) {
                    console.log(`Error in collection delete ${error}`);
                });
        })
    }


    return (
        <div className="profile" style={{ color: "black", width: "100%" }}>
            {profileInfo && <center><h1>{profileInfo.name}</h1></center>}
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                variant="pills"
            >
                <Tab eventKey="posts" title="Posts" style={{ color: "black", width: "100%" }}>
                    {<FlipMove>
                        {posts.map(
                            ({
                                id,
                                data: { name, description, message, photoUrl, photoBase, styleModification, comments, channel, hasCoordinates, lat, lng },
                            }) => (name === match.params.id) && ( // Only the posts the current user has made are shown
                                <Post
                                    key={id}
                                    id={id}
                                    name={name}
                                    description={description}
                                    message={message}
                                    photoUrl={photoUrl}
                                    photoBase={photoBase}
                                    styleModification={styleModification}
                                    comments={comments}
                                    channel={channel}
                                    hasCoordinates={hasCoordinates}
                                    lat={lat}
                                    lng={lng}
                                />
                            )
                        )}
                    </FlipMove>
                    }
                </Tab>
                <Tab eventKey="collections" title="Collections" style={{ color: "black", width: "100%" }}>
                    {(profileInfo.name === user.displayName) && <footer><NewCollectionForm /></footer>}
                    <section>
                        {collections.map((collection) => (
                            (profileInfo.name === collection.creator) &&

                            <aside key={collection.name}>
                                {(collection.creator === user.displayName) && <p onClick={() => deleteCollection(collection)} className="post__delete">Delete</p>}

                                <Link to={`/user/${collection.id.split("_")[0] + "/" + collection.id.split("_")[1]}`}>
                                    {collection.cover ? <img src={collection.cover} alt="collection" /> :
                                        <img src={"https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png"} alt="Empty-Collection" />}
                                    <h3>{collection.name}</h3>
                                </Link>
                            </aside>
                        ))}
                    </section>
                </Tab>
                <Tab eventKey="channels" title="Channels" style={{ color: "black", width: "100%" }}>
                    <Channels profileName={match.params.id} />
                </Tab>
                <Tab eventKey="portfolio" title="Portfolio" style={{ color: "black", width: "100%" }}>
                    <Portfolio />
                </Tab>
            </Tabs>

            {console.log(profileInfo.posts)}

        </div>
    )
}

export default Profile
