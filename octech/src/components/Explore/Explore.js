import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { db } from "../../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import FlipMove from "react-flip-move";
import Post from "../Body/Post/Post";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";
import { Avatar } from "@material-ui/core";
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Map from '../Body/Map/Map.js';

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


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
  },
  card: {
    borderRadius: "40px",
    boxShadow: "3px 3px 5px 6px rgb(233, 233, 233)",
    width: "80%",
    margin: "0 auto"
  },
}));

export default function Explore() {
  const [users, setUsers] = useState([]);
  const user = useSelector(selectUser);
  const history = useHistory();
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [channels, setChannels] = useState([]);
  const [key, setKey] = useState("map");
  const [locationPosts, setLocationPosts] = useState([])
  const [center, setCenter] = useState({ lat: 25.1972, lng: 55.2744 })
  const [mapLoad, setMapLoad] = useState(false)
  useEffect(() => {
    db.collection("posts")
      .where("hasCoordinates", "==", true)
      .where("isPrivate", "==", false)
      .get().then((a) => {
        if (a.docs[0] !== undefined) {
          setCenter({ lat: a.docs[0].data().lat, lng: a.docs[0].data().lng })
        }
        setLocationPosts(

          a.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      }).then(() => { setTimeout(() => { setMapLoad(true) }, 500) })

  }, [])
  const getPosts = (k) => {
    if (k === "posts") {
      db.collection("posts")
        .where("isPrivate", "==", false)
        .orderBy("totalStars", "desc") // Sorting by timestamp descending allows the new posts to be shown on top
        .get().then((snapshot) =>
          setPosts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              key: doc.id,
              data: doc.data(),
            }))
          )
        );
    }
    else if (k === "channels") {
      db.collection("channels")
        .orderBy("followers", "desc")
        .get().then((snapshot) =>
          setChannels(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              key: doc.id,
              data: doc.data(),
            }))
          )
        );
    }
    setKey(k)
    return k
  }
  useEffect(() => {
    let list = [];
    db.collection("users")
      .doc(user.displayName)
      .get()
      .then((viewingUser) => {
        viewingUser.data().blockedBy.length > 0
          ? db
            .collection("users")
            .where("name", "not-in", viewingUser.data().blockedBy)
            .get()
            .then((result) => {
              list.push(...result.docs.map((doc) => doc.data()));
            })
          : db
            .collection("users")
            .get()
            .then((result) => {
              list.push(...result.docs.map((doc) => doc.data()));
            });
        db.collection("channels")
          .get()
          .then((result) => {
            list.push(...result.docs.map((doc) => doc.data()));
          });
      });
    setUsers(list)
  }, [user.displayName])

  return (
    <>
      <div style={{ width: "80vw", marginTop: "10px" }}>
        <center>
          <h1>Explore</h1>
        </center>
      </div>
      <div className={classes.root}>
        <div
          color="default"
          style={{
            position: "sticky",
            zIndex: 100,
            top: 60,
            backgroundColor: "white",
          }}
        >
          <div style={{ width: "80%", marginLeft: "10%" }}>
            <Autocomplete
              autoComplete={true}
              autoHighlight={true}
              onChange={(event, newInputValue) => {
                if (newInputValue) {

                  if (newInputValue.creator === undefined)
                    history.push(`/user/${newInputValue.name}`);
                  else
                    history.push(
                      `/user/${newInputValue.creator +
                      "/channel/" +
                      newInputValue.name
                      }`
                    );

                }
              }}
              id="search"
              freeSolo
              options={users || []}
              getOptionLabel={option => option.name}
              renderOption={(option) => {
                if (!option.creator) {
                  return (
                    <ListItem >
                      <ListItemIcon>
                        <Avatar alt={option.name} src={option.photoUrl} />
                      </ListItemIcon>
                      <ListItemText primary={option.name} primaryTypographyProps={{ noWrap: true }} />
                    </ListItem>
                  )
                }
                else {
                  return (
                    <ListItem >
                      <ListItemIcon>
                        <PhotoLibraryIcon />
                      </ListItemIcon>
                      <ListItemText primary={option.name} primaryTypographyProps={{ noWrap: true }} />
                    </ListItem>
                  )
                }
              }
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search"
                  margin="normal"
                  variant="outlined"
                  style={{
                    position: "sticky",
                    zIndex: 100,
                    top: 200,
                    backgroundColor: "white",
                    marginBottom: "20px"
                  }}
                />
              )}
            />
          </div>

        </div>

        <Tabs
          id="controlled-tab-example"
          activeKey={key ? key : getPosts("posts")}
          onSelect={(k) => getPosts(k)}
          variant="pills"
          style={{
            position: "sticky",
            zIndex: 100,
            top: 145,
            backgroundColor: "white",
            borderBottom: "0.1px solid lightgray"
          }}
          fill
        >
          <Tab
            eventKey="map"
            title="Map"
            style={{
              color: "black",
              width: "100%",
              backgroundColor: "whitesmoke",
              bottom: "500px",
              overflow: "hidden",
              postion: "fixed"
            }}
            mountOnEnter={true}
          >
            {mapLoad && <Map
              locationPosts={locationPosts}
              zoom={1}
              isPreview={true}
              center={center}
            />}
          </Tab>
          <Tab
            eventKey="posts"
            title="Posts"
            style={{
              color: "black",
              width: "100%",
              backgroundColor: "whitesmoke",
              marginBottom: "50px",
            }}
          >
            <br />
            {posts && (
              <FlipMove>
                {/* Flipmove is a library for the smooth animation that animated the new post being added to the DOM */}
                {posts.map(
                  // The posts from the useEffect hook that were saved are iterated over and a new Post component is created corresponding to the posts it is iterating over
                  ({
                    id,
                    data: {
                      name,
                      description,
                      message,
                      photoUrl,
                      largeGifs,
                      comments,
                      channelBy,
                      hasCoordinates,
                      lat,
                      lng,
                      stars,
                      totalStars,
                      isPrivate,
                      timestamp,
                      type
                    },
                  }) => (
                    <div style={{ paddingLeft: "3%", paddingRight: "3%" }}>
                      {(
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
                          timestamp={timestamp}
                          type={type}
                          isForumPost={Boolean(type)}
                          locationPosts={locationPosts}
                        />
                      )}
                    </div>
                  )
                )}
              </FlipMove>
            )}
            <br />
          </Tab>
          <Tab
            eventKey="channels"
            title="Channels"
            style={{
              color: "black",
              width: "100%",
              backgroundColor: "whitesmoke",
              marginBottom: "50px",
            }}
          >
            <br />
            <FlipMove>
              {/* Flipmove is a library for the smooth animation that animated the new post being added to the DOM */}
              {channels.map(
                // The posts from the useEffect hook that were saved are iterated over and a new Post component is created corresponding to the posts it is iterating over
                ({ id, data }) => (
                  <div>
                    <Card
                      classes={{ root: classes.card }}
                      variant="outlined"
                      onClick={() =>
                        history.push(
                          `/user/${data.creator}/channel/${data.name}`
                        )
                      }
                    >
                      <CardContent style={{ borderRadius: "20", width: "80vw" }}>
                        <center>
                          <Typography variant="h5" component="h2">
                            {data.name}
                          </Typography>
                        </center>

                        <Typography
                          className={classes.pos}
                          color="textSecondary"
                        >
                          <center>Theme - {data.theme}</center>
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
          </Tab>
        </Tabs>
        {/* </SwipeableViews> */}
      </div>
    </>
  );
}
