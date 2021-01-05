import React from 'react';
import './Header.css';
import HeaderOption from './HeaderOption';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';
import { auth } from '../../firebase';
import { logout } from '../../features/userSlice';
import logo from './aperture_logo.svg'

function Header() {
  const dispatch = useDispatch();

  const logoutOfApp = () => {
    dispatch(logout());
    auth.signOut();
    window.location.reload();
  }

  const user = useSelector(selectUser);

  return (
    <div className="header">
      <div className="header__left">
        <img src={logo} alt="Aperture" />
        <h6>Aperture</h6>
      </div>
      <div className="header__right">
        <HeaderOption
          avatar={true}
          onClick={logoutOfApp}
        />
        <h6>{user?.displayName}</h6>
      </div>
    </div>
  )
}

export default Header
