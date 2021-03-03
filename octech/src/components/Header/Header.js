import React from 'react';
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
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Tooltip from '@material-ui/core/Tooltip';
import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';

function Header({ setValue }) {
  const dispatch = useDispatch();
  const history = useHistory();

  const logoutOfApp = async () => {
    dispatch(logout());
    await auth.signOut();
    history.push('/');
    window.location.reload();
  }

  const user = useSelector(selectUser);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

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
          onClick={() => {history.push("/search");setValue("search")}}
        >
          <Tooltip title={"Search"} aria-label="search">
            <SearchIcon />
          </Tooltip>
        </IconButton>
        <IconButton
          aria-label="notifications"
          onClick={() => {history.push("/notifications");setValue("notifications")}}
        >
          <Tooltip title={"Notifications"} aria-label="notifications">
            <NotificationsIcon />
          </Tooltip>
        </IconButton>
        <IconButton
          aria-label="avatar"
          onClick={handleMenu}
        >
          <Tooltip title={user.displayName} aria-label="name">
            <Avatar src={user?.photoUrl} />
          </Tooltip>
        </IconButton>
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
            <PersonOutlineIcon />
          </ListItemIcon>
                  Profile
                </MenuItem>
        <MenuItem onClick={logoutOfApp}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
                  Sign Out
                </MenuItem>
      </Menu>
    </div>
  )
}

export default Header
