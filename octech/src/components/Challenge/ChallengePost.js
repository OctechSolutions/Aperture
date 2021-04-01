import React, { useState } from 'react'
import '../Body/Post/Post.css'

import firebase from "firebase"
import { db } from "../../firebase"

import moment from 'moment'

import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import { red } from '@material-ui/core/colors'
import DeleteIcon from '@material-ui/icons/Delete'
import MapIcon from '@material-ui/icons/Map'

//Rating Stuff
import Rating from '@material-ui/lab/Rating';
import GradeIcon from '@material-ui/icons/Grade';
import CountUp from 'react-countup';
import { withStyles } from '@material-ui/core/styles';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export default function ChallengePost({ user, caption, star, totalStar, creator, creatorPhotoUrl, imageSrc, style, timestamp, id, loadChallengeEntries, challengeName, hasCoordinates, lat, lng, setMapComponent }) {

  //Rating Stuff
  const [showStars,] = useState(((creator === user.displayName)) ? false : true);
  //Total Stars of the post
  const [totalStars, setTotalStars] = useState(totalStar ? totalStar : 0);
  //Stars given by the user on the post
  const [stars, setStars] = useState((star[user.uid] === undefined) ? [] : star[user.uid]);
  
  //TO update the stars after the user has given the stars
  const updateStars = async (e) => {
    let givenStars = parseInt(e.target.value);
    if (givenStars === stars)
      givenStars = 0;
    let newTotalStars = totalStars + (givenStars - stars);
    const post = db.collection("challengePosts").doc(id);
    star[user.uid] = givenStars;

    if (givenStars > 0) {
      db.collection("users").doc(creator).collection("notifications").doc(creator).set({
        notifications: firebase.firestore.FieldValue.arrayUnion({
          type: "challengeRating",
          sentAt: firebase.firestore.Timestamp.now(),
          sender: user.displayName,
          icon: user.photoUrl,
          stars: givenStars,
          postTitle: caption,
          postId: id
        })
      }, { merge: true })
    }

    console.log(star)
    post.set({ totalStars: newTotalStars, stars: star }, { merge: true });

    const uploader = db.collection("users").doc(creator);
    db.runTransaction(transaction => (
      transaction.get(uploader).then(doc => {
        let profilePoints = doc.data().profilePoints;
        let newProfilePoints = profilePoints + (givenStars - stars);
        let league = doc.data().league;
        let leaguee = "";

        if(league !== "Champion" && league !== "Legendary"){
          if(newProfilePoints<100)
            leaguee = "No league profile points less than 100"
          else if(newProfilePoints<500)
            leaguee = "Silver"
          else if(newProfilePoints<1000)
            leaguee = "Gold"
          else if(newProfilePoints<1200)
            leaguee = "Diamond"
          else 
            leaguee = "Platinum"
        }
          
        if(league && (league===leaguee || leaguee===""))
          transaction.update(uploader, { profilePoints: newProfilePoints });
        else {
          transaction.update(uploader, {
            profilePoints: newProfilePoints, league: leaguee, notifyLeague: true, leagueStatus: profilePoints > newProfilePoints ? "d" : "p"
          });
        }
      })));

      //Update the points of a user in a challenge
      const challenge = db.collection("challenges").doc(challengeName);
      db.runTransaction(transaction => (
        transaction.get(challenge).then(doc => {
          let participants = doc.data().participants;
          let index = participants.findIndex(u => u.displayName === creator)
          let challengePoints = participants[index].challengePoints ? participants[index].challengePoints :0 ;
          participants[index].challengePoints = challengePoints + (givenStars - stars);
          
          transaction.update(challenge, { participants: participants });
        })));

    setStars(givenStars);
    setTotalStars(newTotalStars);
  }

  // To style the challenge post
  const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: "white",
      padding: "15px",
      margin: "30px auto",
      borderRadius: "40px",
      width: "80vw",
      webkitBoxShadow: "3px 3px 5px 6px rgb(233, 233, 233)",  /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
      mozBoxShadow: "3px 3px 5px 6px rgb(233, 233, 233)",  /* Firefox 3.5 - 3.6 */
      boxShadow: "3px 3px 5px 6px rgb(233, 233, 233)"  /* Opera 10.5, IE 9, Firefox 4+, Chrome 6+, iOS 5 */
    },
    media: {
      paddingTop: '56.25%', // 16:9
      backgroundSize: "contain",
      borderRadius: "20px",
    },
    avatar: {
      backgroundColor: red[500],
    },
    rating: {
      "&:hover": {
        backgroundColor: "transparent"
      }
    }
  }))
  const classes = useStyles() // To style the challenge post

  // To delete the challenge post.
  const deleteChallengePost = () => {
    db.collection("challengePosts").doc(id).delete().then(() => loadChallengeEntries())
    let profilePost = db.collection("posts").doc(id)
    if (profilePost) { profilePost.update({ challenge: firebase.firestore.FieldValue.delete() }) }
  }

  const StyledRating = withStyles({
  })(Rating);
  
  return (
    <div className="challenge_post" >
      <Card className={classes.root}>
        <CardHeader // User avatar, username, post caption, delete button. 
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar} src={creatorPhotoUrl}></Avatar>
          }
          action={
            (user.displayName === creator) &&
            <IconButton aria-label="settings" onClick={deleteChallengePost}>
              <DeleteIcon />
            </IconButton>
          }
          title={caption}
          subheader={
            timestamp ?
              <div style={{ fontSize: "13px", color: "gray", marginTop: "-10px" }}>
                <br />By {" " + creator + ", "} {moment(timestamp.toDate()).fromNow()}
              </div> :
              <div style={{ fontSize: "13px", color: "gray", marginTop: "-10px" }}>
                <br />By {" " + creator + ", "} Few Seconds Ago
              </div>
          }
        />

        {/* Post image. */}
        <div><center><Zoom><img src={imageSrc} style={style} alt="User Post" className="post__image"/></Zoom></center></div>
        
        {/* Rating. */}
        <CardActions disableSpacing>
          <>
            {showStars ?
              <IconButton
                aria-label="stars"
                aria-controls="long-menu"
                aria-haspopup="true"
                className={classes.rating}
                disableRipple={true}
                disableFocusRipple={true}
              >

                <StyledRating
                  max={3}
                  value={stars}
                  onChange={updateStars}
                  icon={<GradeIcon fontSize="inherit" />}
                />
                  &nbsp;
                  <CountUp end={totalStars} style={{ marginTop: "-8px" }} />
              </IconButton>
              :
              <IconButton
                aria-label="rating"
                aria-controls="long-menu"
                aria-haspopup="true"
                className={classes.rating}
                disableRipple={true}
                disableFocusRipple={true}
              >
                Rating : &nbsp;<CountUp end={totalStars} style={{ marginTop: "5px" }} />
              </IconButton>
            }
            {
              hasCoordinates &&
              <IconButton
                aria-label="map"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={() => { console.log("view maps clicked."); 
                setMapComponent(
                  {
                    center:{lat: lat, lng: lng},
                    images:[{src: imageSrc}],
                    message:caption,
                    photoUrl:creatorPhotoUrl,
                    locationPosts:[],
                    id:id
                }) 
              }}>
                <MapIcon />
              </IconButton>
            }
          </>
        </CardActions>
      </Card>
    </div>
  )
}
