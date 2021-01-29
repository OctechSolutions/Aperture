<<<<<<< HEAD
import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useHistory } from "react-router-dom"
import './Login.css'
import { signInWithGoogle } from '../../firebase'
import { auth } from "../../firebase"
import SignUp from "../signUp"
import { useDispatch } from 'react-redux'
import { login } from '../../features/userSlice'
import Modal from 'react-bootstrap/Modal'
=======
import React, { useState } from "react";
import { Form, Alert } from "react-bootstrap";
import Button from '@material-ui/core/Button';
import { useHistory } from "react-router-dom";
import './Login.css';
import { signInWithGoogle } from '../../firebase';
import { auth } from "../../firebase"
import SignUp from "../signUp";
import { useDispatch } from 'react-redux';
import { login } from '../../features/userSlice';
import Modal from 'react-bootstrap/Modal';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import { InputAdornment } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
>>>>>>> 01ef07b614ef08abdd8f4a4bcdc136c64989203a



const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    width: theme.spacing(7),
    height: theme.spacing(7),
    margin: "0 auto"
  },
  icon: {
    width: theme.spacing(4),
    height: theme.spacing(4)
  }
}));

export default function Login() {

  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [show, setShow] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetEmailSent, setResetEmailSent] = useState(false)
<<<<<<< HEAD
  const history = useHistory()
  const dispatch = useDispatch() // Keep track of changes on the user slice
  const [forgotPasswordClicked, setForgotPasswordClicked] = useState(false)
=======
  const history = useHistory();
  const dispatch = useDispatch(); // Keep track of changes on the user slice
  const [forgotPasswordClicked, setForgotPasswordClicked] = useState(false);
  const classes = useStyles();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

>>>>>>> 01ef07b614ef08abdd8f4a4bcdc136c64989203a

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    auth.signInWithEmailAndPassword(email, password)
      .then(function (result) {
        history.push("/")
        console.log(result)
        dispatch(login({
          email: result.user.email,
          uid: result.user.uid,
          displayName: result.user.displayName,
          photoUrl: result.user.photoURL,
        }))
      }).catch(function (error) {
        console.log(error)
        setError("Failed to log in")
<<<<<<< HEAD
      })

    setLoading(false)
=======
      });
>>>>>>> 01ef07b614ef08abdd8f4a4bcdc136c64989203a
  }

  const forgotPassword = () => {
    console.log("Forgot Password Clicked")
    setForgotPasswordClicked(true)
  }

  const submitForgotPassword = () => {
    if (resetEmail) {
      auth.sendPasswordResetEmail(resetEmail).then(function () {
        // Email sent.
<<<<<<< HEAD
        setResetEmailSent(true)
      }).catch(function(error) {
        // An error happened.
      })
      
=======
        setResetEmailSent(true);
      }).catch(function (error) {
        // An error happened.
      });

>>>>>>> 01ef07b614ef08abdd8f4a4bcdc136c64989203a
    }
  }

  return (
    <div>
      {!show &&
        <div className="logInContainer" style={{ marginTop: "10vh", marginLeft: "auto", marginRight: "auto" }}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon className={classes.icon} />
          </Avatar>
          <h3 className="text-center mb-2">Log In</h3>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="filled-adornment-password"
                InputProps=
                {{
                  endAdornment:
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>

                }}

                labelWidth={60}
                // autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}

              />
              <div className="w-100 text-center mt-3">
                <p style={{ cursor: "pointer" }} onClick={forgotPassword}>Forgot Password?</p>
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label type="button" style={{ marginLeft: "auto", marginRight: "auto" }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary" type="submit">
                  <b>Log In</b>
                </Button>
              </Form.Label>
            </Form.Group><center> <Form.Label style={{ marginBottom: "15px" }}>OR</Form.Label> </center>
            <Form.Group>
              <Form.Label type="button" style={{ marginLeft: "auto", marginRight: "auto" }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary" onClick={signInWithGoogle}>
                  <b>Log In with Google</b>
                </Button>
              </Form.Label>
            </Form.Group>

          </Form>
          <div className="w-100 text-center mt-2">
            New to Aperture? <Button onClick={() => { setShow(true); }}
              type="submit"
              variant="contained"
              color="secondary"><b>Sign Up</b></Button>
          </div>

        </div>
      }

      <Modal
        show={show}
        keyboard={false}
        size="m"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton onClick={() => { setShow(false) }}>
          {/* Sign Up Heading */}
          <div style={{display: "flex", marginLeft: "auto", marginRight: "-32px"}}>
            <h4>Sign Up</h4>
          </div>

        </Modal.Header>
        <Modal.Body>
          <SignUp />
        </Modal.Body>
      </Modal>

      <Modal
        show={forgotPasswordClicked}
        keyboard={false}
        size="s"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton onClick={() => { setForgotPasswordClicked(false) }}>
          {/* Sign Up Heading */}
          <h4 style={{ marginLeft: "auto", marginRight: "-25px" }}>Forgot Password</h4>
        </Modal.Header>
        <Modal.Body>
          {resetEmailSent ? <>Reset Email Sent!</> :

            <Form>
              <Form.Group id="email">
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label type="button" style={{ marginLeft: "auto", marginRight: "auto" }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary" onClick={submitForgotPassword}>
                    <b>Send Password Reset Email</b>
                  </Button>
                </Form.Label>
              </Form.Group>
            </Form>
          }
        </Modal.Body>
      </Modal>
    </div>
  )
}

