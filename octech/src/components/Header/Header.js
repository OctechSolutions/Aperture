import React, { useState } from 'react';
import './Header.css';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';
import { auth } from '../../firebase';
import { logout } from '../../features/userSlice';
import logo from './aperture_logo.png';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { Avatar } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ListItemIcon from '@material-ui/core/ListItemIcon';
// import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Tooltip from '@material-ui/core/Tooltip';
import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Badge from '@material-ui/core/Badge';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import Modal from 'react-bootstrap/Modal';
import EditProfileModal from "./EditProfileModal"
import EditIcon from "@material-ui/icons/Edit";
import BugReportIcon from '@material-ui/icons/BugReport';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

function Header({ setValue, hasNotifications }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showEditProfile,setShowEditProfile] = useState(false);

  const logoutOfApp = async () => {
    dispatch(logout());
    await auth.signOut();
    history.push('/');
    window.location.reload();
  }

  const user = useSelector(selectUser);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [loading,setLoading] = useState(false)

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="header">
      <Link style={{ textDecoration: 'none', color: "black" }} onClick={() => { setValue("") }} to={'/'}> {/* Links to the home feed for the user */}
        <IconButton
          aria-label="logo"
        >
          <img className="apertureLogo" src={logo} style={{ marginTop: "2px" }} alt="Aperture" />
        </IconButton>
      </Link>
      {/* <div className="searchBar" style={{ width: "30vw" }}>
        <ReactSearchAutocomplete
          items={users}
          onFocus={openSearchHandler}
          useOptions={{ keys: ["name", "email"] }}
          resultStringKeyName="name"
          // onSearch={(string,result)=>{console.log(string,result)}}
          onSelect={selectedUser => openUser(selectedUser)}
          placeholder="Search"
          styling={
            {
              border: "2px grey solid",
            }
          }
        />
      </div> */}
      {/* <Button onClick={logoutOfApp}>Logout</Button> */}
      {/* <Link style={{ textDecoration: 'none', color: "black" }} onClick={() => { setValue(`user/${user?.displayName}`) }} to={`/user/${user?.displayName}`}> */}
      {/* This link takes the user to their profile */}
      <div>
        <IconButton
          aria-label="search"
          onClick={() => { history.push("/search"); setValue("search") }}
        >
          <Tooltip title={"Search"} aria-label="search">
            <SearchIcon />
          </Tooltip>
        </IconButton>

        <IconButton
          aria-label="leaderboards"
          onClick={() => { history.push("/leaderboards/globalUsersLeaderBoard"); setValue("leaderboards") }}
          >
          <Tooltip title={"Leaderboards"} aria-label="leaderboards">
            <EqualizerIcon />
          </Tooltip>
        </IconButton>

        <IconButton
          aria-label="notifications"
          onClick={() => { history.push("/notifications"); setValue("notifications") }}
        >
          <Tooltip title={"Notifications"} aria-label="notifications">
            <Badge color="secondary" badgeContent={hasNotifications} max={10}>
              <NotificationsIcon />
            </Badge>
          </Tooltip>
        </IconButton>

        {/* <IconButton
          aria-label="BugReportForm"
          onClick={() => { history.push("/bugReportForm"); setValue("BugReportForm") }}
          >
          <Tooltip title={"Report a Bug"} aria-label="BugReportForm">
            <BugReportIcon />
          </Tooltip>
        </IconButton> */}

        <IconButton
          aria-label="avatar"
          onClick={handleMenu}
        >
          <Tooltip title={user.displayName} aria-label="name">
            <Avatar src={user?.photoUrl} />
          </Tooltip>
        </IconButton>
        {/* <IconButton
          aria-label="signout"
          onClick={logoutOfApp}
        >
          <Tooltip title={"Sign Out"} aria-label="signout">
            <ExitToAppIcon />
          </Tooltip>
        </IconButton> */}
      </div>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => { history.push(`/user/${user.displayName}`); setValue(`user/${user.displayName}`); handleClose() }}>
          <ListItemIcon>
            <Avatar src={user?.photoUrl} />
          </ListItemIcon>
            Profile
        </MenuItem>
        <MenuItem onClick={()=>{setShowEditProfile(true);handleClose()}}>
          <ListItemIcon>
            <EditIcon/>
          </ListItemIcon>
            Edit Profile
        </MenuItem>
        <MenuItem onClick={logoutOfApp}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
            Sign Out
        </MenuItem>
        <MenuItem onClick={e => {history.push("/bugReportForm");handleClose()}}>
          <ListItemIcon>
            <BugReportIcon/>
          </ListItemIcon>
            Report a Bug
        </MenuItem>
      </Menu>
      <Modal
          show={showEditProfile}
          onHide={() => { setShowEditProfile(false) }}
          keyboard={false}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
      >
        <Modal.Body>
            <EditProfileModal setShowEditProfile ={setShowEditProfile} editEmail={false} setLoading ={setLoading} />
        </Modal.Body>
      </Modal>

      <Modal
          show={loading}
          keyboard={false}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
      >
        <Modal.Body>
          <Backdrop  open={loading} >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Header