import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import swal from 'sweetalert';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import Divider from '@material-ui/core/Divider';
import Table from 'react-bootstrap/Table';
import { toast } from 'react-toastify';

import { HOST, HOST2 } from '../Config';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles  } from '@material-ui/core/styles';



const useStyles = (theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
});
class ModalSend extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSend: null,
            access_token: "",
            client_id: "",
            loading: false,
            openDialog: false,
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
        this.setState({loading: true});
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
            this.setState({
                loading: false,
                openDialog: true
            });
            this.insertLabelDetail(data.data.labelDetails)
            toast('Send Success!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return this.props.onHide(true,data.data.labelDetails);
        } else {
            this.setState({loading: false});
            toast('Send Error!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    //Insert Label Detail
    insertLabelDetail = (labelDetails) => {
        fetch(`${HOST2}/api/v1/labels`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
            'orderNumber': this.state.dataSend.orderNumber,
            labelDetails
        }),
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data)
        });
    };

    SendHandle(e) {
        var {dataSend} = this.state;
        dataSend[e.target.name] = parseInt(e.target.value);
        this.setState({ dataSend });
    }

    itemHandle(e,index) {
        var {dataSend} = this.state;
        dataSend.items[index][e.target.name] = e.target.value;
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
        const { classes } = this.props;
        let {dataSend} = this.state;
        let click_handle = (event) => {
            this.updateGroup(dataSend, event);
        }
        console.log(dataSend)
        return (
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className="h5">
                        Order Number: <b>{dataSend !== null && dataSend.orderNumber}</b>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="formAddGroup">
                        <div className="col-xl-12 p-0">
                            <div className="m-widget14 row m-0 pb-3">

                                <div className="form-group m-form__group col-md-6 pl-md-0">
                                    <label htmlFor="Name">Width<span className="text-danger"> *</span></label>
                                    <input type="number" className="form-control m-input" id="Width" name='width' value={dataSend !== null && dataSend.width} onKeyDown={(event) => this.handleEnter(event)} onChange={e => this.SendHandle(e)}  />
                                </div>
                                <div className="form-group m-form__group col-md-6 pr-md-0">
                                    <label htmlFor="Name">Height<span className="text-danger"> *</span></label>
                                    <input type="number" className="form-control m-input" id="Height" name='height' value={dataSend !== null && dataSend.height} onKeyDown={(event) => this.handleEnter(event)} onChange={e => this.SendHandle(e)}  />
                                </div>
                                <div className="form-group m-form__group col-md-6 pl-md-0">
                                    <label htmlFor="Name">Weight<span className="text-danger"> *</span></label>
                                    <input type="number" className="form-control m-input" id="Weight" name='weight' value={dataSend !== null && dataSend.weight} onKeyDown={(event) => this.handleEnter(event)} onChange={e => this.SendHandle(e)} />
                                </div>
                                <div className="form-group m-form__group col-md-6 pr-md-0">
                                    <label htmlFor="Name">Length<span className="text-danger"> *</span></label>
                                    <input type="number" className="form-control m-input" id="Length" name='length' value={dataSend !== null && dataSend.length} onKeyDown={(event) => this.handleEnter(event)} onChange={e => this.SendHandle(e)}  />
                                </div>
                            </div>
                            <Divider />
                            <div className="m-widget14 row m-0 pt-4">
                                <Table bordered hover>
                                    <thead>
                                    <tr>
                                        <th>SKU Number<span className="text-danger"> *</span></th>
                                        <th>Quantity<span className="text-danger"> *</span></th>
                                        <th>Description<span className="text-danger"> *</span>  </th>
                                        <th>
                                            <IconButton
                                                aria-label="add"
                                                color="primary"
                                                size="small"
                                                onClick={() => {
                                                    dataSend.items.push({
                                                        "itemDescription": "",
                                                        "packagedQuantity": "",
                                                        "skuNumber": ""
                                                    })
                                                    this.setState({
                                                        dataSend
                                                    });
                                                }}
                                            >
                                                <AddIcon />
                                            </IconButton>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            dataSend !== null && dataSend.items.map((val, index) => {
                                                return(
                                                    <tr key={index}>
                                                        <td><input type="text" className="form-control m-input" id="skuNumber" name='skuNumber' value={val.skuNumber} onKeyDown={(event) => this.handleEnter(event)} onChange={e => this.itemHandle(e,index)}  /></td>
                                                        <td><input type="number" className="form-control m-input" id="Quantity" name='packagedQuantity' value={val.packagedQuantity} onKeyDown={(event) => this.handleEnter(event)} onChange={e => this.itemHandle(e,index)}  /></td>
                                                        <td><input type="text" className="form-control m-input" id="Description" name='itemDescription' value={val.itemDescription} onKeyDown={(event) => this.handleEnter(event)} onChange={e => this.itemHandle(e,index)}  /></td>
                                                        <td width={50}>
                                                            {
                                                                dataSend.items.length > 1
                                                                &&
                                                                <IconButton
                                                                    aria-label="delete"
                                                                    color="secondary"
                                                                    size="small"
                                                                    onClick={(v) => {
                                                                        console.log(index)
                                                                        dataSend.items.splice(index, 1)
                                                                        this.setState({
                                                                            dataSend
                                                                        });
                                                                    }}
                                                                >
                                                                    <CloseIcon />
                                                                </IconButton>
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <Backdrop className={classes.backdrop} open={this.state.loading}>
                                    <CircularProgress color="inherit" />
                                </Backdrop>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="contained"  onClick={this.props.onHide} className="mr-2">Close</Button>
                    <Button variant="contained" color="primary"   onClick={click_handle}>Send</Button>
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



export default withStyles(useStyles)(ModalSend);