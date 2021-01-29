import React, { useState } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import { InputAdornment } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';


const Compress = require('compress.js');
const useStyles = makeStyles((theme) => ({
    large: {
        width: theme.spacing(15),
        height: theme.spacing(15),
    },
    medium: {
        width: theme.spacing(5),
        height: theme.spacing(5),
    }
}));

function Portfolio() {
    const classes = useStyles();
    const [profilePic, setProfilePic] = useState("");
    const [file, setFile] = useState();
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [open, setOpen] = useState(false);

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };


    const handleUpload = async (e) => { // When a file is uploaded this function is called
        e.preventDefault();

        console.log(URL.createObjectURL(e.target.files[0]))
        const compress = new Compress();
          compress.compress([e.target.files[0]], {
            size: 0.8, // the max size in MB, defaults to 2MB
            quality: .50, // the quality of the image, max is 1,
            maxWidth: 1920, // the max width of the output image, defaults to 1920px
            maxHeight: 1920, // the max height of the output image, defaults to 1920px
            resize: true, // defaults to true, set false if you do not want to resize the image width and height
          }).then((data) => {
            // returns an array of compressed images
            console.log(data);
            var compressedb64 = data[0].prefix + data[0].data;
            setProfilePic(compressedb64)
          })
        
    }

 
    return (
        <div>
            <div className="signUp" style={{ display: "flex", flexDirection: "column" }} >
                {/* Profile Picture */}
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <div style={{ margin: "0% auto" }}>
                        <label htmlFor="fileUpload">
                            <div style={{ cursor: "pointer" }}>
                                <Avatar
                                    src={profilePic}
                                    className={classes.large}
                                >
                                    {!profilePic && <EditIcon className={classes.medium} />}
                                </Avatar>
                            </div>
                        </label>
                        <input hidden id="fileUpload" type="file" accept="image/*" onChange={handleUpload} />
                    </div>
                </div>

                {/* Name Input */}
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    onChange={(e) => setName(e.target.value)}
                />

                {/* Username Input */}
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    onChange={(e) => setUsername(e.target.value)}
                />

                {/* Email Input */}
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* Password Input */}
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="filled-adornment-password"
                    InputProps=
                    {{
                        endAdornment:
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>

                    }}

                    labelWidth={60}
                    // autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                {/* Password Confirmation Input */}
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="filled-adornment-confirm-password"
                    InputProps=
                    {{
                        endAdornment:
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle confirm password visibility"
                                    onClick={handleClickShowConfirmPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>

                    }}

                    labelWidth={60}
                    // autoComplete="current-password"
                    onChange={(e) => setConfirmPassword(e.target.value)}

                />

                {/* Contact Number Input */}
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="contactNumber"
                    label="Contact Number"
                    name="contactNumber"
                    autoComplete="contactNumber"
                    autoFocus
                    onChange={(e) => setContactNumber(e.target.value)}
                />

                {/* Submit Button Input */}
                <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={() => {console.log("submitted")}}
                    style={{ marginTop: "10px" }}
                >
                    <b>Sign Up</b>
                </Button>
            </div>
        </div>
    )
}

export default Portfolio
