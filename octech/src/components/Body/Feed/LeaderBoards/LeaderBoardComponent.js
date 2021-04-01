import React from 'react';
import Table from 'react-bootstrap/Table';
import { Avatar } from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import { green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import CollectionsIcon from '@material-ui/icons/Collections';
import { useHistory } from "react-router-dom"

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '80%'
    },
    green: {
        color: '#fff',
        backgroundColor: green[500],
    },
    fab: {
        top: 'auto',
        bottom: 65,
        right: 20,
        position: 'fixed',
        zIndex: 999,
    },
}));

function LeaderBoardComponent(props) {
    const classes = useStyles();
    const history = useHistory();
    let tableData = [];
    let specialIndex = undefined;
    if (props.data.length !== 0) {
        //Find our rank in the data
        if (props.highlightColumn)
        {
            for (let i = 0; i < props.data.length; i++)
            {
                if (props.data[i][props.highlightColumn] === props.highlightColumnData)
                {
                    specialIndex = i;
                }
            }
        }
        
        if (props.data.length > (props.limit || 10))
        {
            tableData = props.data.slice(0, props.limit || 10);
        } else {
            tableData = props.data;
        }

        if (specialIndex >= tableData.length) {
            tableData.push(props.data[specialIndex]);
        }

        return (
            <div>
                <h1 className="text-center py-3">{props.title}</h1>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            {props.headers.map(header => {
                                return (
                                    <th>{header}</th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((info, index) => {
                            return (
                                <tr>
                                    <td style={{ verticalAlign: "middle" }}>{(info.rank < 4) ? ['🥇','🥈','🥉'][info.rank-1] : (info.rank)}</td>
                                    {props.columns.map(col => {

                                        if (col === "name") {
                                            if (info.channelBy) {
                                                return (
                                                    <td style={{ display: "flex", alignItems: "center" }}>
                                                        <IconButton>
                                                            <Avatar className={classes.green} onClick={() => history.push(`/channel/${info.name}`)}>
                                                                <CollectionsIcon fontSize="small" />
                                                            </Avatar>
                                                        </IconButton>
                                                        <div style = {{cursor: "pointer"}} onClick ={ () => history.push(`/user/${info.name}`) }>&nbsp;&nbsp;&nbsp;{info.name}</div>
                                                    </td>
                                                )
                                            }
                                            else {
                                                return (
                                                    <td style={{ display: "flex", alignItems: "center" }}>
                                                        <IconButton>
                                                            <Avatar src={info.photoUrl} onClick={() => history.push(`/user/${info.name}`)} />
                                                        </IconButton>
                                                        <div style = {{cursor: "pointer"}} onClick ={ () => history.push(`/user/${info.name}`) }>&nbsp;&nbsp;&nbsp;{info.name}</div>
                                                    </td>
                                                )
                                            }

                                        }
                                        else {
                                            if (info[col] && info[col].toString().length > 0) {
                                                return (
                                                    <td style={{ verticalAlign: "middle" }}>{info[col]}</td>
                                                )
                                            }
                                            else {
                                                return (
                                                    <td>{<i className="text-muted">None</i>}</td>
                                                )
                                            }
                                        }

                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </div>

        )
    } else {
        return (
            <div className="container">
                <h1 className="text-center text-muted py-5">There seems to be no entries.</h1>
            </div>
        )
    }
}

export default LeaderBoardComponent;