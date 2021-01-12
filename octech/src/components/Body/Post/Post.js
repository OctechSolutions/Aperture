import { Avatar } from '@material-ui/core';
import React, { forwardRef, useState, useEffect } from 'react';
import './Post.css';
import { db, storage } from "../../../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/userSlice";
import firebase from "firebase";
import { Link } from "react-router-dom";
import ImageGallery from '../Feed/ImageGallery';

const Post = forwardRef(({ id, name, description, message, photoUrl, largeGifs }, ref) => {

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



  const [images, setImages] = useState([]);
  const [refs, setRefs] = useState([]);
  useEffect(() => {
    db.collection("postImages").where("ref", "==", id).onSnapshot((snapshot) => {
      const tempImages = [];
      const tempRefs = [];
      snapshot.forEach((doc) => {
        tempImages.push({
          src: doc.data().url,
          style: doc.data().styleModification
        });
        tempRefs.push(doc.id);
        console.log(doc.data(), doc.id)
      });
      setImages(tempImages);
      setRefs(tempRefs);
    });
  }, [id]);




  const user = useSelector(selectUser); // Select current user from slice
  const deletePost = () => { // This function is called when the delete button is clicked


    db.collection("users").doc(user.displayName).update({
      posts: firebase.firestore.FieldValue.arrayRemove(id) // The post is removed from the users array of posts
    })



    console.log(refs)
    refs.forEach((ids) => {
      console.log(ids);
      db.collection('postImages').doc(ids).delete();
    });

    if (largeGifs) {
      largeGifs.forEach((name) => {
        const storageRef = storage.ref()
        var ref = storageRef.child(name);

        // Delete the file
        ref.delete().then(function () {
          // File deleted successfully
          console.log(name, " deleted from storage!")
        })
      })
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


  var slideshow;
  if (images.length === 1) {
    slideshow = <div className="post__image"><img src={images[0].src} style={images[0].style} alt="User Post" /></div>;
  } else if (images.length > 1) {
    slideshow = <div className="post__image"><ImageGallery sliderImages={images} /></div>;
  }
  else {
    slideshow = <></>
  }

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
      {slideshow}
    </div>
  );
});

export default Post;
