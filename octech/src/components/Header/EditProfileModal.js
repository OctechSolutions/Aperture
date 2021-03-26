import React, {useState} from "react";
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import "./EditProfileModal.css"
import Box from '@material-ui/core/Box';
import DeleteIcon from '@material-ui/icons/Delete';
import Modal from 'react-bootstrap/Modal';
import { db } from "../../firebase";
import firebase from "firebase"

const EditProfileModal = ({setShowEditProfile}) =>{
    const user = useSelector(selectUser);

    const [editName,setEditName] = useState(false); 
    const [name,setName] = useState(user.displayName);
    const [nameNotUnique,setNameNotUnique] = useState(false)
    
    const [editEmail,setEditEmail] = useState(false); 
    const [email,setEmail] = useState(user.email);
    const [emailNotVerified,setEmailNotVerified] = useState(false)

    const [editPassword,setEditPassword] = useState(false);

    const [oldPassword,setOldPassword] = useState("");
    const [oldPasswordDoesNotMatch,setOldPasswordDoesNotMatch] = useState("");
    const [showOldPassword,setShowOldPassword] = useState(false);
    
    const [newPassword,setNewPassword] = useState("");
    const [newPasswordNotEnough,setnewPasswordNotEnough] = useState("");
    const [showNewPassword,setShowNewPassword] = useState(false);
    
    const [retypePassword,setRetypePassword] = useState("");
    const [retypePasswordDoesNotMatch,setRetypePasswordDoesNotMatch] = useState("");
    const [showRetypePassword,setShowRetypePassword] = useState(false);

    const [showConfirmDeleteAccount,setShowConfirmDeleteAccount] = useState(false)

    const submitHandler = ()=>{
                
    }
    const deleteAccount = () =>{
        setShowConfirmDeleteAccount(false)
        //Delete User details
        db.collection("users").doc(user.displayName).collection("notifications").get().then(docs =>{
            docs.forEach(doc => {
                db.collection("users").doc(user.displayName).collection("notifications").doc(doc.id).delete()
            });
        })
        db.collection("users").doc(user.displayName).delete()

        // Delete posts and post images
        db.collection("posts").where("name","==",user.displayName).get().then(docs =>{
            docs.forEach(doc =>{
                db.collection("postImages").where("ref","==",doc.id).get().then(docs =>{
                    docs.forEach(dpc => {
                        db.collection("postImages").doc(dpc.id).delete()
                    })
                })
                db.collection("posts").doc(doc.id).delete()
            })
        })

        //Delete portfolio
        db.collection("portfolios").doc(user.displayName).delete()

        //Delete forum posts
        db.collection("forumPosts").where("name","==",user.displayName).get().then(docs =>{
            docs.forEach(doc =>{
                db.collection("postImages").where("ref","==",doc.id).get().then(docs =>{
                    docs.forEach(dpc => {
                        db.collection("postImages").doc(dpc.id).delete()
                    })
                })
                db.collection("posts").doc(doc.id).delete()
            })
        })

        //Delete Collection
        db.collection("collections").doc(user.displayName).delete()

        //Delete Channaels
        db.collection("channels").where("creator","==",user.displayName).get().then(docs =>{
            docs.forEach(doc =>{
                db.collection("posts").doc(doc.id).delete()
            })
        })

        //Delete Challenge and its posts
        db.collection("challengePosts").where("creator","==",user.displayName).get().then(docs =>{
            docs.forEach(doc =>{
                db.collection("challengePosts").doc(doc.id).delete()
                db.collection("posts").doc(doc.id).update({
                    challenge: firebase.firestore.FieldValue.delete()
                })
            })
        })

        //Delete Bug report
        db.collection("BugReports").where("name","==",user.displayName).get().then(docs =>{
            docs.forEach(doc =>{
                db.collection("BugReports").doc(doc.id).delete()
            })
        })

        //Delete from Chat rooms
        db.collection("chatRooms").where("participantNames","array-contains",user.displayName).get().then(docs =>{
            docs.forEach(doc =>{
                const docRef = db.collection("chatRooms").doc(doc.id)
                let data = doc.data()
                let participantNames = data.participantNames.filter(n => name !=data.name)
                let participants = data.participants.filter(u => u.name != data.name)
                const collectionRef = docRef.collection("messages")
                docRef.update({participantNames: participantNames,participants : participants})
        })})  
        
        //Delete from friends and friends requested and blocked and all
        db.collection("users").get().then(docs => {
            docs.forEach(doc => {
                let data = doc.data()
                const blocked = data.blocked.filter
            })
        })
    }

    return(
    <div>
        <TextField id="userNameField" className="field" variant="outlined" label="Username"  placeholder="Enter New Username" helperText={!name ? "Username cannot be empty" : nameNotUnique ? "Username should be unique" : ""} error ={!name | nameNotUnique} value ={name} onChange={(event)=>{setName(event.target.value)}} fullWidth InputLabelProps={{ shrink: true,}}
        InputProps={{
            readOnly: !editName,
            endAdornment:
            (editName ? 
                <>
                <IconButton aria-label="cancel edit name" onClick={()=> {setEditName(false);setName(user.displayName)}}>
                    <ClearIcon/>
                </IconButton>
                </>
            :
                <IconButton aria-label="edit name" onClick={()=> {setEditName(true) ;setName("")}}>
                    <EditIcon/>
                </IconButton>)
        }}
        />

        <TextField id="emailField" className="field" variant="outlined" label="Email"  placeholder="Enter New Email" helperText={!email ? "Email cannot be empty" : emailNotVerified ? "Verify Your Email" : ""} error ={!email | emailNotVerified} value ={email} onChange={(event)=>{setEmail(event.target.value)}} fullWidth InputLabelProps={{ shrink: true,}}
        InputProps={{
            readOnly: !editEmail,
            type:"email",
            validate:true,
            endAdornment:
            (editEmail ? 
                <>
                <IconButton aria-label="cancel edit email" onClick={()=> {setEditEmail(false);setEmail(user.email)}}>
                    <ClearIcon/>
                </IconButton>
                </>
            :
                <IconButton aria-label="edit email" onClick={()=> {setEditEmail(true) ;setEmail("")}}>
                    <EditIcon/>
                </IconButton>)
        }}
        />
        <InputBase
            defaultValue="Change Password"
            readOnly
            fullWidth
            className="pass"
            endAdornment={
            (editPassword ? 
                <>
                <IconButton aria-label="cancel edit Password" onClick={()=> {setEditPassword(false)}}>
                    <ClearIcon/>
                </IconButton>
                </>
            :
                <IconButton aria-label="edit password" onClick={()=> {setEditPassword(true)}}>
                    <EditIcon/>
                </IconButton>)}
        />
        {editPassword ?
            <>
                <TextField id="oldPassword" className="field" variant="outlined" label="Old Password"  placeholder="Enter Old Password" helperText={!oldPassword ? "Old Password cannot be empty" : oldPasswordDoesNotMatch ? "Old Password incorrect" : ""} error ={!oldPassword | oldPasswordDoesNotMatch} value ={oldPassword} onChange={(event)=>{setOldPassword(event.target.value)}} fullWidth InputLabelProps={{ shrink: true,}}
                    InputProps={{
                        type:showOldPassword ? 'text' : 'password',
                        endAdornment:
                            <IconButton
                                aria-label="toggle oldPassword visibility"
                                onClick={()=>{setShowOldPassword(!showOldPassword)}}
                                onMouseDown={(e)=>{e.preventDefault()}}
                                edge="end"
                                >
                                    {showOldPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                    }}
                    />
                <TextField id="newPassword" className="field" variant="outlined" label="New Password"  placeholder="Enter New Password" helperText={!newPassword ? "New Password cannot be empty" : newPasswordNotEnough ? "New password does not meet minimum requirements" : ""} error ={!newPassword | newPasswordNotEnough} value ={newPassword} onChange={(event)=>{setNewPassword(event.target.value)}} fullWidth InputLabelProps={{ shrink: true,}}
                    InputProps={{
                        type:showNewPassword ? 'text' : 'password',
                        endAdornment:
                            <IconButton
                                aria-label="toggle oldPassword visibility"
                                onClick={()=>{setShowNewPassword(!showNewPassword)}}
                                onMouseDown={(e)=>{e.preventDefault()}}
                                edge="end"
                                >
                                    {showNewPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                    }}
                    />
                <TextField id="retypePassword" className="field" variant="outlined" label="Retype Password"  placeholder="Enter Retype Password" helperText={!retypePassword ? "Retype Password cannot be empty" : retypePasswordDoesNotMatch ? "New Password and Retype Password do no match" : ""} error ={!retypePassword | retypePasswordDoesNotMatch} value ={retypePassword} onChange={(event)=>{setRetypePassword(event.target.value)}} fullWidth InputLabelProps={{ shrink: true,}}
                    InputProps={{
                        type:showRetypePassword ? 'text' : 'password',
                        endAdornment:
                            <IconButton
                                aria-label="toggle oldPassword visibility"
                                onClick={()=>{setShowRetypePassword(!showRetypePassword)}}
                                onMouseDown={(e)=>{e.preventDefault()}}
                                edge="end"
                                >
                                    {showRetypePassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                    }}
                    />
            </>
        :
            <>
            </>
        }
        <Modal
          show={showConfirmDeleteAccount}
          onHide={() => { setShowConfirmDeleteAccount(false) }}
          keyboard={false}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
        <Modal.Body>
            <Box component="span" m={1} className="buttonContainer2">
                <Button
                    variant="contained"
                    color="secondary"
                    className="buttons"
                    startIcon={<ClearIcon />}
                    onClick={()=>{setShowConfirmDeleteAccount(false)}}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    className="buttons"
                    startIcon={<DeleteIcon />}
                    onClick={deleteAccount}
                >
                    Yes Delete My Account
                </Button>
                </Box>
        </Modal.Body>
        </Modal>
        <Box component="span" m={1} className="buttonContainer">
            <Button
                variant="contained"
                color="secondary"
                className="buttons"
                startIcon={<DeleteIcon />}
                onClick={()=>{setShowEditProfile(false);setShowConfirmDeleteAccount(true)}}
            >
                Delete Account
            </Button>
            <Button
                variant="contained"
                color="secondary"
                className="buttons"
                startIcon={<ClearIcon />}
                onClick={()=>{setShowEditProfile(false)}}
            >
                Cancel
            </Button>
            {(editName | editPassword | editEmail) ? 
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        className="buttons"
                        endIcon={<EditIcon />}
                        onClick={submitHandler}
                    >
                        Submit
                    </Button>
                </>
                :
                <>
                </>}
            </Box>
        </div>
    )
}

export default EditProfileModal;