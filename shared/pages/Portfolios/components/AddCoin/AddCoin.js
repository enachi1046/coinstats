import React, { Component } from 'react';
import Parse from 'parse';
import DateTime from 'react-datetime';
import moment from 'moment';
import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  Row,
  Col,
  Form,
  FormGroup,
  Nav,
  NavItem,
  NavLink,
  Label,
} from 'reactstrap';

import VirtualizedSelect from 'react-virtualized-select';
import { connect } from 'react-redux';

import { transactions as transactionsActions } from 'store/actions';
import axios from 'axios';

class AddCoin extends Component {
  constructor(props) {
    super(props);
    let id = 0;
    let symbol = '';
    if (this.props.selected) {
      id = this.props.selected.id;
      symbol = this.props.selected.symbol;
    }
    const state = {
      price: '',
      count: '',
      globalPortfId: props.globalPortfId,
      startDate: moment(),
      selectId: id,
      selectSymbol: symbol,
      buy: 1,
      typeId: 0,
      deduct: false,
      showDeduct: true,
      exchangeTypeId: '',
      exchanges: {},
      globalPortfTransactions: props.globalPortfTransactions,
      selectedExchangeContent: {},
      exchangeVariantSymbol: '',
      fee: '',
      syncState: 0,
    };
    if (props.editTransaction) {
      const thisTransaction = props.editTransaction;
      state.syncState = 1;
      state.count = thisTransaction.count;
      if (thisTransaction.count < 0) {
        state.count *= -1;
        state.buy = 0;
      }
      state.fee = thisTransaction.fee;
      state.identifier = thisTransaction.identifier;
      state.selectId = thisTransaction.bitcoinIdentifier;
      state.selectSymbol = thisTransaction.bitcoinSymbol;
      state.price = thisTransaction.purchasePricesJson[thisTransaction.mainCurrency];
      state.showDeduct = false;
      if (thisTransaction.exchange) {
        if (thisTransaction.altfolioType === 0) {
          state.typeId = 1;
        }
        state.exchangeTypeId = thisTransaction.exchange;
        state.exchangeVariantSymbol = thisTransaction.mainCurrency;
      }
      if (props.editTransaction) {
        state.syncState = 1;
        if (props.exchange) {
          state.typeId = 1;
        }
      }
    }
    this.state = state;
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleCountChange = this.handleCountChange.bind(this);
    this.handleDeductChange = this.handleDeductChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleBuySell = this.handleBuySell.bind(this);
    this.selectValue = this.selectValue.bind(this);
    this.selectPortfolio = this.selectPortfolio.bind(this);
  }

  componentDidMount(props) {
    if (this.props.editTransaction && !this.state.exchanges.length && this.state.selectId) {
      this.selectValue({
        id: this.props.editTransaction.bitcoinIdentifier,
        symbol: this.props.editTransaction.bitcoinSymbol,
        price: this.props.editTransaction.purchasePricesJson[this.props.editTransaction.mainCurrency] || 0,
      }).then(() => {
        this.exchangeType({
          value: this.props.editTransaction.exchange,
        }, this.props.editTransaction.pairCoin);
      });
    }
  }

  handlePriceChange(event) {
    this.setState({ price: event.target.value });
  }

  handleFeeChange(event) {
    this.setState({ fee: event.target.value });
  }

  handleCountChange(event) {
    this.setState({ count: event.target.value });
  }

  handleBuySell(value) {
    let buy = 1;
    if (value === 'sell') {
      buy = 0;
    }
    this.setState({ buy });
  }

  handleDeductChange(event) {
    this.setState({
      deduct: event.target.checked,
    });
  }

