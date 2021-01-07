import React, { useState, useEffect } from 'react';
import { db } from "../../firebase";
import FlipMove from "react-flip-move";
import Post from "../../components/Body/Post/Post.js";

function Profile({ match }) {
    const [profileInfo, setProfileInfo] = useState({}); // Stores the info of the user from the db
    const [posts, setPosts] = useState([]); // Stores the posts of the user

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


    return (
        <div className="profile">

            {console.log(profileInfo.posts)}
            {profileInfo && <h1>{profileInfo.name}</h1>}

            {<FlipMove>
                {posts.map(
                    ({
                        id,
                        data: { name, description, message, photoUrl, photoBase, styleModification },
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
                        />
                    )
                )}
            </FlipMove>
            }
        </div>
    )
}

export default Profile
