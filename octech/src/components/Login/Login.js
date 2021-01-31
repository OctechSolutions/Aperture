import React, { useState } from "react";
import { Form, Alert } from "react-bootstrap";
import Button from '@material-ui/core/Button';
import { useHistory } from "react-router-dom";
import './Login.css';
import { signInWithGoogle } from '../../firebase';
import { auth } from "../../firebase"
import SignUp from "../signUp/signUp";
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
import SvgIcon from '@material-ui/core/SvgIcon';
// import ConsentForm from '../ConsentForm/ConsentForm'



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
      });
  }

  const forgotPassword = () => {
    console.log("Forgot Password Clicked");
    setForgotPasswordClicked(true);
  }

  const submitForgotPassword = () => {
    if (resetEmail) {
      auth.sendPasswordResetEmail(resetEmail).then(function () {
        // Email sent.
        setResetEmailSent(true);
      }).catch(function (error) {
        // An error happened.
      });

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
              <Form.Label type="button" style={{ width: "100%",marginLeft: "auto", marginRight: "auto" }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary" type="submit">
                  <b>Login</b>
                </Button>
              </Form.Label>
            </Form.Group><center> <Form.Label style={{ marginBottom: "15px" }}>OR</Form.Label> </center>
            <Form.Group>
              <Form.Label type="button" style={{ width: "100%",marginLeft: "auto", marginRight: "auto" }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary" onClick={signInWithGoogle}>
                  <SvgIcon>
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                  </SvgIcon>
                  <div style={{ width: "20px" }} />
                  <b>Login with Google</b>
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
          <div style={{ display: "flex", marginLeft: "auto", marginRight: "-32px" }}>
            <h4>Sign Up</h4>
          </div>

        </Modal.Header>
        <Modal.Body>
          {/* <SignUp onPicUpload={() => {setShowConsentForm(true)}}/> */}
          <SignUp />
        </Modal.Body>
      </Modal>

      {/* <ConsentForm 
          show={showConsentForm}
          heading={"Dear User,"}
          message={"We at Aperture would like to inform you that if you choose to upload an image of yourself as your profile picture, it will stored in our db. Please comply to continue."}
          btnLabel={"You Have My Consent"}
          closeFun={() => {setShowConsentForm(false)}}
          onBtnClickFun={() => {
            console.log("consent form btn clicked.")
          }}
      /> */}

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

