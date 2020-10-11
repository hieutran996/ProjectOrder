import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-js-pagination';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import SendIcon from '@material-ui/icons/Send';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Chip from '@material-ui/core/Chip';
//Modal
import ModalSend from "./ModalSend";
//importExcel
import Files from 'react-files';
import XLSX from 'xlsx';
import { make_cols } from './MakeColumms';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import {HOST,HOST2} from '../Config'
import ModalViewData from './ModalViewData';
import { withStyles  } from '@material-ui/core/styles';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = (theme) => ({
  button: {
    margin: theme.spacing(1),
    marginRight: 0,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
});

class todoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      crrData: [],
      crrValInput: {
        name: '',
        job: '',
      },
      valueSearch: '',
      activePage: 1,
      totalItem: 0,
      offset: 0,
      showFirst: 0,
      showLast: 0,
      anchorEl: null,
      itemData: null,
      modalSend: false,
      modalViewData: false,
      openDialog: false,
      loadingImport: false,
      dataLabelDetail: null
    };

    this.itemsPerPage = 5;
  }

  componentDidMount() {
    this.getListData();
  }

  //GetList
  getListData = () => {
      fetch(`${HOST2}/api/v1/orders/search`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
      })
      .then((response) => {
          return response.json();
      })
      .then((data) => {
        console.log(data)
        if (data.meta.Code === 200) {
          this.setState({
            listData: data.data,
          }, () => {
              this.PaginationPage(this.state.activePage)
          });
        }
      });
  };
  PaginationPage = (activePage) => {
    var listData = [];
    this.state.listData.forEach((item) => {
      if (item.name.toLowerCase().indexOf(this.state.valueSearch.toLowerCase()) !== -1 || item.orderNumber.toLowerCase().indexOf(this.state.valueSearch.toLowerCase()) !== -1) {
        listData.push(item);
      }
    });
    const offset = (activePage - 1) * this.itemsPerPage;
    const crrData = listData.slice(offset, offset + this.itemsPerPage);
    this.setState({
      crrData,
      offset,
      showFirst: offset + 1,
      showLast: crrData.length + offset,
      totalItem: listData.length,
    });
  };
  handlePageChange = (pageNumber) => {
    this.setState(
      {
        activePage: pageNumber,
      },
      () => {
        this.PaginationPage(this.state.activePage);
      }
    );
  };

  //onChange File
  onFilesChange = (files) => {
    // if (files && files[0]) this.setState({ file: files[0] });
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, {
        type: rABS ? 'binary' : 'array',
        bookVBA: true,
      });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws);
      /* Update state */
      this.setState({ listData: data, cols: make_cols(ws['!ref']) }, () => {
        let {listData} = this.state;
        for (let index = 0; index < this.state.listData.length; index++) {
          listData[index].postalCode = listData[index].postalCode + ''
        }
        this.setState({
          listData
        }, () => {
          this.insertData(this.state.listData);
        });
      });
    };

    if (rABS) {
      reader.readAsBinaryString(files[0]);
    } else {
      reader.readAsArrayBuffer(files[0]);
    }
  };

  //Download
  downloadFormImport = () => {
    var url = window.location.href;
    var urlImport = url.replace(this.props.location.pathname, '/')
    window.location.href = urlImport + "_Import_Template.xlsx"
  }

  //Insert
  insertData = (dataInsert) => {
    this.setState({loadingImport: true});
    fetch(`${HOST2}/api/v1/orders`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        "orders": dataInsert
      }),
    })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
      this.setState({loadingImport: false});
        toast('Import Success!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        this.getListData();
    }).catch((error) => {
      toast('Import False!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
      this.setState({loadingImport: false});
    });
  };

  onFilesError = (error, file) => {
    alert('error code ' + error.code + ': ' + error.message);
  };

  handleClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
      openDialog: false
    });
  };

  modalClose = (status,data) => {
    if (status === true) {
      this.setState({
        modalSend: false,
        openDialog: true,
        dataLabelDetail: data
      })
      this.getListData();
    }
    this.setState({
        modalSend: false,
        modalViewData: false
    });
  }
  
  render() {
    const { classes } = this.props;
    let {openDialog,dataLabelDetail} = this.state;
    return (
      <div className="row">
        <div className="pb-3 col-md-6">
          <Input
            placeholder="Enter name or order..."
            className="mr-3"
            name="search"
            value={this.state.valueSearch}
            onChange={(event) => {
              var { valueSearch } = this.state;
              valueSearch = event.target.value;
              this.setState({
                valueSearch,
              });
            }}
            onKeyUp={(event) => {
              if (event.key === 'Enter') {
                this.setState(
                  {
                    activePage: 1,
                  },
                  () => {
                    this.PaginationPage(this.state.activePage);
                  }
                );
              }
            }}
            inputProps={{ 'aria-label': 'description' }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              this.setState(
                {
                  activePage: 1,
                },
                () => {
                  this.PaginationPage(this.state.activePage);
                }
              );
            }}
          >
            Search
          </Button>
        </div>
        <div className="text-right col-md-6">
          <Button
            variant="contained"
            color="default"
            className={classes.button}
            startIcon={<CloudDownloadIcon />}
            onClick={this.downloadFormImport}
          >
            Export Template
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<CloudUploadIcon />}
          >
            <Files
              className="files-dropzone"
              onChange={this.onFilesChange}
              onError={this.onFilesError}
              accepts={['.xlsx']}
              multiple={false}
              // maxFiles={3}
              minFileSize={0}
              clickable
            >
              Import Excel
            </Files>
          </Button>
        </div>
        <div className="col-12">
          <Table bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Order Number</th>
                <th>Name</th>
                <th>Address 1</th>
                <th>Country</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {this.state.crrData.map((value, index) => {
                const Status = ""
                if (value.status === 1) {
                  Status = <Chip label="Processing" />
                } else if (value.status === 2) {
                  Status = <Chip label="Shipping" />
                } else if (value.status === 3) {
                  Status = <Chip label="Hold-on" />
                } else if (value.status === 4) {
                  Status = <Chip label="Completed" />
                }
                return (
                  <tr key={index}>
                    <td>{index + this.state.offset + 1}</td>
                    <td>{value.orderNumber}</td>
                    <td>{value.name}</td>
                    <td>{value.address1}</td>
                    <td>{value.country}</td>
                    <td>{Status}</td>
                    <td width={130}>
                      <IconButton
                        aria-label="view"
                        color="primary"
                        onClick={() => {
                          this.setState({
                            itemViewData: value,
                            modalViewData: true
                          });
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        color="secondary"
                        onClick={(v) => {
                            value.weight = "";
                            value.height = "";
                            value.width = "";
                            value.length = "";
                            value.is_max = 1;
                            value.items = [{
                                "itemDescription": "",
                                "packagedQuantity": "",
                                "skuNumber": ""
                            }];
                            this.setState({
                                itemData: value,
                                modalSend: true
                            });
                        }}
                      >
                        <SendIcon />
                      </IconButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <ModalSend
              data={this.state.itemData}
              show={this.state.modalSend}
              onHide={this.modalClose}
          />
          <ModalViewData
              data={this.state.itemViewData}
              show={this.state.modalViewData}
              onHide={this.modalClose}
          />
          <ToastContainer />
          <Dialog
              open={openDialog}
              onClose={this.handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
          >
              <DialogTitle id="alert-dialog-title">{"Details"}</DialogTitle>
              <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <div>
                  <span>Tracking Number: </span><span><b>{dataLabelDetail !== null && dataLabelDetail.trackingNumber}</b> </span>
                </div>
                <div>
                  <span>Partner TrackingNumber: </span><span><b>{dataLabelDetail !== null && dataLabelDetail.partnerTrackingNumber}</b> </span>
                </div>
                <div>
                <span>URL: </span><a href={dataLabelDetail !== null && dataLabelDetail.url} target="_blank">{dataLabelDetail !== null && dataLabelDetail.url}</a>
                </div>
              </DialogContentText>
              </DialogContent>
          </Dialog>
          <Backdrop className={classes.backdrop} open={this.state.loadingImport}>
              <CircularProgress color="inherit" />
          </Backdrop>
          <Pagination
            activePage={this.state.activePage}
            itemsCountPerPage={this.itemsPerPage}
            totalItemsCount={this.state.totalItem}
            pageRangeDisplayed={5}
            onChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(todoList);