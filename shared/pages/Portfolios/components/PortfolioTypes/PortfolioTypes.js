import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, ModalBody, ModalFooter, Input, Form, FormGroup, Label } from 'reactstrap';
import { portfolios as portfolioApi } from 'api';
import LoginWithCoinbase from 'shared/components/LoginWithCoinbase';

import Switch from 'addons/Switch';

class PortfolioType extends Component {
  constructor(props) {
    super(props);
    const state = {
      exchangeType: 3,
      typeId: 0,
      totalCost: '',
      name: '',
      orderUI: props.maxUi,
      isShowOnTotalDisabled: false,
      supportedWallets: [],
      walletTypeId: 0,
      walletAddr: '',
      supportedExchanges: [],
      exchangeAdditionalFields: {},
      totalCostCurrency: this.props.totalCostCurrency.symbol,
      edit: false,
      syncState: 0,
      simpleModal: false,
      hidePortfolioTypes: this.props.hidePortfolioTypes || false,
      coinbaseData: {},
      isTransactionOrdersEnabled: false,
    };
    if (props.portfolioType) {
      state.typeId = props.portfolioType;
      state.simpleModal = true;
    }
    if (props.editPortfolio) {
      const thisPortfolio = props.editPortfolio;
      state.typeId = thisPortfolio.altfolioType;
      state.syncState = 1;
      state.edit = true;
      if (state.typeId === 2) {
        state.walletAddr = thisPortfolio.walletAddress;
        state.walletTypeId = thisPortfolio.walletType;
      }

      state.name = thisPortfolio.name;
      state.portfolioItems = thisPortfolio.portfolioItems;
      state.orderUI = thisPortfolio.orderUI;
      state.isShowOnTotalDisabled = thisPortfolio.isShowOnTotalDisabled;
      state.totalCost = thisPortfolio.totalCost || '';
      state.identifier = thisPortfolio.identifier;
    }

    this.state = state;
    this.handleWalletTypeChange = this.handleWalletTypeChange.bind(this);
    this.handleWalletAddrChange = this.handleWalletAddrChange.bind(this);
    this._onExchangeTypeChange = this._onExchangeTypeChange.bind(this);
    this._onPortfolioTypeChange = this._onPortfolioTypeChange.bind(this);
  }

  componentDidMount() {
    if (!this.props.editPortfolio) {
      portfolioApi.loadSupportedExchanges().then((exchangeRes) => {
        portfolioApi.loadSupportedWallets().then((walletRes) => {
          this.setState({
            supportedExchanges: exchangeRes.data.exchanges,
            supportedWallets: walletRes.data.wallets,
          }, () => this._setExchange(0));
        });
      });
    } else if (this.props.editPortfolio.altfolioType === 1) {
      portfolioApi.loadSupportedExchanges().then((res) => {
        this.setState(
          {
            supportedExchanges: res.data.exchanges,
          },
          () => this._setExchange(0),
        );
      });
    } else if (this.props.editPortfolio.altfolioType === 2 || this.props.editPortfolio.altfolioType === 3) {
      portfolioApi.loadSupportedWallets().then((res) => {
        this.setState({ supportedWallets: res.data.wallets });
      });
    }
  }

  _onPortfolioTypeChange(event) {
    this.setState({
      hidePortfolioTypes: false,
      typeId: Number(event.target.value),
      exchangeType: 3,
      walletTypeId: 0,
      walletAddr: '',
    });
  }

  handleWalletTypeChange(event) {
    this.setState({
      walletTypeId: event.target.value,
    });
  }

  handleWalletAddrChange(event) {
    this.setState({
      walletAddr: event.target.value,
    });
  }

  _setExchange(ind, additionalFields = null) {
    const exchange = this.state.supportedExchanges[ind];
    let exchangeAdditionalFields = {};
    if (additionalFields) {
      exchangeAdditionalFields = additionalFields;
    } else if (this.props.editPortfolio) {
      (exchange.additionalFields || []).forEach((field) => {
        exchangeAdditionalFields[field.key] = this.props.editPortfolio.additionalInfo[field.key];
      });
    }

    if (exchange) {
      let isTransactionOrdersEnabled = exchange.isTransactionOrdersEnabled;
      if (this.props.editPortfolio) {
        isTransactionOrdersEnabled = this.props.editPortfolio.isTransactionOrdersEnabled;
      }
      this.setState({
        isTransactionOrdersEnabled,
        selectedExchange: exchange,
        exchangeType: exchange.type,
        exchangeAdditionalFields,
      });
    }
  }

  _onExchangeTypeChange(event) {
    let index = -1;
    this.state.supportedExchanges.forEach((exchange, ind) => {
      if (exchange.type === Number(event.target.value)) {
        index = ind;
      }
    });
    if (index >= 0) {
      this._setExchange(index);
    }
  }

  _onExchangeAdditionalFieldChange(event) {
    const exchangeAdditionalFields = Object.assign({}, this.state.exchangeAdditionalFields);
    exchangeAdditionalFields[event.target.name] = event.target.value;
    this.setState({ exchangeAdditionalFields });
  }

