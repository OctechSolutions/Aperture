import React, { useState, useEffect, useRef } from 'react'

import firebase from "firebase"
import { db } from "../../firebase"

import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import { red } from '@material-ui/core/colors'
import Badge from '@material-ui/core/Badge';
import FavoriteIcon from '@material-ui/icons/Favorite'
import DeleteIcon from '@material-ui/icons/Delete'

export default function ChallengePost({user, caption, challengePoints, creator, creatorPhotoUrl, imageSrc, style, timestamp, id, loadChallengeEntries}) {
    
    // console.log("user = " + user)
    // console.log("caption = " + caption)
    // console.log("challengePoints = " + challengePoints)
    // console.log("creator = " + creator)
    // console.log("creatorPhotoUrl = " + creatorPhotoUrl)
    // console.log("imageSrc = " + imageSrc)
    // console.log("style = " + style)
    // console.log("timestamp = " + timestamp.toDate().toDateString())

    const [liked, setLiked] = useState(false)
    const [postChallengePoints, setPostChallengePoints] = useState(challengePoints)

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
        },
        avatar: {
          backgroundColor: red[500],
        },
    }))
    const classes = useStyles() // To style the challenge post
    
    // To delete the challenge post.
    const deleteChallengePost = () => {
      db.collection("challengePosts").doc(id).delete().then(() => loadChallengeEntries())
    }

    // Like unlike post.
    const likeUnlike = () => {
      if(!liked) { // If this user has not yet liked the post, then like it.
        setLiked(true)
        setPostChallengePoints((prev) => prev+1)
        db.collection("challengePosts").doc(id).get()
        .then((challengePostDoc) => {
          let curChallengePoints = challengePostDoc.data().challengePoints
          db.collection("challengePosts").doc(id).update({challengePoints: (curChallengePoints+1)})
        })
      } 
      else { // If this user has already liked the post, then unlike it.
        setLiked(false)
        setPostChallengePoints((prev) => prev-1)
        db.collection("challengePosts").doc(id).get()
        .then((challengePostDoc) => {
          let curChallengePoints = challengePostDoc.data().challengePoints
          db.collection("challengePosts").doc(id).update({challengePoints: (curChallengePoints-1)})
        })
      } 
    }

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
                    subheader={"By " + creator + " On " + timestamp.toDate().toDateString() }
                />

                {/* Post image. */}
                <CardMedia  className={classes.media} image={imageSrc} style={style} title={caption} />
    
                {/* Like button. */}
                <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites" style={{color:"red"}} onClick={likeUnlike}>
                      <Badge badgeContent={postChallengePoints} color="primary">
                        <FavoriteIcon />
                      </Badge>
                    </IconButton>
                </CardActions>
            </Card>
        </div>
    )
}