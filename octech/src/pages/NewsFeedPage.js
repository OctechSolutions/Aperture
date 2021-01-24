import React from 'react'
import { Route } from 'react-router-dom';
import Feed from '../components/Body/Feed/Feed';
import Header from '../components/Header/Header';
import Profile from '../components/userProfile/Profile';
import Collection from '../Collections/Collection';
<<<<<<< HEAD
import { auth } from '../firebase';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'

export default function NewsfeedPage(props) {
    return(
        <>
            {
                props.isVerified ?
                (
                    <div className="app">
                        <Header /> {/* The header is always rendered if the user is logged in */}
            
                        <Route path="/" exact component={Feed} />
                        <Route path="/user/:id" exact component={Profile} /> {/* Dynamically generated user pages, the user lands on /user/{username} when clicking on someone profile, the profile page of the user is rendered by the profile component */}
                        <Route path="/user/:id/:collection" exact component={Collection} />
                        <Route path="/user/:id/channel/:channel" exact component={Feed} />
                    </div>
                ):
                (
                    <div className="verify-email">
                        <h1>
                            You have been sent<br/>
                            a verification e-mail.<br/>
                            Please verify and reload page to proceed.
                        </h1>
                    </div>
                )
            } 
       </>
=======
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';


export default function NewsfeedPage(props) {  
    return (
        <>
            {
                props.isVerified ?
                    (
                        <div className="app">
                            <Header /> {/* The header is always rendered if the user is logged in */}

                            <Route path="/" exact component={Feed} />
                            <Route path="/user/:id" exact component={Profile} /> {/* Dynamically generated user pages, the user lands on /user/{username} when clicking on someone profile, the profile page of the user is rendered by the profile component */}
                            <Route path="/user/:id/:collection" exact component={Collection} />
                            <Route path="/user/:id/channel/:channel" exact component={Feed} />
                        </div>
                    ) :
                    (
                        <Modal show={true}>
                            <Modal.Body>
                                <Alert variant='info'>
                                    <div className="verify-email">
                                        <h2>
                                            You have been sent a verification e-mail.
                                        </h2>
                                    </div>
                                </Alert>
                            </Modal.Body>
                            <Modal.Footer>
                            <Alert variant='info'>
                                        <h4>Please verify and reload page to proceed.</h4>
                                </Alert>
                            </Modal.Footer>
                        </Modal>


                    )
            }
        </>
>>>>>>> b9b02ddeb3def043065b29a60262488675fb49fd
    )
}
