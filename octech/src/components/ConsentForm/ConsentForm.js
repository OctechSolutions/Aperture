import React from 'react'
import Modal from 'react-bootstrap/Modal'

export default function ConsentForm({show, heading, message, btnLabel, closeFun, onBtnClickFun}) {
    return (
        <Modal
            show={show}
            keyboard={false}
            size="m"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >

            <Modal.Header closeButton onClick={ closeFun }>
                <div style={{ display: "flex", marginLeft: "auto", marginRight: "-32px" }}>
                    <h4>{ heading }</h4>
                </div>
            </Modal.Header>

            <Modal.Body>
                { message }<br /><br />
                <button onClick={ () => {
                    closeFun()
                    onBtnClickFun() 
                }}>
                    { btnLabel }
                </button>
            </Modal.Body>

        </Modal>
    )
}