  _coinBaseOAuth({ data }) {
    this.setState({
      coinbaseData: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        requestDate: new Date(),
      },
    });
  }

  handleNameChange(e) {
    this.setState({
      name: e.target.value,
    });
  }

  handleTotalCost(e) {
    this.setState({
      totalCost: e.target.value,
    });
  }

  handleShowOnTotal() {
    this.setState({
      isShowOnTotalDisabled: !this.state.isShowOnTotalDisabled,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const params = this.state;
    return this.props.onAddPortfolio(params);
  }

  get isPortfolioManual() {
    if (!this.props.editPortfolio) {
      return true;
    }
    return false;
  }

  isTransactionOrdersEnabledChange() {
    this.setState({ isTransactionOrdersEnabled: !this.state.isTransactionOrdersEnabled });
  }

  get isSuported() {
    if (!this.state.selectedExchange) {
      return '';
    }
    if (this.state.selectedExchange.isTransactionOrdersEnabled) {
      return (
        <div style={{ marginTop: '20px', marginBottom: '0', display: 'flex' }}>
          <Switch
            className="float-left"
            on={this.state.isTransactionOrdersEnabled}
            onChange={this.isTransactionOrdersEnabledChange.bind(this)}
          />
          <span style={{ float: 'left', marginLeft: '15px' }}>
            With Transaction History
          </span>
        </div>
      );
    }
    return '';
  }

  get content() {
    let content = '';
    if (this.state.typeId === 1) {
      let additionalFields;
      if (this.state.selectedExchange) {
        if (this.state.selectedExchange.type === 10) {
          if (!this.state.coinbaseData.access_token) {
            additionalFields = <LoginWithCoinbase onAuth={this._coinBaseOAuth.bind(this)} />;
          } else {
            additionalFields = <div className="mt-3 text-center text-success">Successfully connected!</div>;
          }
        } else {
          additionalFields = this.state.selectedExchange.additionalFields.map((field) => {
            return (
              <div>
                <Label for={field.key} className="mt-3">
                  Please enter {field.name}
                </Label>
                {this.props.editPortfolio ? (
                  <Input
                    type="text"
                    value={this.state.exchangeAdditionalFields[field.key]}
                    name={field.key}
                  />
                ) :
                  (
                    <Input
                      type="text"
                      value={this.state.exchangeAdditionalFields[field.key]}
                      name={field.key}
                      onChange={this._onExchangeAdditionalFieldChange.bind(this)}
                    />
                  )}
              </div>
            );
          });
        }
      }
      content = (
        <div>
          <Label for="exchangeType">Please select Exchange type</Label>
          <Input
            type="select"
            name="select"
            id="exchangeType"
            value={(this.state.selectedExchange || {}).type}
            onChange={this._onExchangeTypeChange}
          >
            {this.state.supportedExchanges.map((exchange) => {
              return <option value={exchange.type}>{exchange.name}</option>;
            })}
          </Input>
          {this.isSuported}
          {additionalFields}
        </div>
      );
    } else if (this.state.typeId === 2) {
      content = (
        <div>
          <Label for="walletType">Please select Wallet type</Label>
          <Input
            id="walletType"
            type="select"
            name="select"
            value={this.state.walletTypeId}
            onChange={this.handleWalletTypeChange}
          >
            {this.state.supportedWallets.map((wallet, ind) => {
              return (
                <option value={wallet.type} key={`op${wallet.name}`}>
                  {wallet.name}
                </option>
              );
            })}
          </Input>
          <Label for="walletKey" className="m-t-15">
            Please enter Wallet address
          </Label>
          <Input type="text" id="walletKey" value={this.state.walletAddr} onChange={this.handleWalletAddrChange} />
        </div>
      );
    }
    return content;
  }

  render() {
    let Spinner;
    if (this.props.isLoading) {
      Spinner = <i className="fa fa-spinner fa-spin mr-2" />;
    }
    let nameInput = (
      <Input
        type="text"
        placeholder="Portfolio name"
        value={this.state.name}
        onChange={this.handleNameChange.bind(this)}
      />
    );
    let calculateOnTotal = (
      <FormGroup>
        <Label>
          <a
            className="waves-effect waves-dark m-r-10"
            href="javascript:;"
            onClick={this.handleShowOnTotal.bind(this)}
            aria-expanded="false"
          >
            <Switch
              className="float-right"
              on={!this.state.isShowOnTotalDisabled}
              onChange={this.handleShowOnTotal.bind(this)}
            />
          </a>
          Calculate Amount on Total
        </Label>
      </FormGroup>
    );
    if (this.state.simpleModal) {
      nameInput = null;
      calculateOnTotal = null;
    }
    return (
      <Form className="mt-3" onSubmit={this.handleSubmit.bind(this)}>
        <ModalBody>
          {nameInput}
          {this.content}
          <FormGroup className="m-top15">
            <Label for="walletSelect">Total cost (optional)</Label>
            <Input
              type="number"
              placeholder="Portfolio Cost"
              value={this.state.totalCost}
              onChange={this.handleTotalCost.bind(this)}
            />
          </FormGroup>
          {calculateOnTotal}
          <h4 className="m-top15 text-danger">{this.props.addPortfolioError}</h4>
        </ModalBody>
        <ModalFooter>
          <Button color="success" type="submit" disabled={this.props.isLoading}>
            {Spinner}
            Save
          </Button>
        </ModalFooter>
      </Form>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    isLoading: state.coins.isLoading.addPortfolio,
    addPortfolioError: state.coins.errors.addPortfolio,
    maxUi: state.coins.maxUi + 1,
    totalCostCurrency: state.coins.globalMainPair,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PortfolioType);
