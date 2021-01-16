import React from 'react';
import './index.css';
import { HeaderOption } from '../../../components';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Auth, SelectUser, LogoutAction } from '../../../config';
import logo from './aperture_logo.svg';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { useHistory } from "react-router-dom";



function Header() {
  const dispatch = useDispatch();
  const history = useHistory();

  const logoutOfApp = () => {
    dispatch(LogoutAction());
    Auth.signOut();
    history.push('/');
    window.location.reload();
  }

  const user = useSelector(SelectUser);

  return (
    <div className="header">
      <Link style={{ textDecoration: 'none', color: "black" }} to={'/feed'}> {/* Links to the home feed for the user */}
        <div className="header__left">
          <img src={logo} alt="Aperture" />
          <h6>Aperture</h6>
        </div>
      </Link>
      <Button onClick={logoutOfApp}>LogoutAction</Button>
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
