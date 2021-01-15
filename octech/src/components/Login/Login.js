import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import './Login.css';
import { signInWithGoogle } from '../../firebase';
import { auth } from "../../firebase"
import SignUp from "../signUp";
import { useDispatch } from 'react-redux';
import { login } from '../../features/userSlice';
import Modal from 'react-bootstrap/Modal';




export default function Login() {

  const emailRef = useRef()
  const passwordRef = useRef()
  // const { login } = useContext(React.createContext())
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const history = useHistory();
  const dispatch = useDispatch(); // Keep track of changes on the user slice

  async function handleSubmit(e) {
    e.preventDefault()


    setError("")
    setLoading(true)
    // await login(emailRef.current.value, passwordRef.current.value)
    auth.signInWithEmailAndPassword(emailRef.current.value, passwordRef.current.value)
      .then(function (result) {
        history.push("/feed")
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


    setLoading(false)
  }

  return (
    <>
      {!show &&
        <>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Log In</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                  <Form.Label style={{ marginLeft: "auto", marginRight: "auto" }}>Email Address</Form.Label>
                  <Form.Control type="email" ref={emailRef} required style={{ marginLeft: "auto", marginRight: "auto" }} />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label style={{ marginLeft: "auto", marginRight: "auto" }}>Password</Form.Label>
                  <Form.Control type="password" ref={passwordRef} required style={{ marginLeft: "auto", marginRight: "auto" }} />
                  <div className="w-100 text-center mt-3">
                    <Link to="/forgot-password">Forgot Password?</Link>
                  </div>
                </Form.Group>
                <Form.Group>
                  <Form.Label type="button" style={{ marginLeft: "auto", marginRight: "auto" }}>
                    <Button disabled={loading} className="w-100" type="submit">
                      Log In
                    </Button>
                  </Form.Label>
                </Form.Group><center> <Form.Label style={{ marginBottom: "15px" }}>OR</Form.Label> </center>
                <Form.Group>
                  <Form.Label type="button" style={{ marginLeft: "auto", marginRight: "auto" }}>
                    <Button disabled={loading} className="w-100" onClick={signInWithGoogle}>
                      Log In with Google
                    </Button>
                  </Form.Label>
                </Form.Group>

              </Form>


            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
            New to Aperture? <button onClick={() => { setShow(true); console.log("hello") }}>Sign Up</button>
          </div>
        </>
      }

      <Modal
        show={show}
        keyboard={false}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton onClick={() => { setShow(false) }}>
          {/* Sign Up Heading */}
          <h4 style={{ marginLeft: "auto", marginRight: "-25px" }}>Sign Up</h4>
        </Modal.Header>
        <Modal.Body>
          <SignUp />
        </Modal.Body>
      </Modal>


    </>
  )
}