  handleDateChange(date) {
    const symbol = this.state.selectSymbol;

    const seconds = parseInt(date._d.getTime() / 1000);
    const currency = 'USD';
    const link = 'https://min-api.cryptocompare.com/data/pricehistorical?fsym='
      + `${symbol}&tsyms=${currency}&ts=${seconds}`;
    axios
      .get(link)
      .then((response) => {
        if (response.data[symbol][currency] > 0) {
          this.setState({
            price: response.data[symbol][currency],
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
    this.setState({
      startDate: date,
    });
  }

  addTransactionFunc(e) {
    e.preventDefault();
    this.props.addTransaction(this.state, this.props.coinsById).then((response) => {
      if (!response.error) {
        this.props.onTransactionSaved();
      }
    });
  }

  selectValue(event) {
    if (event) {
      this.setState({
        selectId: event.id,
        selectSymbol: event.symbol,
      });
      const coin = this.props.coinsById[event.id];
      let getPrice = Parse.Promise.resolve({});
      if (!coin.fiat) {
        getPrice = Parse.Cloud.run('getExchangesListAndPricesForCoinV3', {
          coinIdentifier: event.id,
        });
      }
      return getPrice.then(
        (result) => {
          let price = this.props.coinsById[event.id].price;
          if (event.price) price = event.price;
          this.setState({
            price,
            exchanges: result,
          });
        },
        (error) => {
          console.error(error);
        },
      );
    }
    this.setState({
      selectId: 0,
      selectSymbol: '',
      exchanges: {},
      exchangeVariantSymbol: '',
      selectedExchangeContent: {},
      price: 0,
      fee: 0,
    });
  }

  selectPortfolio(event) {
    if (event) {
      this.setState({
        globalPortfId: event.value,
      });
    } else {
      this.setState({
        globalPortfId: '',
      });
    }
  }

  transactionTypeChange(typeId) {
    if (!this.isTransactionManual) {
      typeId = 0;
    }
    this.setState({
      typeId,
      exchanges: {},
      exchangeVariantSymbol: '',
      selectedExchangeContent: {},
      price: 0,
      fee: 0,
    });
  }

  exchangeType(event, selectedPair) {
    if (event) {
      const exchangeObj = this.state.exchanges;
      this.setState({
        selectedExchangeContent: {},
        fee: 0,
        exchangeTypeId: event.value,
      });
      let price = 0;
      for (const key in exchangeObj) {
        if (event.value === key) {
          if (!selectedPair) {
            selectedPair = exchangeObj[key][0].name;
            price = exchangeObj[key][0].price;
          }
          this.setState({
            selectedExchangeContent: exchangeObj[key],
            exchangeVariantSymbol: selectedPair,
            price,
          });
          break;
        }
      }
    } else {
      this.setState({
        selectedExchangeContent: {},
        price: 0,
        fee: 0,
        exchangeTypeId: '',
        exchangeVariantSymbol: '',
      });
    }
  }

  exchangeVariant(event) {
    this.setState({
      price: event.target.options[event.target.selectedIndex].getAttribute('price'),
      exchangeVariantSymbol: event.target.value,
    });
  }

  get isTransactionManual() {
    if (!this.props.editTransaction) {
      return true;
    }
    let returnValue = false;
    this.props.allPortfolios.map((portfolio) => {
      if (portfolio.identifier === this.props.editTransaction.portfolioId) {
        if (portfolio.altfolioType === 0) {
          returnValue = true;
        }
      }
    });
    return returnValue;
  }

  get advancedOptions() {
    let content = '';
    if (this.state.typeId === 1) {
      const selectedExchange = this.state.selectedExchangeContent;
      const exchangeTypeOptions = Object.keys(this.state.exchanges)
        .sort()
        .map((key, ind) => {
          return {
            label: <div key={ind}>{key}</div>,
            value: key,
          };
        });
      content = [
        <FormGroup key={1}>
          <Label for="exchangeType">Select Exchange (optional)</Label>
          <VirtualizedSelect
            id="exchangeType"
            options={exchangeTypeOptions}
            onChange={this.exchangeType.bind(this)}
            disabled={!this.isTransactionManual}
            value={this.state.exchangeTypeId}
            required
          />
        </FormGroup>,
        <FormGroup key={2}>
          <Label for="exchangeVariant">Select Pair (optional)</Label>
          <Input
            id="exchangeVariant"
            type="select"
            name="select"
            disabled={!this.isTransactionManual}
            value={this.state.exchangeVariantSymbol}
            onChange={this.exchangeVariant.bind(this)}
            required
          >
            {Object.keys(selectedExchange).map((key, ind) => {
              return (
                <option price={selectedExchange[key].price} key={ind} value={selectedExchange[key].name}>
                  {this.state.selectSymbol} / {selectedExchange[key].name}
                </option>
              );
            })}
          </Input>
        </FormGroup>,
      ];
    }
    return content;
  }

  get deduct() {
    let deduct = '';
    if (this.state.typeId === 1 && this.state.showDeduct) {
      let text = `Deduct from ${this.state.exchangeVariantSymbol} holdings`;
      if (!this.state.buy) {
        text = `Add to ${this.state.exchangeVariantSymbol} holdings`;
      }
      deduct = (
        <div key={3} check onChange={this.handleDeductChange} className="custom-control custom-checkbox">
          <input type="checkbox" className="custom-control-input" id="customCheck1" />
          <label check className="custom-control-label" htmlFor="customCheck1">{text}</label>
        </div>
      );
    }
    return deduct;
  }

  render() {
    let Spinner;
    if (this.props.isLoading) {
      Spinner = <i className="fa fa-spinner fa-spin mr-2" />;
    }
    const options = Object.values(this.props.coinsById)
      .filter(f => !f.fiat)
      .map((coin) => {
        return {
          label: (
            <div>
              <img className="image mr-1" width="20px" alt="" src={coin.iconUrl} />
              {coin.name} ({coin.symbol})
            </div>
          ),
          value: `${coin.id} ${coin.symbol}`,
          id: coin.id,
          symbol: coin.symbol,
        };
      });
    Object.values(this.props.coinsById)
      .filter(f => f.fiat)
      .map((coin) => {
        options.push({
          label: (
            <div>
              <img className="image mr-1" width="20px" alt="" src={coin.iconUrl} />
              {coin.name} ({coin.symbol})
            </div>
          ),
          value: `${coin.id} ${coin.symbol}`,
          id: coin.id,
          symbol: coin.symbol,
        });
      });
    const portfoliosOptions = this.props.allPortfolios
      .filter((c) => {
        return c.altfolioType === 0 && c.identifier !== 'totalPortfolio';
      })
      .map((portfolio) => {
        return {
          label: portfolio.name,
          value: portfolio.identifier,
        };
      });
    return (
      <div className="mt-3">
        <Nav tabs>
          <NavItem className="cursor-pointer active">
            <NavLink className={this.state.typeId === 0 ? 'active' : ''} onClick={() => this.transactionTypeChange(0)}>
              Simple
            </NavLink>
          </NavItem>
          <NavItem className="cursor-pointer">
            <NavLink
              className={this.state.typeId === 1 ? 'active' : ''}
              onClick={() => this.transactionTypeChange(1)}
              disabled={!this.isTransactionManual}
            >
              Advanced
            </NavLink>
          </NavItem>
        </Nav>
        <Form onSubmit={this.addTransactionFunc.bind(this)} className="mt-3">
          {portfoliosOptions.length > 0 ?
            (
              <FormGroup>
                <Label>Select Portfolio</Label>
                <VirtualizedSelect
                  type="select"
                  options={portfoliosOptions}
                  onChange={this.selectPortfolio}
                  value={this.state.globalPortfId}
                  disabled={!this.isTransactionManual}
                />
              </FormGroup>
            )
            : ''}
          <FormGroup>
            <Label>Select coin</Label>
            <VirtualizedSelect
              options={options}
              onChange={this.selectValue}
              value={`${this.state.selectId} ${this.state.selectSymbol}`}
              disabled={!this.isTransactionManual}
              required
            />
          </FormGroup>
          {this.advancedOptions}
          <FormGroup>
            <Row>
              <Col sm="8">
                <Label>Select date</Label>
                <DateTime
                  className="timepicker_width"
                  value={this.state.startDate}
                  onChange={this.handleDateChange}
                  readOnly={!this.isTransactionManual}
                />
              </Col>
              <Col sm="4">
                <Label>Fee (%)</Label>
                <Input
                  value={this.state.fee}
                  type="number"
                  min="0"
                  onChange={this.handleFeeChange.bind(this)}
                  readOnly={!this.isTransactionManual}
                />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col xs="6">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">Count</InputGroupAddon>
                  <Input
                    type="number"
                    step="any"
                    value={this.state.count}
                    min="0"
                    onChange={this.handleCountChange}
                    readOnly={!this.isTransactionManual}
                    required
                  />
                </InputGroup>
              </Col>
              <Col xs="6">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">Price</InputGroupAddon>
                  <Input
                    type="number"
                    step="any"
                    min="0"
                    onChange={this.handlePriceChange}
                    value={this.state.price}
                    required
                  />
                </InputGroup>
              </Col>
            </Row>
            <div className="m-top15">
              <FormGroup tag="fieldset">
                <FormGroup inline>
                  <div className="custom-control custom-radio custom-control-inline">
                    <input
                      id="buyTransaction"
                      className="custom-control-input"
                      type="radio"
                      name="buy"
                      checked={this.state.buy}
                      onChange={e => this.handleBuySell(e.target.value)}
                      readOnly={!this.isTransactionManual}
                    />
                    <label
                      className="custom-control-label"
                      forHtml="buyTransaction"
                      onClick={() => this.handleBuySell('buy')}
                    >
                      Buy
                    </label>
                  </div>
                  <div className="custom-control custom-radio custom-control-inline">
                    <input
                      id="sellTransaction"
                      className="custom-control-input"
                      type="radio"
                      name="buy"
                      value="sell"
                      checked={!this.state.buy}
                      onChange={e => this.handleBuySell(e.target.value)}
                      readOnly={!this.isTransactionManual}
                    />
                    <label
                      className="custom-control-label"
                      forHtml="sellTransaction"
                      onClick={() => this.handleBuySell('sell')}
                    >
                      Sell
                    </label>
                  </div>
                </FormGroup>
              </FormGroup>
              {this.deduct}
              <h4 className="m-top15 text-danger">{this.props.error}</h4>
            </div>
          </FormGroup>

          <FormGroup>
            <Button
              className="btn btn-success float-right cursor-pointer"
              type="submit"
              disabled={this.props.isLoading}
            >
              {Spinner}
              Save
            </Button>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.coins.isLoading.addTransaction,
    error: state.coins.errors.addTransaction,
    coinsById: state.coins.coinsById,
    allPortfolios: state.coins.portfolios,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addTransaction(params, coinsById) {
      return dispatch(transactionsActions.addTransaction(params, coinsById));
    },
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddCoin);
