import { Avatar } from '@material-ui/core';
import React, { forwardRef, useState, useEffect } from 'react';
import './Post.css';
import { db, storage } from "../../../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/userSlice";
import firebase from "firebase";
import { Link } from "react-router-dom";
import ImageGallery from '../Feed/ImageGallery';
import Modal from 'react-bootstrap/Modal';
import CommentIcon from '@material-ui/icons/Comment';
import { Form } from "react-bootstrap";
import SendIcon from '@material-ui/icons/Send';
import MapIcon from '@material-ui/icons/Map';
import Map from '../Map/Map';

const Post = forwardRef(({ id, name, description, message, photoUrl, largeGifs, comments, channel, hasCoordinates, lat, lng }, ref) => {

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

  if (comments === undefined) {
    comments = [];
  }

  const [images, setImages] = useState([]);
  const [refs, setRefs] = useState([]);
  const [show, setShow] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [comment, setComment] = useState("");

  const handleClose = () => setShow(false);
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
        // console.log(doc.data(), doc.id)
      });
      setImages(tempImages);
      setRefs(tempRefs);
    });
  }, [id]);


  const postComment = () => {
    console.log(comment, id);
    if (comment.replace(/\s/g, '').length) {
      db.collection("posts").doc(id).update({
          comments: firebase.firestore.FieldValue.arrayUnion({
          name: user.displayName,
          comment: comment,
          number: comments.length
        }) // The post is removed from the users array of posts
      })
      setComment("");
    }

  }

  const user = useSelector(selectUser); // Select current user from slice
  const deletePost = () => { // This function is called when the delete button is clicked


    db.collection("users").doc(user.displayName).update({
      posts: firebase.firestore.FieldValue.arrayRemove(id) // The post is removed from the users array of posts
    })


    console.log(refs)
    refs.forEach((ids) => {
      console.log(ids);
      db.collection('postImages').doc(ids).delete();
      console.log("Post image deleted!")
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
    slideshow = <div ><ImageGallery sliderImages={images} /></div>;
  }
  else {
    slideshow = <></>
  }

  const commentsModal = () => {
    return (
      <Modal
        show={showComments}
        keyboard={false}
        onHide={() => { setShowComments(false) }}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        scrollable={true}
        centered
      >
        <Modal.Header closeButton onClick={() => { setShowComments(false) }}>
          <h3>Comments</h3>
        </Modal.Header>
        <Modal.Body>
          <Form style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }} onSubmit={(e) => { e.preventDefault(); postComment() }}>
            <Form.Group className="w-100">
              <Form.Control type="text" placeholder="Comment..." value={comment} onChange={(e) => setComment(e.target.value)} required style={{ marginLeft: "auto", marginRight: "auto" }} />
            </Form.Group>
            <Form.Group>
              <SendIcon style={{ fontSize: "45px" }} onClick={postComment} />
            </Form.Group>
          </Form>
          <br />
          {
            comments.sort((a, b) => b.number - a.number).map((c) => {
              return <div><Link style={{ textDecoration: 'none', fontSize: '20px', color: "black" }} to={`/user/${c.name}`}><b>{c.name}</b></Link>   {c.comment}</div>
            })
          }
        </Modal.Body>
      </Modal>
    )
  }

  return (
    <div ref={ref} className="post" >
      { (channel?.length > 0) ? <div className="post_channel">
        <p className="h4">Posted in <b><Link to={`/user/${name + "/channel/" + channel}`}>{channel}</Link></b></p>
        <hr />
      </div>
      : ''}
      <div className="post_title">
        <div className="post_header">
          <Avatar src={photoUrl}></Avatar> {/* Material ui component for avatar */}
          <div className="postInfo">
            <Link style={{ textDecoration: 'none', fontSize: '20px', color: "black" }} to={`/user/${name}`}>{name}</Link>  {/* Link is a component from react router that redirects to a particular route on click */}
            {/* This dynamically creates a new page with /user/{username} and sends the user to that page */}
            <p>{description}</p>
          </div>
        </div>
        {
          (user.displayName === name) &&
          <p onClick={deletePost} className="post__delete">Delete</p>
        }
      </div>
      <div className="post_body" onClick={() => setShow(true)}>
        <p>{message}</p>
      </div>
      {slideshow}
      <br />
      <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
        <CommentIcon onClick={() => { setShowComments(true) }} />
        {hasCoordinates && <MapIcon onClick={() => { setShowMap(true) }} />}
      </div>
      {commentsModal()}
      <Modal
        show={show}
        onHide={handleClose}
        keyboard={false}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        scrollable={true}
        centered
      >
        <Modal.Header closeButton onClick={handleClose}>
          <div className="post_header">
            <Avatar src={photoUrl}></Avatar> {/* Material ui component for avatar */}
            <div className="postInfo">
              <Link style={{ textDecoration: 'none', fontSize: '20px', color: "black" }} to={`/user/${name}`}>{name}</Link>  {/* Link is a component from react router that redirects to a particular route on click */}
              {/* This dynamically creates a new page with /user/{username} and sends the user to that page */}
              <p>{description}</p>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="post_body">
            <p>{message}</p>
            <br />
          </div>
          {slideshow}
          <h3>Comments</h3>
          <Form style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }} onSubmit={(e) => { e.preventDefault(); postComment() }}>
            <Form.Group className="w-100">
              <Form.Control type="text" placeholder="Comment..." value={comment} onChange={(e) => setComment(e.target.value)} required style={{ marginLeft: "auto", marginRight: "auto" }} />
            </Form.Group>
            <Form.Group>
              <SendIcon style={{ fontSize: "45px" }} onClick={postComment} />
            </Form.Group>
          </Form>
          <br />
          {
            comments.sort((a, b) => b.number - a.number).map((c) => {
              return <div><Link style={{ textDecoration: 'none', fontSize: '20px', color: "black" }} to={`/user/${c.name}`}><b>{c.name}</b></Link>{c.comment}</div>
            })
          }
        </Modal.Body>
      </Modal>

      <Modal
        show={showMap}
        onHide={() => {setShowMap(false)}}
        keyboard={false}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton onClick={() => {setShowMap(false)}}><h3 style={{marginLeft: "auto"}}>Map View</h3></Modal.Header>
        <Modal.Body>
        <Map
            center={{ lat: lat, lng: lng }}
            height='100vh'
            zoom={15}
            draggable={false}
          />
        </Modal.Body>
      </Modal>

    </div>
  );
});

export default Post;
