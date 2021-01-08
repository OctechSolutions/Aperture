import { Avatar } from '@material-ui/core';
import React, { forwardRef } from 'react';
import './Post.css';
import { db, storage } from "../../../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/userSlice";
import firebase from "firebase";
import { Link } from "react-router-dom";

const Post = forwardRef(({ id, name, description, message, photoUrl, photoBase, styleModification }, ref) => {

  // const displayPosts = () => {
  //   console.log("hello", name);
  //   db.collection("posts").where("name", "==", name).get()
  //     .then(function (querySnapshot) {
  //       var postArray = [];
  //       querySnapshot.forEach(function (doc) {
  //         // doc.data() is never undefined for query doc snapshots
  //         console.log(doc.id, " => ", doc.data());
  //         postArray.push(doc.id);
  //       });
  //       console.log(postArray);
  //     })
  //     .catch(function (error) {
  //       console.log("Error getting documents: ", error);
  //     })
  // }



  const user = useSelector(selectUser); // Select current user from slice
  const deletePost = () => { // This function is called when the delete button is clicked


    db.collection("users").doc(user.displayName).update({
      posts: firebase.firestore.FieldValue.arrayRemove(id) // The post is removed from the users array of posts
    })


    if (photoBase) {
      if (photoBase[0] !== "d") {
        const storageRef = storage.ref()
        var ref = storageRef.child(id);
        

        // Delete the file
        ref.delete().then(function () {
          // File deleted successfully
          console.log(id, " deleted from storage!")
        })
      }
    }

    db.collection("posts") // The post is removed from the posts database
      .doc(id)
      .delete()
      .then(function () {
        console.log("deleted post successfully!");
        console.log(id);
      })
      .catch(function (error) {
        console.log(`Error post info delete ${error}`);
      });
    
  };

  return (
    <div ref={ref} className="post">
      <div className="post_title">
        <div className="post_header">
          <Avatar src={photoUrl}></Avatar> {/* Material ui component for avatar */}
          <div className="postInfo">
            <Link style={{ textDecoration: 'none', fontSize: '12px', color: "black" }} to={`/user/${name}`}><h2>{name}</h2></Link>  {/* Link is a component from react router that redirects to a particular route on click */}
            {/* This dynamically creates a new page with /user/{username} and sends the user to that page */}
            <p>{description}</p>
          </div>
        </div>
        {
          (user.displayName === name) &&
          <p onClick={deletePost} className="post__delete">Delete</p>

        }
      </div>
      <div className="post_body">
        <p>{message}</p>
        <br />
      </div>
      <div className="post__image">{photoBase && <img src={photoBase} style={styleModification} alt="User Post" />}</div>
    </div>
  );
});

export default Post;
