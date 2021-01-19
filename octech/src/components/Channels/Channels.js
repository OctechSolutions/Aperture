import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { Link } from 'react-router-dom';

function Channels({ profileName }) {

    //State variables
    const user = useSelector(selectUser);
    const [channelName, setChannelName] = useState("");
    const [channelDesc, setChannelDesc] = useState("");
    const [channelTheme, setChannelTheme] = useState("");
    const [hasNoChannels, setHasNoChannels] = useState(true);
    const [channels, setChannels] = useState([]);
    const [clearToSubmit, setClearToSubmit] = useState(false);
    const [channelDoesExist, setChannelDoesExist] = useState(false);


    useEffect(() => {
        //Fetch all channels created by the user
        db.collection("channels")
            .where("creator", "==", profileName)
            .onSnapshot(res => {
                if (res.empty) {
                    //Show the message that the user has no channels
                    setHasNoChannels(true);
                } else {
                    //Display the user's channels
                    setHasNoChannels(false);
                    setChannels(res.docs);
                }
            });

        if (channelName.length > 0 && channelDesc.length > 0 && channelTheme.length > 0) {
            setClearToSubmit(true);
        }

        if (channelDoesExist) {
            setClearToSubmit(false);
        }
    }, [channelDesc.length, channelDoesExist, channelTheme.length, channelName.length, profileName]);

    useEffect(() => {
        db.collection("channels").get()
    }, [])

    function createChannel(e) {
        //Create a new channel
        e.preventDefault();
        db.collection("channels")
            .add({
                creator: user.displayName,
                name: channelName,
                description: channelDesc,
                theme: channelTheme
            }).then(() => {
                // window.location.reload();
            });
    }

    function checkChannelExistence(name) {
        //Check if another channel exists with this name
        return db.collection("channels").where("name", "==", name).get()
    }

    function checkChannelName(name) {
        setChannelName(name);
        if (name.length > 0) {
            checkChannelExistence(name).then(res => {
                setChannelDoesExist(!res.empty);
            });
        } else {
            setChannelDoesExist(false);
        }
    }

    function deleteChannel(channel) {
        db.collection("channels")
            .doc(channel.id)
            .delete()
            .then(() => {
                // window.location.reload();
            });
        console.log(channel.data());
        db.collection("posts").where("channel", "==", channel.data().name).get().then((a) => {
            a.forEach((b) => {
                console.log(b.id)
                db.collection("postImages").where("ref", "==", b.id).get().then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        doc.ref.delete();
                    });
                });
                b.ref.delete();
            })
        })
    }

    return (
        <div className="container pb-5" id="channels">
            <div className="row" id="title">
                <div className="col text-center">
                    <p className="display-3">Channels</p>
                    <hr />
                </div>
            </div>
            <div className="row py-5" id="channelList">
                <div className="col">
                    {(hasNoChannels) ?
                        // <p className="text-muted">Looks like you have no channels. How about creating one?</p>
                        <></>
                        : channels.map(channel => {
                            let info = channel.data();
                            return (

                                <div className="card my-2">
                                    <div className="card-body">
                                        <Link to={`/user/${profileName + "/channel/" + info.name}`}>
                                            <h3 className="card-title">{info.name} [{info.theme}]</h3>
                                            <h6 className="card-subtitle mb-2 text-muted text-truncate">{info.description}</h6>
                                        </Link>
                                        {(profileName === user.displayName) && <button type="button" class="btn btn-outline-danger" onClick={e => deleteChannel(channel)}>Delete</button>}
                                    </div>
                                </div>

                            );
                        })}
                </div>
                {(profileName === user.displayName) && <div className="col-sm mx-5">
                    <p className="h4 pb-3">Create a channel!</p>
                    <form>
                        <div className="form-group py-2">
                            <label htmlFor="channelNameInput">Name</label>
                            <input type="text" className="form-control" id="channelNameInput" placeholder="Cats in hoodies" onChange={e => checkChannelName(e.target.value)}></input>
                            {(channelDoesExist) ? <small className="form-text text-danger">A channel with this name already exists.</small> : ''}
                            {(channelName.length === 0) ? <small className="form-text text-danger">Please enter a channel name.</small> : ''}
                        </div>
                        <div className="form-group py-2">
                            <label htmlFor="channelNameDesc">Description</label>
                            <input type="text" className="form-control" id="channelNameDesc" placeholder="A place for all cats in hoodies!" onChange={e => setChannelDesc(e.target.value)}></input>
                            {(channelDesc.length === 0) ? <small className="form-text text-danger">Please enter a channel description.</small> : ''}

                        </div>
                        <div className="form-group py-2">
                            <label htmlFor="channelNameTheme">Theme</label>
                            <input type="text" className="form-control" id="channelNameTheme" placeholder="Cats" onChange={e => setChannelTheme(e.target.value)}></input>
                            {(channelTheme.length === 0) ? <small className="form-text text-danger">Please enter a channel theme.</small> : ''}
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={!clearToSubmit} onClick={createChannel}>Create!</button>
                    </form>
                </div>}
            </div>
        </div>
    )
}

export default Channels;