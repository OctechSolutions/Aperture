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

    const submitHandler = ()=>{
        
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
        <Box component="span" m={1} className="buttonContainer">
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