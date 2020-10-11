import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from 'react-bootstrap/Table';
import { Modal } from 'react-bootstrap';
class ModalViewData extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataView: null,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.show === true) {
            //dataView
            this.setState({
                dataView: nextProps.data
            });
        }
    }


    render() {
        let {dataView} = this.state;
        return (
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className="h5">
                        Order Number: <b>{dataView !== null && dataView.orderNumber}</b>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="formAddGroup">
                        <div className="col-xl-12 p-0">
                            <Table bordered hover>
                                <thead>
                                <tr>
                                    <th>Address 2</th>
                                    <th>City</th>
                                    <th>State</th>
                                    <th>Postal Code</th>
                                    <th>Phone</th>
                                </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{dataView !== null && dataView.address2}</td>
                                        <td>{dataView !== null && dataView.city}</td>
                                        <td>{dataView !== null && dataView.state}</td>
                                        <td>{dataView !== null && dataView.postalCode}</td>
                                        <td>{dataView !== null && dataView.phone}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                        <div className="col-xl-12 p-0">
                            <Table bordered hover>
                                <thead>
                                <tr>
                                    <th>Tracking Number</th>
                                    <th>Partner TrackingNumber</th>
                                    <th>URL</th>
                                </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{dataView !== null && dataView.lableDetails.trackingNumber}</td>
                                        <td>{dataView !== null && dataView.lableDetails.partnerTrackingNumber}</td>
                                        <td style={{"wordBreak": "break-all"}}><a href={dataView !== null && dataView.lableDetails.url} target="_blank">{dataView !== null && dataView.lableDetails.url}</a></td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        );
    }
}

ModalViewData.propTypes = {
    data: PropTypes.object,
    onHide: PropTypes.func.isRequired,
    show: PropTypes.bool,
}



export default ModalViewData;