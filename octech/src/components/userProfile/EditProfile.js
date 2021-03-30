import React, { useState } from "react";
import { TextField, Avatar, Button } from "@material-ui/core";
import { useSelector } from "react-redux";
import { auth } from "../../firebase";
import { db } from "../../firebase";
import EditIcon from "@material-ui/icons/Edit";
import { selectUser } from "../../features/userSlice";
import DeleteIcon from "@material-ui/icons/Delete";
import Alert from "@material-ui/lab/Alert";


function EditProfile() {
  const user = useSelector(selectUser);
  const [, setFile] = useState();
  const [data, setData] = useState({
    username: user.displayName,
    email: user.email,
    new_password: "",
    avatar: user.photoUrl
  });

  const handleUpload = async e => {
    // When a file is uploaded this function is called
    e.preventDefault();
    var reader = new FileReader();

    if (e.target.files[0] !== undefined) {
      reader.readAsDataURL(e.target.files[0]); // The image file is converted to its base64 equivalent string and is stored in reader as reader.result
      setFile(e.target.files[0]);
    }
    reader.onloadend = function() {
      auth.currentUser.updateProfile({ photo_URL: reader.result });
    };
  };

  const updateUserProfile = () => {
    db.collection("users")
      .doc(user.displayName)
      .update({
        name: data.username,
        email: data.email,
        photoUrl: data.avatar
      });
    auth.currentUser.updateProfile({
      name: data.username,
      email: data.email,
      avatar: data.avatar
    });
  };

  const deleteProfile = async () => {
    db.collection("users").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          if(doc.data().name === auth.currentUser.displayName)
            db.collection("users").doc(doc.id).delete()
      });
  });
  
  db.collection("posts").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          if(doc.data().name === auth.currentUser.displayName) {
            db.collection("postImages").get().then((postImage) => {
              postImage.forEach((docc) => {
                if(docc.data().ref === doc.id)
                  db.collection("postImages").doc(docc.id).delete()
              })
            })
           db.collection("posts").doc(doc.id).delete()
          }
      });
  });
  
  db.collection("portfolios").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          if(doc.id === auth.currentUser.displayName)
            db.collection("portfolios").doc(doc.id).delete()
      });
  });
  
  db.collection("forumPosts").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          if(doc.data().name === auth.currentUser.displayName) {
            db.collection("forumPosts").doc(doc.id).delete()
          }
      });
  });
  
  db.collection("collections").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          if(doc.data().creator === auth.currentUser.displayName) {
            db.collection("collections").doc(doc.id).delete()
          }
      });
  });
        auth.currentUser.delete()
        this.props.history.push('/login')
  };

  return (
    <div>
      {/* Profile Picture */}
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ margin: "0% auto" }}>
          <label htmlFor="fileUpload">
            <div style={{ cursor: "pointer" }}>
              <Avatar src={user.photoUrl}>{<EditIcon />}</Avatar>
            </div>
          </label>
          <input
            hidden
            id="fileUpload"
            type="file"
            accept="image/*"
            onChange={handleUpload}
          />
        </div>
      </div>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        value={data.username}
        id="username"
        label="Username"
        name="username"
        autoComplete="name"
        autoFocus
        onChange={e => setData({ ...data, username: e.target.value })}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        value={data.email}
        id="email"
        label="Email"
        name="email"
        autoComplete="email"
        autoFocus
        onChange={e => setData({ ...data, email: e.target.value })}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        value={data.username}
        id="name"
        label="Name"
        name="name"
        autoComplete="name"
        autoFocus
        onChange={e => setData({ ...data, username: e.target.value })}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        value={data.password}
        id="password"
        label="New Password"
        name="password"
        autoComplete="password"
        autoFocus
        onChange={e => setData({ ...data, new_password: e.target.value })}
      />
      <Button
        variant="contained"
        color="secondary"
        onClick={updateUserProfile}
        style={{ marginLeft: "10px" }}
      >
        <b>Submit</b>
      </Button>

      <Button
        variant="contained"
        color="secondary"
        className="deletebtn"
        onClick={deleteProfile}
        style={{ marginLeft: "10px" }}
        startIcon={<DeleteIcon />}
      >
        Delete Account
      </Button>
      <Alert severity="warning" color="secondary">
        This is will delete the whole account — <strong>Are you sure?</strong>
      </Alert>
    </div>
  );
}

export default EditProfile;


