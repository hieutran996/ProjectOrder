import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import swal from 'sweetalert';

import { HOST } from '../Config';
const axios = require('axios');
class ModalSend extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSend: null,
            access_token: "",
            client_id: ""
        }
    }

    componentDidMount() {
        let access_token = localStorage.getItem("access_token");
        let client_id = localStorage.getItem("client_id");
        this.setState({
            access_token,
            client_id
        });
    }
    

    updateGroup = async (dataSend, event) => {
        event.preventDefault();
        let data = await fetch(`${HOST}/v1/label?access_token=${this.state.access_token}&client_id=${this.state.client_id}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': ' application/json;charset=UTF-8',
            },
            body: JSON.stringify(dataSend)
        }).then((response) => {
            return response.json()
        });
        if (data.meta.code === 200) {
            
        }
    }

    SendHandle(e) {
        var {dataSend} = this.state;
        dataSend[e.target.name] = parseInt(e.target.value);
        this.setState({ dataSend });
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.show === true) {
            //dataSend
            this.setState({
                dataSend: nextProps.data
            });
        }
    }

    handleEnter = (event) => {
        if (event.keyCode === 13) {
            const form = event.target.form;
            const index = Array.prototype.indexOf.call(form, event.target);
            form.elements[index + 1].focus();
            event.preventDefault();
        }
    }

    render() {
        let {dataSend} = this.state;
        let click_handle = (event) => {
            this.updateGroup(dataSend, event);
        }
        console.log(dataSend)
        return (
            <Modal
                {...this.props}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="formAddGroup">
                        <div className="col-xl-12">
                            <div className="m-widget14">
                                <div className="form-group m-form__group">
                                    <label htmlFor="Name">Weight<span className="text-danger"> *</span></label>
                                    <input type="number" className="form-control m-input" id="Weight" name='weight' value={dataSend !== null && dataSend.weight} onKeyDown={(event) => this.handleEnter(event)} onChange={e => this.SendHandle(e)} />
                                </div>
                                <div className="form-group m-form__group">
                                    <label htmlFor="Name">Height<span className="text-danger"> *</span></label>
                                    <input type="number" className="form-control m-input" id="Height" name='height' value={dataSend !== null && dataSend.height} onKeyDown={(event) => this.handleEnter(event)} onChange={e => this.SendHandle(e)}  />
                                </div>
                                <div className="form-group m-form__group">
                                    <label htmlFor="Name">Width<span className="text-danger"> *</span></label>
                                    <input type="number" className="form-control m-input" id="Width" name='width' value={dataSend !== null && dataSend.width} onKeyDown={(event) => this.handleEnter(event)} onChange={e => this.SendHandle(e)}  />
                                </div>
                                <div className="form-group m-form__group">
                                    <label htmlFor="Name">Length<span className="text-danger"> *</span></label>
                                    <input type="number" className="form-control m-input" id="Length" name='length' value={dataSend !== null && dataSend.length} onKeyDown={(event) => this.handleEnter(event)} onChange={e => this.SendHandle(e)}  />
                                </div>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.onHide}>Close</Button>
                    <Button variant="accent" id="button_addGroup" className="m-loader--light m-loader--right" onClick={click_handle}>Save</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

ModalSend.propTypes = {
    data: PropTypes.object,
    onHide: PropTypes.func.isRequired,
    show: PropTypes.bool,
}

export default ModalSend;