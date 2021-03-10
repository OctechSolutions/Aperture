import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';

function LeaderBoardComponent(props) {

    if (props.data.length !== 0) {
        return (
            <div className="container">
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
                    {props.data.map((info, index) => {
                           return (
                               <tr>
                                   <td>{index+1}</td>
                                   {props.columns.map(col => {
                                       return (
                                           <td>{info[col].toString().length > 0 ? info[col] : <i className="text-muted">None</i>}</td>
                                       )
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
                <h1 className="text-center text-muted py-5">There seems to be no data in this table.</h1>
            </div>
        )
    }
}

export default LeaderBoardComponent;