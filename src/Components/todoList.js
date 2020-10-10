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
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
//Modal
import ModalSend from "./ModalSend";
//importExcel
import Files from 'react-files';
import XLSX from 'xlsx';
import { make_cols } from './MakeColumms';

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
    };

    this.itemsPerPage = 5;
  }
  PaginationPage = (activePage) => {
    var listData = [];
    this.state.listData.forEach((item) => {
      if (
        item.name
          .toLowerCase()
          .indexOf(this.state.valueSearch.toLowerCase()) !== -1
      ) {
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
        this.PaginationPage(this.state.activePage);
      });
    };

    if (rABS) {
      reader.readAsBinaryString(files[0]);
    } else {
      reader.readAsArrayBuffer(files[0]);
    }
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
    });
  };

    modalClose = () => {
        this.setState({
            modalSend: false,
        });
    }


  render() {
    console.log(this.state.listData);
    return (
      <div className="row">
        <div className="pb-3 col-md-6">
          <Input
            placeholder="Enter name..."
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
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={this.handleClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={this.state.anchorEl}
            keepMounted
            open={Boolean(this.state.anchorEl)}
            onClose={this.handleClose}
          >
            <MenuItem onClick={this.handleClose}>
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
            </MenuItem>
            <MenuItem onClick={this.handleClose}>My account</MenuItem>
            <MenuItem onClick={this.handleClose}>Logout</MenuItem>
          </Menu>
        </div>
        <div className="col-12">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Order Number</th>
                <th>Name</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Address 1</th>
                <th>Address 2</th>
                <th>City</th>
                <th>State</th>
                <th>PostalCode</th>
                <th>Country</th>
                <th>Phone</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {this.state.crrData.map((value, index) => {
                return (
                  <tr key={index}>
                    <td>{index + this.state.offset + 1}</td>
                    <td>{value.orderNumber}</td>
                    <td>{value.name}</td>
                    <td>{value.item}</td>
                    <td>{value.quantity}</td>
                    <td>{value.address1}</td>
                    <td>{value.address2}</td>
                    <td>{value.city}</td>
                    <td>{value.state}</td>
                    <td>{value.postalCode}</td>
                    <td>{value.country}</td>
                    <td>{value.phone}</td>
                    <td width={130}>
                      <IconButton
                        aria-label="view"
                        color="primary"
                        onClick={() => {
                          
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
                                "itemDescription": "Wallet",
                                "packagedQuantity": 2,
                                "skuNumber": "MVF001"
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
          <ToastContainer />
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

export default todoList;
