import { Avatar } from '@material-ui/core';
import React, { forwardRef } from 'react';
import './Post.css';
import { db } from "../../../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/userSlice";
import firebase from "firebase";

const Post = forwardRef(({ id, name, description, message, photoUrl, photoBase, styleModification }, ref) => {
  const displayPosts = () => {
    console.log("hello", name);
    db.collection("posts").where("name", "==", name).get()
      .then(function (querySnapshot) {
        var postArray = [];
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          postArray.push(doc.id);
        });
        console.log(postArray);
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      })
  }



  const user = useSelector(selectUser);
  const deletePost = () => {


    db.collection("users").doc(user.displayName).update({
      posts: firebase.firestore.FieldValue.arrayRemove(id)
    })


    db.collection("posts")
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
          <Avatar src={photoUrl} onClick={displayPosts}></Avatar>
          <div className="postInfo">
            <h2>{name}</h2>
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
