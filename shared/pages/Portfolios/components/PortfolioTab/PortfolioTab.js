import React, { Component } from 'react';
import { connect } from 'react-redux';
import { numberFormat } from 'utils/formating';
import { Table } from 'reactstrap';
import { portfolios as portfoliosActions } from 'store/actions';
import { Row, Col, Button, Modal, ModalHeader, ModalFooter } from 'reactstrap';

import storage from 'utils/storage';
import { differenceInDays } from 'utils/formating';

import PortfolioCoin from '../PortfolioCoin';
import PortfolioTypes from '../PortfolioTypes';
import ImgReload from '../TopBar/assets/reload.svg';
import Top from './components/Top';

const timeIntervalObj = [
  { key: 'Today', value: '24h' },
  { key: '1W', value: '1week' },
  { key: '1M', value: '1month' },
  { key: '3M', value: '3months' },
  { key: '6M', value: '6months' },
  { key: '1Y', value: '1year' },
  { key: 'All', value: 'all' },
];

let interval = null;

class PortfolioTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theadArr: [
        {
          key: 'name',
          value: 'Name',
        },
        {
          key: 'count',
          value: 'Count',
        },
        {
          key: 'price',
          value: 'Price',
        },
        {
          key: 'total',
          value: 'Total',
          className: 'text-right',
        },
        {
          key: 'profit',
          value: 'Profit/Loss',
          className: 'text-right',
        },
      ],
      orderKey: 'total',
      orderDir: 'asc',
      modal: false,
      edit: 'edit',
      alltimeProfit: true,
      timeInterval: '24h',
      updatedWallet: NaN,
      updatedExchange: NaN,
      isInTimeOut: false,
    };
    this.toggle = this.toggle.bind(this);
    this._onAddPortfolio = this._onAddPortfolio.bind(this);
  }

  toggle(edit) {
    this.setState({
      modal: !this.state.modal,
      edit,
    });
  }

  _onAddPortfolio(data) {
    return this.props.onAddPortfolio(data).then(({ error, payload }) => {
      this.toggle('edit');
    });
  }

  deletePortfolio() {
    const identifier = this.props.portfolio.identifier;
    return this.props.onDeletePortfolio(identifier);
  }

  changeProfitTime() {
    this.setState({
      alltimeProfit: !this.state.alltimeProfit,
    });
  }

  toggleTiming(id, value) {
    this.setState({
      shouldChartRender: true,
      timeInterval: value,
    });
    this.props.loadChart(id, value);
  }

  get orderedCoins() {
    const x = this.props.items.filter((c) => {
      return !c.hide;
    });
    const sortable = [];
    for (const coin in x) {
      sortable.push([coin, x[coin]]);
    }
    const orderKey = this.state.orderKey;
    if (orderKey === 'count') {
      return sortable.sort((a, b) => {
        let k = 0;
        if (a[1].count > b[1].count) {
          k = 1;
        }
        if (a[1].count < b[1].count) {
          k = -1;
        }
        if (this.state.orderDir === 'asc') {
          k = -k;
        }
        return k;
      });
    } else if (orderKey === 'total') {
      return sortable.sort((a, b) => {
        let k = 0;
        if (a[1].count * a[1].price.USD > b[1].count * b[1].price.USD) {
          k = 1;
        }
        if (a[1].count * a[1].price.USD < b[1].count * b[1].price.USD) {
          k = -1;
        }
        if (this.state.orderDir === 'asc') {
          k = -k;
        }
        return k;
      });
    } else if (orderKey === 'profit') {
      return sortable.sort((a, b) => {
        let k = 0;
        if (
          (a[1][orderKey][this.props.globalMainPair] || a[1][orderKey].USD) >
          (b[1][orderKey][this.props.globalMainPair] || b[1][orderKey].USD)
        ) {
          k = 1;
        }
        if (
          (a[1][orderKey][this.props.globalMainPair] || a[1][orderKey].USD) <
          (b[1][orderKey][this.props.globalMainPair] || b[1][orderKey].USD)
        ) {
          k = -1;
        }
        if (this.state.orderDir === 'asc') {
          k = -k;
        }
        return k;
      });
    }
    return sortable.sort((a, b) => {
      let k = 0;
      if (a[1][orderKey] > b[1][orderKey]) {
        k = 1;
      }
      if (a[1][orderKey] < b[1][orderKey]) {
        k = -1;
      }
      if (this.state.orderDir === 'asc') {
        k = -k;
      }
      return k;
    });
  }

  modalContent() {
    let Spinner;
    if (this.props.isLoading) {
      Spinner = <i className="fa fa-spinner fa-spin mr-2" />;
    }
    const edit = this.state.edit;
    let header = 'Are you sure to delete';
    let footer = (
      <div className="text-right">
        <Button
          className="btn btn-rounded btn-outline-danger"
          onClick={this.deletePortfolio.bind(this)}
          disabled={this.props.isDeleteLoading}
        >
          {Spinner}
          Yes
        </Button>
        <Button
          className="btn btn-rounded btn-outline-secondary ml-1"
          onClick={() => this.toggle('')}
          disabled={this.props.isDeleteLoading}
        >
          Cancel
        </Button>
      </div>
    );
    let body = <div />;
    if (edit === 'edit') {
      header = 'Edit Portfolio';
      footer = '';
      body = (
        <PortfolioTypes
          editPortfolio={this.props.portfolio}
          onAddPortfolio={this._onAddPortfolio}
        />
      );
    }
    return [
      <ModalHeader toggle={this.toggle} key="1">
        {header}
      </ModalHeader>,
      <div key="2">{body}</div>,
      <ModalFooter key="3">{footer}</ModalFooter>,
    ];
  }

  orderChange(x) {
    if (this.state.orderKey === x) {
      if (this.state.orderDir === 'desc') {
        this.setState({
          orderDir: 'asc',
        });
      } else {
        this.setState({
          orderDir: 'desc',
        });
      }
    } else {
      this.setState({
        orderKey: x,
        orderDir: 'asc',
      });
    }
  }

  componentDidMount() {
    if (this.props.portfolio.identifier) {
      let timeDiff = new Date().getTime() - new Date(this.props.portfolio.fetchDate);
      let diffDays = timeDiff / (1000 * 3600 * 24);
      if (diffDays > 1 &&
        this.props.portfolio.altfolioType === 2) {
        this.props.updateWallet(this.props.portfolio.identifier);
      }
      timeDiff = new Date().getTime() - new Date(this.props.portfolio.fetchDate);
      diffDays = timeDiff / (1000 * 3600 * 24);
      if (diffDays > 1 &&
        this.props.portfolio.altfolioType === 1) {
        this.props.updateExchange(this.props.portfolio.identifier);
      }
    }
  }

  getDate(isUpdated, date) {
    if (differenceInDays(isUpdated)) {
      return differenceInDays(isUpdated);
    } else if (differenceInDays(date)) {
      return differenceInDays(date);
    } else {
      return 'Syncing';
    }
  }

  loadAgain() {
    if (!this.state.isInTimeOut) {
      this.setState({ isInTimeOut: true });
      interval = setInterval(() => {
        if (!this.props.isUpdateExchangeLoading) {
          this.props.loadPortfolio(this.props.portfolio.identifier).then((data) => {
            this.setState({
              updatedExchange: data.payload.fetchDate.iso,
            });
          });
        }
      }, 3 * 1000);
    }
    return (
      <div>
        <div
          style={
            {
              backgroundColor: '#F49132',
              height: '5px',
              width: `calc(100% * ${this.props.portfolio.progress})`,
              transition: 'width 2s',
            }
          }
        />
        <div style={{ color: '#F49132' }}>Syncing {this.props.portfolio.progress.toFixed(2) * 100} %</div>
      </div>
    );
  }

  clearSetInterval() {
    if (this.state.isInTimeOut) {
      clearInterval(interval);
      this.setState({ isInTimeOut: false });
    }
  }

  render() {
    let reloadIconClasses = 'fa-spin';
    if (!this.props.isPortfoliosLoading) {
      reloadIconClasses = '';
    }
    const globalMainPair = this.props.globalMainPair;
    let exchangeReloadIconClasses = 'fa-spin';
    if (!this.props.isUpdateExchangeLoading) {
      exchangeReloadIconClasses = '';
    }
    let walletReloadIconClasses = 'fa-spin';
    if (!this.props.isUpdateWalletLoading) {
      walletReloadIconClasses = '';
    }
    const { portfolio } = this.props;
    const activeClass = {};
    const orderKeyClass = this.state.orderKey;
    if (this.state.orderDir === 'asc') {
      activeClass[orderKeyClass] = 'order_class_asc';
    } else {
      activeClass[orderKeyClass] = 'order_class_desc';
    }

    let price = portfolio.price[globalMainPair.symbol];
    if (!price) {
      price = portfolio.price.USD / globalMainPair.usdValue;
    }
    if (!price) {
      price = 0;
    }

    let profit = portfolio.profit[globalMainPair.symbol];
    if (!profit) {
      profit = portfolio.profit.USD / globalMainPair.usdValue;
    }
    if (!profit) {
      profit = 0;
    }

    let profitPercent =
      portfolio.profitPercent[globalMainPair.symbol] ||
      portfolio.profitPercent[globalMainPair.id];
    if (!profitPercent) {
      profitPercent = portfolio.profitPercent.USD;
    }

    let alltimeProfitText = 'All Time';
    if (!this.state.alltimeProfit) {
      alltimeProfitText = '24 Hour';
      if (this.props.lineChartData && this.props.lineChartData[0]) {
        profit =
          price - this.props.lineChartData[0][1] / globalMainPair.usdValue;
        profitPercent =
          (100 * price) /
          (this.props.lineChartData[0][1] / globalMainPair.usdValue) -
          100;
      }
    }

    let showChartText = 'Show Chart';
    if (this.props.showChartText) {
      showChartText = 'Hide Chart';
    }

    const button1 = (
      <Button
        className="ml-2 small-btns"
        onClick={this.changeProfitTime.bind(this)}
        size="sm"
      >
        {alltimeProfitText}
      </Button>
    );
    const button2 = (
      <Button
        className="ml-2 small-btns"
        onClick={() => this.props.showChart()}
        size="sm"
      >
        {showChartText}
      </Button>
    );
    let profitLoss;
    if (profit < 0) {
      profitLoss = (
        <h2 className=" mr-3 text-danger">
          -{this.props.globalMainPair.sign}
          {numberFormat(-profit)}
          ({numberFormat(profitPercent)}%)
          <small>
            <i className="ti-angle-down text-danger" />
          </small>
          {button1}
          {button2}
        </h2>
      );
    } else {
      profitLoss = (
        <h2 className="mr-3 text-success">
          {this.props.globalMainPair.sign}
          {numberFormat(profit)}
          ({numberFormat(profitPercent)}%)
          <small>
            <i className="ti-angle-up text-success" />
          </small>
          {button1}
          {button2}
        </h2>
      );
    }

    let addButton;
    if (portfolio.altfolioType === 1) {
      addButton = (
        <div className="mb-4">
          <h5 className="">
            <div className="mt-1 float-left">Sync exchange &nbsp;</div>
            <img
              className={`${exchangeReloadIconClasses} cursor-pointer`}
              src={ImgReload}
              height="25px"
              width="25px"
              onClick={() => {
                this.props
                  .updateExchange(this.props.portfolio.identifier)
                  .then((data) => {
                    this.setState({
                      updatedExchange: data.payload.response.fetchDate.iso,
                    });
                  });
              }}
            />
          </h5>
          Last Update:{' '}
          {this.getDate(
            this.state.updatedExchange,
            this.props.portfolio.fetchDate,
          )}
        </div>
      );
    } else if (portfolio.altfolioType === 0 && !portfolio.isSharedPortfolio) {
      addButton = (
        <div
          className="add-transaction-btn"
          onClick={this.props.addTransactionCallback}
        >
          Add Transaction
        </div>
      );
    } else if (portfolio.altfolioType === 2) {
      addButton = (
        <div className="mb-4">
          <h5 className="">
            <div className="mt-1 float-left">Sync wallet &nbsp;</div>
            <img
              className={`${walletReloadIconClasses} cursor-pointer`}
              src={ImgReload}
              height="25px"
              width="25px"
              onClick={() => {
                this.props
                  .updateWallet(this.props.portfolio.identifier)
                  .then((data) => {
                    this.setState({
                      updatedWallet: data.payload.response.fetchDate.iso,
                    });
                  });
              }}
            />
          </h5>
          Last Update:{' '}
          {this.getDate(
            this.state.updatedWallet,
            this.props.portfolio.fetchDate,
          )}
        </div>
      );
    }
    let editDeleteButtons = '';
    if (portfolio.identifier !== 'totalPortfolio') {
      editDeleteButtons = (
        <div className="float-right">
          <h4
            className=" cursor-pointer text-info d-inline-block underline"
            onClick={() => this.toggle('edit')}
            title="Edit Portfolio"
          >
            Edit
          </h4>
          <h4
            className=" cursor-pointer text-danger d-inline-block ml-2 underline"
            onClick={() => this.toggle('delete')}
            title="Delete Portfolio"
          >
            Delete
          </h4>
        </div>
      );
    }

    let chartDays = (
      <div>
        {timeIntervalObj.map((obj, ind) => {
          let activeClass = '';
          if (this.state.timeInterval === obj.value) {
            activeClass = 'active';
          }
          return (
            <div
              key={ind}
              onClick={() => this.toggleTiming(portfolio.identifier, obj.value)}
              className="chart-days"
            >
              <span className={`${activeClass} chart-days-span`}>
                {obj.key}
              </span>
            </div>
          );
        })}
      </div>
    );

    let empty = null;
    if (!this.props.showChartText) {
      chartDays = null;
    }
    if (!this.orderedCoins.length) {
      empty = (
        <tr>
          <td colSpan="5" className="text-center">
            <h1>Portfolio is empty</h1>
          </td>
        </tr>
      );
      chartDays = null;
    }
    return (
      <div>
        <Top
          price={price}
          ImgReload={ImgReload}
          reloadIconClasses={reloadIconClasses}
          profitLoss={profitLoss}
          addButton={addButton}
          chartDays={chartDays}
          orderedCoins={this.orderedCoins}
          globalMainPair={this.props.globalMainPair}
          loadPortfolios={this.props.loadPortfolios}
          showChartText={this.props.showChartText}
          portfolio={this.props.portfolio}
        />
        {this.props.portfolio.portfolioSyncState === 1 ? this.loadAgain() : this.clearSetInterval()}
        <Table>
          <thead>
            <tr>
              {this.state.theadArr.map((thead, ind) => (
                <th
                  key={ind}
                  className={`${ind === 0 ? 'pl-4' : ''}
                    ${ind === 4 ? 'pr-4' : ''}
                    ${ind > 0 ? 'right' : ''}
                    ${activeClass[thead.key]}
                    ${thead.className}
                    cursor-pointer`}
                  onClick={() => this.orderChange(thead.key)}
                >
                  {thead.value}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {empty}
            {this.orderedCoins.map((coin, ind) => (
              <PortfolioCoin
                key={ind}
                coin={coin[1]}
                onCoinClick={this.props.onCoinClick}
              />
            ))}
          </tbody>
        </Table>
        {editDeleteButtons}
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          {this.modalContent()}
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isPortfoliosLoading: state.coins.isLoading.fetchPortfolios,
    darkMode: state.ui.darkMode,
    portfolios: state.coins.portfolios,
    isUpdateExchangeLoading: state.coins.isLoading.updateExchange,
    isUpdateWalletLoading: state.coins.isLoading.updateWallet,
    showChartText: state.coins.showChart,
    lineChartData: state.coins.chartInfo,
    isChartLoading: state.coins.isLoading.fetchChart,
    globalMainPair: state.coins.globalMainPair,
    hideSmallAssets: state.coins.hideSmallAssets,
    hideUnidentified: state.coins.hideUnidentified,
    isDeleteLoading: state.coins.isLoading.deletePortfolio,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadPortfolios() {
      return dispatch(portfoliosActions.loadPortfolios());
    },
    updateWallet(params) {
      return dispatch(portfoliosActions.updateWallet(params));
    },
    loadPortfolio(params) {
      return dispatch(portfoliosActions.loadPortfolio(params));
    },
    updateExchange(params) {
      return dispatch(portfoliosActions.updateExchange(params));
    },
    showChart() {
      return dispatch(portfoliosActions.showChart());
    },
    loadChart(id, type) {
      return dispatch(portfoliosActions.loadChart(id, type));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PortfolioTab);
