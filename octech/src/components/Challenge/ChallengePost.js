import React, { useState } from 'react'

import firebase from "firebase"
import { db } from "../../firebase"

import moment from 'moment'

import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
// import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
// import Collapse from '@material-ui/core/Collapse'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
// import Typography from '@material-ui/core/Typography'
import { red } from '@material-ui/core/colors'
import Badge from '@material-ui/core/Badge'
import FavoriteIcon from '@material-ui/icons/Favorite'
import DeleteIcon from '@material-ui/icons/Delete'

//Rating Sttuff
import Rating from '@material-ui/lab/Rating';
import GradeIcon from '@material-ui/icons/Grade';
import CountUp from 'react-countup';
import { withStyles } from '@material-ui/core/styles';

export default function ChallengePost({user, caption, star, totalStar, creator, creatorPhotoUrl, imageSrc, style, timestamp, id, loadChallengeEntries, challengeName}) {
    
    // console.log("user = " + user)
    // console.log("caption = " + caption)
    // console.log("challengePoints = " + challengePoints)
    // console.log("creator = " + creator)
    // console.log("creatorPhotoUrl = " + creatorPhotoUrl)
    // console.log("imageSrc = " + imageSrc)
    // console.log("style = " + style)
    // console.log("timestamp = " + timestamp.toDate().toDateString())

    // const [liked, setLiked] = useState(false)
    // const [postChallengePoints, ] = useState(challengePoints)

    //Rating Stuff
    const [showStars,] = useState(((creator === user.displayName)) ? false : true);
    //Total Stars of the post
    const [totalStars, setTotalStars] = useState(totalStar);
    //Stars given by the user on the post
    const [stars, setStars] = useState((star[user.uid] === undefined) ? 0 : star[user.uid]);
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
            type: "rating",
            sentAt: firebase.firestore.Timestamp.now(),
            sender: user.displayName,
            icon: user.photoUrl,
            stars: givenStars,
            postId: id
          })
        }, { merge: true })
      }

      post.update({ totalStars: newTotalStars, stars: star });

      const uploader = db.collection("users").doc(creator);
      db.runTransaction(transaction => (
        transaction.get(uploader).then(doc => {
          let profilePoints = doc.data().profilePoints;
          let newProfilePoints = profilePoints + (givenStars - stars);
          let notifications = doc.data().notifications;
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
          else{
            transaction.update(uploader, { profilePoints: newProfilePoints, league : leaguee, 
              
              //Sending Notification About league change
              notifications: [...notifications, {
                type: "leagueChange",
                sentAt: firebase.firestore.Timestamp.now(),
                league: leaguee,
                message: profilePoints > newProfilePoints ? "Opps! You have been demoted" : "Yaayy! You have been promoted"
              }]});
          }
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
    }))
    const classes = useStyles() // To style the challenge post
    
    // To delete the challenge post.
    const deleteChallengePost = () => {
      db.collection("challengePosts").doc(id).delete().then(() => loadChallengeEntries())
      let profilePost = db.collection("posts").doc(id)
      if(profilePost) { profilePost.update({challenge: firebase.firestore.FieldValue.delete()}) }
    }

    // Like unlike post.
    const likeUnlike = () => {
      console.log("Like / Unlike!") 
    }
    const StyledRating = withStyles({
      // iconFilled: {
      //   color: '#ff6d75',
      // },
      // iconHover: {
      //   color: '#ff3d47',
      // },
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
                        <br/>By {" " + creator + ", "} {moment(timestamp.toDate()).fromNow()}
                      </div> : 
                      <div style={{ fontSize: "13px", color: "gray", marginTop: "-10px" }}>
                        <br/>By {" " + creator + ", "} Few Seconds Ago
                      </div>
                    }
                />

                {/* Post image. */}
                <CardMedia  className={classes.media} image={imageSrc} style={style} title={caption} />
    
                {/* Rating. */}
                <CardActions disableSpacing>
                    {/* <IconButton aria-label="add to favorites" style={{color:"red"}} onClick={likeUnlike}>
                      <Badge badgeContent={postChallengePoints} color="primary">
                        <FavoriteIcon />
                      </Badge>
                    </IconButton> */}
                    <>
                    {showStars ?
                      <IconButton
                        aria-label="stars"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        className={classes.root}
                        disableRipple={true}
                        disableFocusRipple={true}
                      >

                        <StyledRating
                          max={3}
                          value={stars}
                          onChange={updateStars}
                          icon={<GradeIcon fontSize="inherit" />}
                        />
                        <CountUp end={totalStars} />
                      </IconButton>
                      :
                      <IconButton
                        aria-label="rating"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        className={classes.root}
                        disableRipple={true}
                        disableFocusRipple={true}
                      >
                        Rating : {totalStars}
                      </IconButton>}
                  </>
                </CardActions>
            </Card>
        </div>
    )
}
