import React from 'react'
import { Route } from 'react-router-dom';
import Feed from '../components/Body/Feed/Feed';
import Header from '../components/Header/Header';
import Profile from '../components/userProfile/Profile';
import Collection from '../components/Collection/Collection';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles({
    root: {
        width: "100vw",
        position: "sticky",
        bottom: 0,
        display: "flex",
        borderTop: "0.1px solid lightgray"
    },
});

export default function NewsfeedPage(props) {
    const history = useHistory();
    const classes = useStyles();
    const user = useSelector(selectUser); // Select current user from slice
    const [value, setValue] = React.useState("");

    const handleChange = (event, newValue) => {
        console.log(newValue);
        setValue(newValue);
        history.push(`/${newValue}`);
    };
    return (
        <>
            {
                props.isVerified ?
                    (
                        <div className="app">
                            <Header setValue = {setValue} /> {/* The header is always rendered if the user is logged in */}

                            <Route path="/" exact component={Feed} />
                            <Route path="/user/:id" exact component={Profile} /> {/* Dynamically generated user pages, the user lands on /user/{username} when clicking on someone profile, the profile page of the user is rendered by the profile component */}
                            <Route path="/user/:id/:collection" exact component={Collection} />
                            <Route path="/user/:id/channel/:channel" exact component={Feed} />
                            <BottomNavigation value={value} onChange={handleChange} className={classes.root}>
                                <BottomNavigationAction label="Home" value="" icon={<HomeIcon />} />
                                <BottomNavigationAction label="Search" value="search" icon={<SearchIcon />} />
                                <BottomNavigationAction label="Profile" value={'user/' + user.displayName} icon={<PersonIcon />} />
                            </BottomNavigation>
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
    )
}
