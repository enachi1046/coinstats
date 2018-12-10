import Parse from 'parse';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { Helmet } from 'react-helmet';
import {
  portfolios as portfoliosActions,
  transactions as transactionsActions,
} from 'store/actions';
import { numberFormat, formatDate } from 'utils/formating';
import SignInText from 'components/SignInText';
import MiniLoader from 'addons/MiniLoader';
import AddCoin from 'pages/Portfolios/components/AddCoin';
import { isClient } from 'utils/env/index';

class Holdings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      edit: 'edit',
      thisTransaction: {},
    };
    this.toggle = this.toggle.bind(this);
    this.deleteTransaction = this.deleteTransaction.bind(this);
    this.addRemoveFavorite = this.addRemoveFavorite.bind(this);
  }

  componentDidMount() {
    if (isClient()) {
      const href = window.location.href.split('/');
      const tab = href[href.length - 1];
      if (tab === 'holdings') {
        this.props.onTitleChange(
          `${this.props.coin.name} (${
            this.props.coin.symbol
          }/USD) Price, Market cap | Holdings | Coin Stats`,
        );
        this.props.onDescriptionChange(
          `Find ${
            this.props.coin.name
          } latest price changes and data. Check your holdings. Coin Stats provides all the needed information. Look up cryptocurrency live prices and updates...`,
        );
        this.props.onKeyWordsChange(
          `${this.props.coin.name} price, ${
            this.props.coin.symbol
          } exchange rate, ${this.props.coin.symbol} investing, buy ${
            this.props.coin.symbol
          }, ${this.props.coin.symbol} price usd, ${
            this.props.coin.symbol
          } usd chart, ${this.props.coin.symbol} price, ${
            this.props.coin.symbol
          } to usd, ${this.props.coin.name.toLowerCase()}, cryptocurrency, crypto coin, ${this.props.coin.name.toLowerCase()} chart, ${
            this.props.coin.symbol
          } chart, ${this.props.coin.symbol} market cap, ${
            this.props.coin.symbol
          } market chart`,
        );
      }
    }
  }

  toggle(edit, transaction) {
    this.setState({
      modal: !this.state.modal,
      edit,
      thisTransaction: transaction,
    });
  }

  deleteTransaction() {
    return this.props
      .deleteTransaction(this.state.thisTransaction.identifier)
      .then(() => {
        this.setState({
          modal: !this.state.modal,
        });
      });
  }

  addRemoveFavorite(addOrRemove, id) {
    const favoritesJsonArray = [
      {
        coinId: id,
        state: 0,
      },
    ];
    if (addOrRemove === 'remove') {
      favoritesJsonArray[0].state = 2;
    }

    Parse.Cloud.run('syncFavorites', {
      UUID: 'a',
      favoritesJsonArray,
      shouldReturnData: true,
    }).then(
      (response) => {
        this.props.loadFavorites();
      },
      (error) => {
        console.error(error);
      },
    );
  }

  modalContent() {
    const edit = this.state.edit;
    const transaction = this.state.thisTransaction;
    let header = 'Are you sure to delete';
    let footer = (
      <div className="text-right">
        <Button
          className="btn btn-rounded btn-outline-danger"
          onClick={this.deleteTransaction}
        >
          Yes
        </Button>
        <Button
          className="btn btn-rounded btn-outline-secondary ml-1"
          onClick={() => this.toggle('')}
        >
          Cancel
        </Button>
      </div>
    );
    let body = <div />;
    if (edit === 'edit') {
      header = 'Edit Transaction';
      footer = '';
      body = (
        <AddCoin
          globalPortfId={transaction.portfolioId}
          globalPortfTransactions={this.state.globalPortfTransactions}
          globalPortfType={this.state.globalPortfType}
          allPortfolios={this.props.portfolios}
          editTransaction={this.state.thisTransaction}
          onTransactionSaved={() => this.toggle('')}
        />
      );
    }
    return [
      <ModalHeader toggle={this.toggle} key="1">
        {header}
      </ModalHeader>,
      <ModalBody key="2">{body}</ModalBody>,
      <ModalFooter key="3">{footer}</ModalFooter>,
    ];
  }

  renderTransactionRow(transaction, altfolioType) {
    const { coin } = this.props;

    let priceInMainPair =
      transaction.purchasePricesJson[
        transaction.mainCurrency || this.props.globalMainPair.symbol
      ];
    if (!priceInMainPair) {
      priceInMainPair = transaction.currentPrice;
    }
    const editBtn = (
      <span
        className="cursor-pointer edit-portfolio"
        onClick={() => this.toggle('edit', transaction)}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 15C0 6.71573 6.71582 0 15 0C23.2842 0 30 6.71573 30 15C30 23.2843 23.2842 30 15 30C6.71582 30 0 23.2843 0 15ZM16.5874 10.6198L8.09521 19.1124C8.07031 19.1371 8.0498 19.1655 8.03442 19.1962C8.01196 19.2408 8 19.2905 8 19.3416V22.0954C8 22.2749 8.14551 22.42 8.32471 22.42H11.0789C11.1206 22.42 11.1616 22.412 11.1997 22.3968C11.24 22.3806 11.2771 22.3564 11.3083 22.3249L19.8005 13.8326L16.5874 10.6198ZM19.5713 8.09509L22.3252 10.8493C22.4006 10.9247 22.4312 11.0277 22.417 11.1255C22.4075 11.1924 22.3767 11.2568 22.3252 11.3082L20.2598 13.3736L17.0466 10.1608L19.1125 8.09509C19.1731 8.03409 19.2554 8 19.3418 8C19.4282 8 19.5103 8.03409 19.5713 8.09509Z"
            fill="white"
            fillOpacity="0.5"
          />
        </svg>
      </span>
    );
    let TdEdit = (
      <td className="text-right holdings-transaction-actions">
        <div className="actions-div">
          {editBtn}
          {!altfolioType ? (
            <span
              className="cursor-pointer delete-portfolio"
              onClick={() => this.toggle('delete', transaction)}
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15 0C6.71582 0 0 6.71573 0 15C0 23.2843 6.71582 30 15 30C23.2842 30 30 23.2843 30 15C30 6.71573 23.2842 0 15 0ZM18.2517 10.197H20.6533C21.3164 10.197 21.854 10.7346 21.854 11.3977V12.5985C21.854 13.2616 21.3164 13.7993 20.6533 13.7993V19.803C20.6533 21.1294 19.5781 22.2045 18.2517 22.2045H12.248C10.9219 22.2045 9.84644 21.1294 9.84644 19.803V13.7993C9.18335 13.7993 8.64575 13.2616 8.64575 12.5985V11.3977C8.64575 10.7346 9.18335 10.197 9.84644 10.197H12.248V8.99622C12.248 8.3331 12.7856 7.79547 13.4487 7.79547H17.051C17.7141 7.79547 18.2517 8.3331 18.2517 8.99622V10.197ZM18.2517 19.2026C18.2517 19.5342 17.9829 19.803 17.6514 19.803C17.3198 19.803 17.051 19.5342 17.051 19.2026V15.6004C17.051 15.2688 17.3198 15 17.6514 15C17.9829 15 18.2517 15.2688 18.2517 15.6004V19.2026ZM15.25 19.803C15.5815 19.803 15.8503 19.5342 15.8503 19.2026V15.6004C15.8503 15.2688 15.5815 15 15.25 15C14.9185 15 14.6497 15.2688 14.6497 15.6004V19.2026C14.6497 19.5342 14.9185 19.803 15.25 19.803ZM13.449 10.197H17.0513V8.99622H13.449V10.197ZM12.8484 19.803C13.1799 19.803 13.4487 19.5342 13.4487 19.2026V15.6004C13.4487 15.2688 13.1799 15 12.8484 15C12.5168 15 12.248 15.2688 12.248 15.6004V19.2026C12.248 19.5342 12.5168 19.803 12.8484 19.803Z"
                  fill="white"
                  fillOpacity="0.5"
                />
              </svg>
            </span>
          ) : (
            ''
          )}
        </div>
      </td>
    );
    if (altfolioType) {
      TdEdit = (
        <td className="text-right holdings-transaction-actions">
          <div className="actions-div">{editBtn}</div>
        </td>
      );
    }

    if (coin.fiat) {
      coin.iconUrl = `../../${coin.iconUrl}`;
    }

    let TdPrice = (
      <td className="text-right holdings-transaction-price">
        <span className="field-name">Price</span>
        {numberFormat(priceInMainPair)}{' '}
        {transaction.mainCurrency || this.props.globalMainPair.symbol}
      </td>
    );
    if (transaction.exchange) {
      TdPrice = (
        <td className="text-right holdings-transaction-price">
          <span className="field-name">Price</span>
          <small>
            {transaction.exchange} - {coin.symbol}/{transaction.mainCurrency ||
              this.props.globalMainPair.symbol}
          </small>
          <br />
          {numberFormat(priceInMainPair)}{' '}
          {transaction.mainCurrency || this.props.globalMainPair.symbol}
        </td>
      );
    }
    let profitLoss = 0;
    if (transaction.profitPercent) {
      profitLoss = transaction.profitPercent[transaction.mainCurrency];
      if (!profitLoss) {
        profitLoss = transaction.profitPercent.USD;
      }
    } else {
      profitLoss = transaction.purchasePricesJson[transaction.mainCurrency];
      if (!profitLoss) {
        profitLoss = transaction.purchasePricesJson.USD;
      }
    }
    return (
      <tr key={transaction.identifier}>
        <td className="holdings-transaction-name">
          {
            <img
              width="25px"
              className="image mr-2"
              alt={`${coin.name}, ${coin.symbol}`}
              src={coin.iconUrl}
            />
          }
          {coin.name}
        </td>
        <td className="holdings-transaction-date">
          {formatDate(transaction.addDate, 'DD/MM/Y, H:m:s')}
        </td>
        <td className="holdings-transaction-pair">
          <span className="field-name">Exchange - Pair</span>
          {transaction.exchange} - {coin.symbol}
          /
          {transaction.mainCurrency || this.props.globalMainPair.symbol}
          <br />
          {transaction.mainCurrency || this.props.globalMainPair.symbol}
          {numberFormat(priceInMainPair)}{' '}
        </td>
        <td
          className={`holdings-transaction-amount text-right ${
            transaction.count > 0 ? 'text-up' : 'text-down'
          }`}
        >
          <span className="field-name">Amount</span>
          {numberFormat(transaction.count)} {coin.symbol}
        </td>
        {TdPrice}
        <td className="holdings-transaction-total text-right">
          <span className="field-name">Total Worth</span>
          {numberFormat(transaction.count * priceInMainPair)}{' '}
          {transaction.mainCurrency}
        </td>
        <td className="holdings-transaction-type text-right">
          <span className="field-name">Type</span>
          Trade
        </td>
        <td
          className={`holdings-transaction-profit text-right ${
            profitLoss > 0 ? 'text-up' : 'text-down'
          }`}
        >
          <span className="field-name">Profit/Loss</span>
          {numberFormat(profitLoss)} %
        </td>
        <td className="holdings-transaction-note text-right">
          <span className="field-name">Notes</span>
          {transaction.note || '---'}
        </td>
        {TdEdit}
      </tr>
    );
  }

  loadMoreRow(coin, portfolio) {
    if (
      this.props.isFetchSingleCoinTransactionsLoading &&
      this.state.loadingPortfolio === portfolio.identifier
    ) {
      return (
        <tr>
          <td />
          <td />
          <td />
          <td>
            <MiniLoader />
          </td>
          <td />
          <td />
          <td />
        </tr>
      );
    } else if (portfolio.hasMoreTransactions) {
      return (
        <tr>
          <td
            style={{ color: '#fea856', textAlign: 'center' }}
            className="cursor-pointer text-center justify-content-center"
            colSpan="8"
            onClick={() => {
              this.setState({ loadingPortfolio: portfolio.identifier });
              this.props.loadAllForCurrentTransaction(
                coin.id,
                portfolio.identifier,
                portfolio.transactions.length,
                100,
              );
            }}
          >
            Load More Transactions
          </td>
        </tr>
      );
    }
    return '';
  }

  render() {
    if (!this.props.user) {
      return <SignInText />;
    }
    if (this.props.isFetchSingleCoinTransactionsLoading) {
      return (
        <MiniLoader
          style={{ width: '100%', margin: '20px auto', height: '50px' }}
        />
      );
    }

    const { coin, currentCoinTransactions } = this.props;

    let tableHead = (
      <thead className="holding-table-main-head">
        <tr>
          <td colSpan="8" className="text-center">
            You have no {coin.name} holdings...
          </td>
        </tr>
      </thead>
    );
    let tableBody;
    if (currentCoinTransactions && currentCoinTransactions.portfolios.length) {
      tableHead = (
        <thead className="holding-table-main-head">
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th className="text-right">Amount</th>
            <th className="text-right">Price</th>
            <th className="text-right">Total</th>
            <th className="text-right">Profit/Loss</th>
            <th className="text-right">Notes</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
      );
      tableBody = currentCoinTransactions.portfolios.map((portfolio) => {
        return [
          <thead
            className="holding-table-portfolio-head"
            key={`th${portfolio.name}`}
          >
            <tr>
              <td colSpan="8" style={{ height: '10px', padding: 0 }} />
            </tr>
            <tr>
              <th colSpan="8">
                <span className="holdings-portfolio-name">Portfolio Name</span>
                {portfolio.name}
              </th>
            </tr>
          </thead>,
          <tbody key={`td${portfolio.name}`}>
            {portfolio.transactions.map((transaction) => {
              return this.renderTransactionRow(
                transaction,
                portfolio.altfolioType,
              );
            })}
            {this.loadMoreRow(coin, portfolio)}
          </tbody>,
        ];
      });
    }

    return [
      <Table className="holdings-table">
        {tableHead}
        {tableBody}
      </Table>,
      <Modal
        isOpen={this.state.modal}
        toggle={this.toggle}
        className={this.props.className}
      >
        {this.modalContent()}
      </Modal>,
    ];
  }
}

function mapStateToProps(state) {
  return {
    isFetchSingleCoinTransactionsLoading: state.coins.isLoading.fetchSingleCoin,
    currentCoinTransactions: state.coins.currentCoinTransactions,
    globalMainPair: state.coins.globalMainPair,
    user: state.auth.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadAllForCurrentTransaction(coin, portfolio, skip, limit) {
      return dispatch(
        portfoliosActions.loadAllForCurrentTransaction(
          coin,
          portfolio,
          skip,
          limit,
        ),
      );
    },
    deleteTransaction(id) {
      return dispatch(transactionsActions.deleteTransaction(id));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(Holdings));
