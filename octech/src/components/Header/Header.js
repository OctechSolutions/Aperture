import React from 'react';
import './Header.css';
import HeaderOption from './HeaderOption';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';
import { auth } from '../../firebase';
import { logout } from '../../features/userSlice';
import logo from './aperture_logo.svg';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { useHistory } from "react-router-dom";

function Header() {
  const dispatch = useDispatch();
  const history = useHistory();

  const logoutOfApp = async () => {
    dispatch(logout());
    await auth.signOut();
    history.push('/');
    window.location.reload();
  }

  const user = useSelector(selectUser);

  return (
    <div className="header">
      <Link style={{ textDecoration: 'none', color: "black" }} to={'/'}> {/* Links to the home feed for the user */}
        <div className="header__left">
          <img src={logo} alt="Aperture" />
          <h6>Aperture</h6>
        </div>
      </Link>
      <Button onClick={logoutOfApp}>Logout</Button>
      <div className="header__right">
        <Link style={{ textDecoration: 'none', color: "black" }} to={`/user/${user?.displayName}`}>
          {/* This link takes the user to their profile */}
          <HeaderOption
            avatar={true}
          />
          <p>{user?.displayName}</p>
        </Link>
      </div>
    </div>
  )
}

export default Header
