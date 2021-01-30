import React, {useEffect, useState} from 'react';
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
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { db } from "../../firebase";

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
  const [viewingUserData,setViewingUserData] = useState([])
  useEffect(() => {
    db.collection("users").doc(user.displayName)
        .onSnapshot((snapshot) =>
          setViewingUserData(snapshot.data())
        );
}, [user.displayName]);
  //User and channel List
  const [users,setUsers] = useState([]);
  //Fetch Users from the database
  const openSearchHandler = () =>{
    let list = [];
    ((viewingUserData.blockedBy.length>0) ?
    db.collection("users")
    .where("name","not-in",viewingUserData.blockedBy)
    .get().then(result =>{
      list.push(...result.docs.map(doc => doc.data()));
    }) :
    db.collection("users")
    .get().then(result =>{
      list.push(...result.docs.map(doc => doc.data()));
    }))
    db.collection("channels").get().then(result =>{
      list.push(...result.docs.map(doc => doc.data()));
    }) 
    setUsers(list);
  }
  //Open the selected users profile
  const openUser = (selectedUser) => {
    if(selectedUser.creator === undefined)
      history.push(`/user/${selectedUser.name}`); 
    else
      history.push(`/user/${selectedUser.creator + "/channel/" + selectedUser.name}`);
  }

  return (
    <div className="header">
      <Link style={{ textDecoration: 'none', color: "black" }} to={'/'}> {/* Links to the home feed for the user */}
        <div className="header__left">
          <img src={logo} alt="Aperture" />
          <h6>Aperture</h6>
        </div>
      </Link>
      <div className = "searchBar" style={{ width: "30vw" }}>
      <ReactSearchAutocomplete 
        items={users}
        onFocus={openSearchHandler}
        useOptions={{ keys: ["name", "email"] }}
        resultStringKeyName = "name"
        // onSearch={(string,result)=>{console.log(string,result)}}
        onSelect = {selectedUser => openUser(selectedUser)}
        placeholder ="Search"
        styling={
          {
            border: "2px grey solid",
          }
        }
      />
      </div>
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
