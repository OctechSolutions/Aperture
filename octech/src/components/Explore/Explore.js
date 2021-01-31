import React, { useEffect, useState } from 'react'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { db } from '../../firebase';
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import FlipMove from "react-flip-move";
import Post from '../Body/Post/Post';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}

        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: "100%",
    },
    card: {
        borderRadius: "20px"
    }
}));

export default function Explore() {


    const [value, setValue] = useState("");
    const [inputValue, setInputValue] = useState('');
    const [users, setUsers] = useState([]);
    const user = useSelector(selectUser);
    const history = useHistory();
    const classes = useStyles();
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);
    const [posts, setPosts] = useState([]);
    const [channels, setChannels] = useState([]);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setTabValue(index);
    };

    useEffect(() => {
        let list = [];
        db.collection("users").doc(user.displayName).get().then((viewingUser) => {
            ((viewingUser.data().blockedBy.length > 0) ?
                db.collection("users")
                    .where("name", "not-in", viewingUser.data().blockedBy)
                    .get().then(result => {
                        list.push(...result.docs.map(doc => doc.data()));
                    }) :
                db.collection("users")
                    .get().then(result => {
                        list.push(...result.docs.map(doc => doc.data()));
                    }))
            db.collection("channels").get().then(result => {
                list.push(...result.docs.map(doc => doc.data()));
            })
            setUsers(list);
            console.log(list);
        })

        db.collection("posts")
            .where("isPrivate", "==", false)
            .orderBy("totalStars", "desc") // Sorting by timestamp descending allows the new posts to be shown on top
            .onSnapshot((snapshot) =>
                setPosts(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        key: doc.id,
                        data: doc.data(),
                    }))
                )
            );

        db.collection("channels")
            .orderBy("followers", "desc")
            .onSnapshot((snapshot) =>
                setChannels(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        key: doc.id,
                        data: doc.data(),
                    }))
                )
            );
    }, [user.displayName]);



    return (
        <>
            <div style={{ width: "80vw", marginTop: "60px" }}>
                <center><h1>Explore</h1></center>
                <Autocomplete
                    autoComplete={true}
                    autoHighlight={true}
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => {

                        setInputValue(newInputValue);
                        const selectedUser = users.filter(function (item) { return item.name === newInputValue; });
                        if ((users.filter(function (item) { return item.name === newInputValue; }))[0]) {
                            {
                                if (selectedUser[0].creator === undefined)
                                    history.push(`/user/${selectedUser[0].name}`);
                                else
                                    history.push(`/user/${selectedUser[0].creator + "/channel/" + selectedUser[0].name}`);
                            }
                        }
                    }}
                    id="search"
                    freeSolo
                    options={users.map((option) => option.name)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search"
                            margin="normal"
                            variant="outlined"
                        />
                    )}
                />
            </div>
            <div className={classes.root}>
                <AppBar color="default" style={{ position: 'fixed', top: 60 }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                    >
                        <Tab label="Posts" {...a11yProps(0)} />
                        <Tab label="Channels" {...a11yProps(1)} />
                    </Tabs>
                </AppBar>
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={tabValue}
                    onChangeIndex={handleChangeIndex}
                >
                    <TabPanel value={tabValue} index={0} dir={theme.direction} style={{ backgroundColor: "whitesmoke" }}>
                        {posts &&
                            <FlipMove >
                                {/* Flipmove is a library for the smooth animation that animated the new post being added to the DOM */}
                                {posts.map( // The posts from the useEffect hook that were saved are iterated over and a new Post component is created corresponding to the posts it is iterating over
                                    ({
                                        id,
                                        data: { name, description, message, photoUrl, largeGifs, comments, channelBy, hasCoordinates, lat, lng, stars, totalStars, isPrivate },
                                    }) => (

                                        <Post
                                            key={id}
                                            id={id}
                                            name={name}
                                            description={description}
                                            message={message}
                                            photoUrl={photoUrl}
                                            largeGifs={largeGifs}
                                            comments={comments}
                                            hasCoordinates={hasCoordinates}
                                            lat={lat}
                                            lng={lng}
                                            channelBy={channelBy}
                                            viewingUser={user}
                                            star={stars}
                                            totalStar={totalStars}
                                            isPrivate={isPrivate}
                                        />

                                    )
                                )}
                            </FlipMove>
                        }
                    </TabPanel>
                    <TabPanel value={tabValue} index={1} dir={theme.direction} style={{ backgroundColor: "whitesmoke" }}>
                        <FlipMove >
                            {/* Flipmove is a library for the smooth animation that animated the new post being added to the DOM */}
                            {channels.map( // The posts from the useEffect hook that were saved are iterated over and a new Post component is created corresponding to the posts it is iterating over
                                ({
                                    id,
                                    data,
                                }) => (

                                    <div>
                                        <Card
                                            classes={{ root: classes.card }}
                                            variant="outlined"
                                            onClick={() => history.push(`/user/${data.creator}/channel/${data.name}`)}

                                        >
                                            <CardContent style={{ borderRadius: "20" }}>
                                                <div>
                                                    <Typography variant="h5" component="h2">
                                                        {data.name}
                                                    </Typography>
                                                </div>


                                                <Typography className={classes.pos} color="textSecondary">
                                                    {data.theme}
                                                    <Divider />
                                                    <br />
                                                </Typography>
                                                <Typography variant="body2" component="p">
                                                    {data.description}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                        <br />
                                    </div>

                                )
                            )}
                        </FlipMove>
                    </TabPanel>
                </SwipeableViews>
            </div>
        </>
    );
}
