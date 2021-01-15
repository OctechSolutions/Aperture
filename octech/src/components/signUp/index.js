/* Inspired from YouTube video 
   "Firebase React Authentication Tutorial For Beginners - Private Route With Hooks"
   uploaded on May 5, 2019 by "Maksim Ivanov" */

import React, { useCallback, useState } from 'react';
import { 
    Auth, 
    SignInWithGoogle,
    Storage,
    Db
} from '../../config';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import EditIcon from '@material-ui/icons/Edit';
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { login } from '../../features/userSlice';

const SignUp = () => {

    const [profilePic, setProfilePic] = useState("");
    const [file, setFile] = useState();
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const history = useHistory();
    const dispatch = useDispatch(); // Keep track of changes on the user slice


    const handleUpload = async (e) => { // When a file is uploaded this function is called
        e.preventDefault();
        var reader = new FileReader();

        if (e.target.files[0] !== undefined) {
            reader.readAsDataURL(e.target.files[0]); // The image file is converted to its base64 equivalent string and is stored in reader as reader.result
            setFile(e.target.files[0])
        }
        reader.onloadend = function () { // Since this is asyncronous on completion of the loading the image is set with the base64 string
            console.log("RESULT", reader.result);
            setProfilePic(reader.result);
            // alert("Image Uploaded Sucessfully!")
        };
    };

    // handleSubmit = What to do when the sign up form is submitted?
    // eslint-disable-next-line
    const handleSubmit = useCallback(async event => {
        event.preventDefault() // Prevent default behavior of re-loading etc.

        const updateUserProfile = async () => {
            if (file !== undefined) {
                const storageRef = Storage.ref();
                const fileRef = storageRef.child(file.name);
                fileRef.put(file).then(() => {
                    fileRef.getDownloadURL().then((doc) => {
                        Auth.currentUser.updateProfile({
                            displayName: username,
                            photoURL: doc
                        }).then(() => {
                            console.log(Auth.currentUser)
                            history.push("/feed") // Push the home page to history to redirect to it.
                            Db.collection("users").doc(username).set({
                                name: username,
                                email: email,
                                photoUrl: doc,
                                realName: name,
                                contactNumber: contactNumber
                            }, { merge: true });
                            dispatch(login({
                                email: email,
                                displayName: username,
                                photoUrl: doc
                            }))
                        })

                    })
                })

            } else {
                return Auth.currentUser.updateProfile({
                    displayName: username
                }).then(() => {
                    dispatch(login({
                        email: email,
                        displayName: username,
                    }))
                })
            }
        }



        /* If both the 1st typed password and the confirmed password are
           same, then proceed to sign up. Else promt user to input matching
           passwords. */
        if (confirmPassword === password) {
            try {
                await Auth // Wait until the user has been added to authenticated users list in Firebase.
                    .createUserWithEmailAndPassword(email, confirmPassword)
                await updateUserProfile()

            } catch (error) {
                alert(error)
                console.log(error)
            }
        } else {
            alert("The password and the confirmed password must match.")
        }
    })

    // Returns a Sign Up form.
    return (
        <>
            <div>
                <label htmlFor="fileUpload">
                    <div>

                        <EditIcon />
                    </div>
                </label>
                <input hidden id="fileUpload" type="file" accept="image/*" onChange={handleUpload} />
            </div>
            <form className="sign-up" >
                {/* Profile Picture */}


                <input
                    name="profilePic"
                    type="image"
                    src={profilePic || "https://cdn.pixabay.com/photo/2018/11/13/21/43/instagram-3814049_1280.png"}
                    alt="Submit"
                    id="profile-pic"
                />

                <br></br>

                {/* Name Input */}
                <input
                    name="name"
                    required={true}
                    type="text"
                    className="mb-3 form-control"
                    placeholder="Name *"
                    onChange={(e) => setName(e.target.value)}
                />

                {/* Username Input */}
                <input
                    name="username"
                    required={true}
                    type="text"
                    className="mb-3 form-control"
                    placeholder="Username *"
                    onChange={(e) => setUsername(e.target.value)}
                />

                {/* Email Input */}
                <input
                    name="email"
                    required={true}
                    type="email"
                    className="mb-3 form-control"
                    placeholder="Email *"
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* Password Input */}
                <input
                    name="password"
                    required={true}
                    type="password"
                    className="mb-3 form-control"
                    placeholder="Password *"
                    onChange={(e) => setPassword(e.target.value)}
                />

                {/* Password Confirmation Input */}
                <input
                    name="passwordConfirm"
                    required={true}
                    type="password"
                    className="mb-3 form-control"
                    placeholder="Confirm Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {/* Contact Number Input */}
                <input
                    name="contactNumber"
                    type="tel"
                    className="mb-3 form-control"
                    placeholder="Contact Number"
                    onChange={(e) => setContactNumber(e.target.value)}
                />

                {/* Submit Button Input */}
                <input
                    name="submitBtn"
                    className="btn btn-primary mb-3"
                    type="submit"
                    value="Submit"
                    style={{ width: "100%" }}
                    onClick={handleSubmit}
                />

                {/* Google Sign Up Button Input */}
                <button
                    style={{ width: "100%" }}
                    onClick={SignInWithGoogle}
                >Log In with Google</button>

            </form></>
    )
}

export default SignUp
