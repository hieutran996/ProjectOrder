import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-js-pagination';
//importExcel
import { HOST2 } from '../../Config';
import { withStyles, useTheme } from '@material-ui/core/styles';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Chip from '@material-ui/core/Chip';
import Moment from 'moment';
// Chart
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
//import Chart
import { chartDay } from './ChartDay';
import { chartColumn } from './ChartColumn';

const useStyles = (theme) => ({
  button: {
    margin: theme.spacing(1),
    marginRight: 0,
    marginBottom: 0,
  },
  input: {
    marginTop: 0,
    marginRight: 10,
    marginBottom: 0,
  },
  buttonSearch: {
    marginTop: -5,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  bg_processing: {
    background: '#c4c5d6',
    color: '#111',
  },
  bg_shipping: {
    background: '#ffb822',
    color: '#fff',
  },
  bg_delay: {
    background: '#f4516c',
    color: '#fff',
  },
  bg_completed: {
    background: '#00c5dc',
    color: '#fff',
  },
  formControl: {
    margin: theme.spacing(1),
    marginTop: 0,
    marginLeft: 0,
    minWidth: '100%',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  container: {
    padding: theme.spacing(0),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 500,
  },
});

class BranchSell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      crrData: [],
      valueSearch: '',
      activePage: 1,
      totalItem: 0,
      offset: 0,
      showFirst: 0,
      showLast: 0,
      loading: true,
      value: 0,
      lengWaitting: 0,
      lengShipping: 0,
      lengDelay: 0,
      //ApexChartDonut
      series: [44, 55, 13, 43, 22],
      options: {
        chart: {
          width: 380,
          type: 'pie',
        },
        labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
      },
      //Chart Line
      chartOptionsLine: chartDay,
      //Chart Column
      chartOptionsColumn: chartColumn,
      //Area Chart
      seriesArea: [{
        name: 'series1',
        data: [31, 40, 28, 51, 42, 109, 100]
      }],
      optionsArea: {
        chart: {
          height: 350,
          type: 'area'
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          type: 'datetime',
          categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy HH:mm'
          },
        },
      },
    };

    this.itemsPerPage = 10;
  }

  componentDidMount() {
    this.getAllStatus();
    var data = [
      [Date.UTC(2020, 5 - 1, 20), 53],
      [Date.UTC(2020, 5 - 1, 21), 90],
      [Date.UTC(2020, 5 - 1, 22), 72],
      [Date.UTC(2020, 5 - 1, 23), 62],
      [Date.UTC(2020, 5 - 1, 24), 82],
      [Date.UTC(2020, 5 - 1, 25), 102],
      [Date.UTC(2020, 5 - 1, 26), 42],
    ]
    this.setState({
      chartOptionsLine: {
        title: {
            text: '',
        },
        xAxis: {
            type: 'datetime',
            labels: {
                format: '{value:%d/%m}',
            }
        },
        series: [{
            type: 'area',
            name: 'Traffic',
            data: data
        }],
      },
      chartOptionsColumn: {
        series: [{
            name: 'Column',
            data: [10,30,20],
            color: '#ffc241'
        }],
      }
    });
  }

  //GetList
  getListData = () => {
    this.setState({ loading: true });
    fetch(
      `${HOST2}/api/v1/orders/search?status=${encodeURIComponent(
        parseInt(this.state.value)
      )}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.meta.Code === 200) {
          if (this.state.value === 0) {
            this.setState(
              {
                lengWaitting: data.data.length,
                loading: false,
                listData: data.data,
              },
              () => {
                this.PaginationPage(this.state.activePage);
              }
            );
          } else if (this.state.value === 1) {
            this.setState(
              {
                lengDelay: data.data.length,
                loading: false,
                listData: data.data,
              },
              () => {
                this.PaginationPage(this.state.activePage);
              }
            );
          } else if (this.state.value === 2) {
            this.setState(
              {
                lengShipping: data.data.length,
                loading: false,
                listData: data.data,
              },
              () => {
                this.PaginationPage(this.state.activePage);
              }
            );
          }
        }
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  };

  getAllStatus = () => {
    this.setState({ loading: true });
    for (let index = 0; index <= 2; index++) {
      fetch(
        `${HOST2}/api/v1/orders/search?status=${encodeURIComponent(
          parseInt(index)
        )}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          if (data.meta.Code === 200) {
            if (index === 0) {
              this.setState(
                {
                  lengWaitting: data.data.length,
                  loading: false,
                  listData: data.data,
                },
                () => {
                  this.PaginationPage(this.state.activePage);
                }
              );
            } else if (index === 1) {
              this.setState({
                lengDelay: data.data.length,
                loading: false,
                listData: data.data,
              });
            } else {
              this.setState({
                lengShipping: data.data.length,
                loading: false,
                listData: data.data,
              });
            }
          }
        }).catch((error) => {
          this.setState({
            loading: false,
          });
        });
    }
  };

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
  

  render() {
    const { classes } = this.props;
    const { chartOptionsLine,chartOptionsColumn } = this.state;
    return (
      <div>
        <div className="row">
          <div className="col-xl-8">
            {/*begin:: Widgets/Tasks */}
            <div className="m-portlet m-portlet--full-height ">
              <div className="m-portlet__head">
                <div className="m-portlet__head-caption">
                  <div className="m-portlet__head-title">
                    <h3 className="m-portlet__head-text">
                      Orders need to process
                    </h3>
                  </div>
                </div>
              </div>
              <div className="m-portlet__body">
                <ul className="nav nav-tabs" role="tablist">
                  <li
                    className="nav-item"
                    onClick={() => {
                      this.setState(
                        {
                          value: 0,
                        },
                        () => {
                          this.getListData();
                        }
                      );
                    }}
                  >
                    <a
                      className="nav-link active"
                      data-toggle="tab"
                      href="#"
                      data-target="#m_tabs_1_1"
                    >
                      Waitting{' '}
                      <span className="m-badge m-badge--secondary m-badge--wide p-0">
                        {this.state.lengWaitting}
                      </span>
                    </a>
                  </li>
                  <li
                    className="nav-item"
                    onClick={() => {
                      this.setState(
                        {
                          value: 2,
                        },
                        () => {
                          this.getListData();
                        }
                      );
                    }}
                  >
                    <a
                      className="nav-link"
                      data-toggle="tab"
                      href="#m_tabs_1_2"
                    >
                      Shipping{' '}
                      <span className="m-badge m-badge--warning m-badge--wide p-0">
                        {this.state.lengShipping}
                      </span>
                    </a>
                  </li>
                  <li
                    className="nav-item"
                    onClick={() => {
                      this.setState(
                        {
                          value: 1,
                        },
                        () => {
                          this.getListData();
                        }
                      );
                    }}
                  >
                    <a
                      className="nav-link"
                      data-toggle="tab"
                      href="#m_tabs_1_3"
                    >
                      Delay{' '}
                      <span className="m-badge m-badge--danger m-badge--wide p-0">
                        {this.state.lengDelay}
                      </span>
                    </a>
                  </li>
                </ul>
                <div className="tab-content">
                  <div
                    className="tab-pane active"
                    id="m_tabs_1_1"
                    role="tabpanel"
                  >
                    <Table bordered hover>
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Order Number</th>
                          <th>Name</th>
                          <th>Address 1</th>
                          <th>Country</th>
                          <th>Shipping Time</th>
                          <th>Created Time</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.crrData.map((value, index) => {
                          var Status = '';
                          if (value.status === 0) {
                            Status = (
                              <Chip
                                label="Waitting"
                                className={classes.bg_processing}
                              />
                            );
                          } else if (value.status === 2) {
                            Status = (
                              <Chip
                                label="Shipping"
                                className={classes.bg_shipping}
                              />
                            );
                          } else if (value.status === 3) {
                            Status = (
                              <Chip
                                label="Completed"
                                className={classes.bg_completed}
                              />
                            );
                          } else if (value.status === 1) {
                            Status = (
                              <Chip
                                label="Delay"
                                className={classes.bg_delay}
                              />
                            );
                          }
                          return (
                            <tr key={index}>
                              <td>{index + this.state.offset + 1}</td>
                              <td>{value.orderNumber}</td>
                              <td>{value.name}</td>
                              <td>{value.address1}</td>
                              <td>{value.country}</td>
                              <td style={{ whiteSpace: 'nowrap' }}>
                                {value.beginShipping !== undefined &&
                                  Moment(value.beginShipping).format(
                                    'DD-MM-YYYY'
                                  )}
                                {value.timeCompleted !== undefined &&
                                  ' -> ' +
                                    Moment(value.timeCompleted).format(
                                      'DD-MM-YYYY'
                                    )}
                              </td>
                              <td>
                                {Moment(value.created_at).format('DD-MM-YYYY')}
                              </td>
                              <td>{Status}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                  <div className="tab-pane" id="m_tabs_1_2" role="tabpanel">
                    <Table bordered hover>
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Order Number</th>
                          <th>Name</th>
                          <th>Address 1</th>
                          <th>Country</th>
                          <th>Shipping Time</th>
                          <th>Created Time</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.crrData.map((value, index) => {
                          var Status = '';
                          if (value.status === 0) {
                            Status = (
                              <Chip
                                label="Waitting"
                                className={classes.bg_processing}
                              />
                            );
                          } else if (value.status === 2) {
                            Status = (
                              <Chip
                                label="Shipping"
                                className={classes.bg_shipping}
                              />
                            );
                          } else if (value.status === 3) {
                            Status = (
                              <Chip
                                label="Completed"
                                className={classes.bg_completed}
                              />
                            );
                          } else if (value.status === 1) {
                            Status = (
                              <Chip
                                label="Delay"
                                className={classes.bg_delay}
                              />
                            );
                          }
                          return (
                            <tr key={index}>
                              <td>{index + this.state.offset + 1}</td>
                              <td>{value.orderNumber}</td>
                              <td>{value.name}</td>
                              <td>{value.address1}</td>
                              <td>{value.country}</td>
                              <td style={{ whiteSpace: 'nowrap' }}>
                                {value.beginShipping !== undefined &&
                                  Moment(value.beginShipping).format(
                                    'DD-MM-YYYY'
                                  )}
                                {value.timeCompleted !== undefined &&
                                  ' -> ' +
                                    Moment(value.timeCompleted).format(
                                      'DD-MM-YYYY'
                                    )}
                              </td>
                              <td>
                                {Moment(value.created_at).format('DD-MM-YYYY')}
                              </td>
                              <td>{Status}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                  <div className="tab-pane" id="m_tabs_1_3" role="tabpanel">
                    <Table bordered hover>
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Order Number</th>
                          <th>Name</th>
                          <th>Address 1</th>
                          <th>Country</th>
                          <th>Shipping Time</th>
                          <th>Created Time</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.crrData.map((value, index) => {
                          var Status = '';
                          if (value.status === 0) {
                            Status = (
                              <Chip
                                label="Waitting"
                                className={classes.bg_processing}
                              />
                            );
                          } else if (value.status === 2) {
                            Status = (
                              <Chip
                                label="Shipping"
                                className={classes.bg_shipping}
                              />
                            );
                          } else if (value.status === 3) {
                            Status = (
                              <Chip
                                label="Completed"
                                className={classes.bg_completed}
                              />
                            );
                          } else if (value.status === 1) {
                            Status = (
                              <Chip
                                label="Delay"
                                className={classes.bg_delay}
                              />
                            );
                          }
                          return (
                            <tr key={index}>
                              <td>{index + this.state.offset + 1}</td>
                              <td>{value.orderNumber}</td>
                              <td>{value.name}</td>
                              <td>{value.address1}</td>
                              <td>{value.country}</td>
                              <td style={{ whiteSpace: 'nowrap' }}>
                                {value.beginShipping !== undefined &&
                                  Moment(value.beginShipping).format(
                                    'DD-MM-YYYY'
                                  )}
                                {value.timeCompleted !== undefined &&
                                  ' -> ' +
                                    Moment(value.timeCompleted).format(
                                      'DD-MM-YYYY'
                                    )}
                              </td>
                              <td>
                                {Moment(value.created_at).format('DD-MM-YYYY')}
                              </td>
                              <td>{Status}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                </div>
                <div className="pt-2 mb-4 pr-0 col-md-12">
                  <Pagination
                    activePage={this.state.activePage}
                    itemsCountPerPage={this.itemsPerPage}
                    totalItemsCount={this.state.totalItem}
                    pageRangeDisplayed={5}
                    onChange={this.handlePageChange}
                  />
                </div>
              </div>
            </div>
            {/*end:: Widgets/Tasks */}
          </div>
          <div className="col-xl-4">
            {/*begin:: Widgets/Support Tickets */}
            <div className="m-portlet m-portlet--full-height ">
              <div className="m-portlet__head">
                <div className="m-portlet__head-caption">
                  <div className="m-portlet__head-title">
                    <h3 className="m-portlet__head-text">Column</h3>
                  </div>
                </div>
              </div>
              <div className="m-portlet__body">
                <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptionsColumn}
                />
              </div>
            </div>
            {/*end:: Widgets/Support Tickets */}
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12">
            {/*begin:: Widgets/Tasks */}
            <div className="m-portlet m-portlet--full-height ">
              <div className="m-portlet__head">
                <div className="m-portlet__head-caption">
                  <div className="m-portlet__head-title">
                    <h3 className="m-portlet__head-text">Order statistics</h3>
                  </div>
                </div>
                <div className="m-portlet__head-tools">
                  <ul
                    className="nav nav-pills nav-pills--brand m-nav-pills--align-right m-nav-pills--btn-pill m-nav-pills--btn-sm"
                    role="tablist"
                  >
                    <li className="nav-item m-tabs__item">
                      <a
                        className="nav-link m-tabs__link active"
                        data-toggle="tab"
                        href="#m_widget2_tab1_content"
                        role="tab"
                      >
                        Today
                      </a>
                    </li>
                    <li className="nav-item m-tabs__item">
                      <a
                        className="nav-link m-tabs__link"
                        data-toggle="tab"
                        href="#m_widget2_tab2_content1"
                        role="tab"
                      >
                        Week
                      </a>
                    </li>
                    <li className="nav-item m-tabs__item">
                      <a
                        className="nav-link m-tabs__link"
                        data-toggle="tab"
                        href="#m_widget2_tab3_content1"
                        role="tab"
                      >
                        Month
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="m-portlet__body">
                <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptionsLine}
                />
              </div>
            </div>
            {/*end:: Widgets/Tasks */}
          </div>
        </div>
        <div className="row">
          <div className="col-xl-4">
            {/*begin:: Widgets/Tasks */}
            <div className="m-portlet m-portlet--full-height ">
              <div className="m-portlet__head">
                <div className="m-portlet__head-caption">
                  <div className="m-portlet__head-title">
                    <h3 className="m-portlet__head-text">Country</h3>
                  </div>
                </div>
              </div>
              <div className="m-portlet__body">
                <Chart
                  options={this.state.options}
                  series={this.state.series}
                  type="pie"
                  width="100%"
                />
              </div>
            </div>
            {/*end:: Widgets/Tasks */}
          </div>
          <div className="col-xl-4">
            {/*begin:: Widgets/Support Tickets */}
            <div className="m-portlet m-portlet--full-height ">
              <div className="m-portlet__head">
                <div className="m-portlet__head-caption">
                  <div className="m-portlet__head-title">
                    <h3 className="m-portlet__head-text">Branch Sell</h3>
                  </div>
                </div>
              </div>
              <div className="m-portlet__body">
                <Chart
                  options={this.state.options}
                  series={this.state.series}
                  type="pie"
                  width="100%"
                />
              </div>
            </div>
            {/*end:: Widgets/Support Tickets */}
          </div>
          <div className="col-xl-4">
            {/*begin:: Widgets/Support Tickets */}
            <div className="m-portlet m-portlet--full-height ">
              <div className="m-portlet__head">
                <div className="m-portlet__head-caption">
                  <div className="m-portlet__head-title">
                    <h3 className="m-portlet__head-text">Type Product</h3>
                  </div>
                </div>
              </div>
              <div className="m-portlet__body">
                <Chart
                  options={this.state.options}
                  series={this.state.series}
                  type="pie"
                  width="100%"
                />
              </div>
            </div>
            {/*end:: Widgets/Support Tickets */}
          </div>
        </div>
        <Backdrop className={classes.backdrop} open={this.state.loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
  }
}

export default withStyles(useStyles)(BranchSell);
