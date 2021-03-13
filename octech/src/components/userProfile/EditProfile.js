import React, { useState } from "react";
import { TextField, Avatar, Button } from "@material-ui/core";
import { useSelector } from "react-redux";
import { auth } from "../../firebase";
import { db } from "../../firebase";
import firebase from "firebase";
import EditIcon from "@material-ui/icons/Edit";
import { selectUser } from "../../features/userSlice";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";


const useStyles = makeStyles(theme => ({
  large: {
    width: theme.spacing(15),
    height: theme.spacing(15)
  },
  medium: {
    width: theme.spacing(5),
    height: theme.spacing(5)
  }
}));

function EditProfile() {
  const user = useSelector(selectUser);
  const [refs, setRefs] = useState([]);
  const [file, setFile] = useState();
  const classes = useStyles();
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
      // Since this is asyncronous on completion of the loading the image is set with the base64 string
      auth.currentUser.updateProfile({ photo_URL: reader.result });
      // alert("Image Uploaded Sucessfully!")
    };
  };

  const handleSubmit = async event => {
    event.preventDefault(); // Prevent default behavior of re-loading etc.

    const updateUserProfile = async () => {
      return this.db.collection("users").doc(auth.currentUser).update({
              name: data.username,
              email: data.email,
              avatar: data.photoUrl
            })
          }
  };

  const deleteProfile = () => {

    db.collection("users").doc(user.displayName).update({
      user: firebase.firestore.doc.docRemove() 
    })

    console.log(refs)
    refs.forEach((ids) => {
      console.log(ids);
      db.collection('postImages').doc(ids).delete();
      db.collection("forumPosts") 
        .doc(ids)
        .delete()
      db.collection("portfolios").doc(auth.currentUser).delete();
      
    });



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
        onClick={handleSubmit}
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
