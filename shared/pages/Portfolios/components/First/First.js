import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Loader from 'addons/Loader';
import { portfolios as portfoliosActions } from 'store/actions';
import Tutorial from './components/Tutorials';
import Manual from './components/Manual';
import Final from './components/Final';

class First extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clickedExchange: {},
      exchangesLoading: true,
      tutorialPage: false,
      enterManualy: false,
      newExchangeAdditionalFields: {},
      walletAddress: '',
      finalPage: false,
      loadPortfolios: false,
      emptyField: '',
      clickedWallet: {},
      walletsLoading: true,
      showButtons: true,
    };
  }

  componentDidMount() {
    if (this.props.exchangesList.length > 0 && this.props.page === 'exchange') {
      this.setState({ exchangesLoading: false, walletsLoading: false });
    }
    if (this.props.walletsList.length > 0 && this.props.page === 'wallet') {
      this.setState({ exchangesLoading: false, walletsLoading: false });
    }
  }

  exchangeClick(exchange) {
    this.setState({
      clickedExchange: {
        [exchange.name]: {
          exchangeAdditionalFields: exchange.additionalFields,
          texts: exchange.tutorials,
          type: exchange.type,
        },
      },
    });
    setTimeout(() => {
      this.setState({ tutorialPage: true });
    }, 350);
  }

  walletClick(wallet) {
    this.setState({
      clickedWallet: {
        [wallet.name]: {
          texts: wallet.tutorials,
          type: wallet.type,
        },
      },
    });
    setTimeout(() => {
      this.setState({ tutorialPage: true });
    }, 350);
  }

  get wallets() {
    const list = [];
    if (this.props.walletsList.length > 0) {
      for (let i = 0; i < this.props.walletsList.length; i += 2) {
        list.push((
          <div className="exchange-row">
            <div
              onClick={() => this.walletClick(this.props.walletsList[i])}
              className="exchange-element-left"
            >
              <img
                style={{ marginTop: '6px' }}
                src={
                  `https://s3-us-west-2.amazonaws.com/coin-stats-portfolio-icons/wallets/web/${this.props.darkMode ? 'dark' : 'light'}/${this.props.walletsList[i].type}.png`
                }
                height="30px"
                width="30px"
              />
              <span style={{ marginTop: '9px', marginLeft: '10px' }}>{this.props.walletsList[i].name}</span>
              {this.state.clickedWallet[this.props.walletsList[i].name] ?
                <img style={{ marginLeft: '10px' }} src={`/images/${this.props.darkMode ? 'checked-dark.svg' : 'checked.svg'}`} />
                : ''
              }
            </div>
            {this.props.walletsList[i + 1] ? (
              <div
                onClick={() => this.walletClick(this.props.walletsList[i + 1])}
                className="exchange-element-right"
              >
                <img
                  style={{ marginTop: '6px' }}
                  src={
                    `https://s3-us-west-2.amazonaws.com/coin-stats-portfolio-icons/wallets/web/${this.props.darkMode ? 'dark' : 'light'}/${this.props.walletsList[i + 1].type}.png`
                  }
                  height="30px"
                  width="30px"
                />
                <span style={{ marginTop: '9px', marginLeft: '10px' }}>{this.props.walletsList[i + 1].name}</span>
                {this.state.clickedWallet[this.props.walletsList[i + 1].name] ?
                  <img style={{ marginLeft: '10px' }} src={`/images/${this.props.darkMode ? 'checked-dark.svg' : 'checked.svg'}`} />
                  : ''
                }
              </div>
            ) : ''}
          </div>
        ));
      }
    }
    return list.map((row) => {
      return row;
    });
  }

  get exchanges() {
    const list = [];
    if (this.props.exchangesList.length > 0) {
      for (let i = 0; i < this.props.exchangesList.length; i += 2) {
        list.push((
          <div className="exchange-row">
            <div
              onClick={() => this.exchangeClick(this.props.exchangesList[i])}
              className="exchange-element-left"
            >
              <img
                style={{ marginTop: '6px' }}
                src={
                  `https://s3-us-west-2.amazonaws.com/coin-stats-portfolio-icons/exchanges/web/${this.props.darkMode ? 'dark' : 'light'}/${this.props.exchangesList[i].type}.png`
                }
                height="30px"
                width="30px"
              />
              <span style={{ marginTop: '9px', marginLeft: '10px' }}>{this.props.exchangesList[i].name}</span>
              {this.state.clickedExchange[this.props.exchangesList[i].name] ?
                <img style={{ marginLeft: '10px' }} src={`/images/${this.props.darkMode ? 'checked-dark.svg' : 'checked.svg'}`} />
                : ''
              }
            </div>
            {this.props.exchangesList[i + 1] ? (
              <div
                onClick={() => this.exchangeClick(this.props.exchangesList[i + 1])}
                className="exchange-element-right"
              >
                <img
                  style={{ marginTop: '6px' }}
                  src={
                    `https://s3-us-west-2.amazonaws.com/coin-stats-portfolio-icons/exchanges/web/${this.props.darkMode ? 'dark' : 'light'}/${this.props.exchangesList[i + 1].type}.png`
                  }
                  height="30px"
                  width="30px"
                />
                <span style={{ marginTop: '9px', marginLeft: '10px' }}>{this.props.exchangesList[i + 1].name}</span>
                {this.state.clickedExchange[this.props.exchangesList[i + 1].name] ?
                  <img style={{ marginLeft: '10px' }} src={`/images/${this.props.darkMode ? 'checked-dark.svg' : 'checked.svg'}`} />
                  : ''
                }
              </div>
            ) : ''}
          </div>
        ));
      }
    }
    return list.map((row) => {
      return row;
    });
  }

  get exchangeHeader() {
    return (
      <div style={{ fontSize: '17px' }}>
        <img
          src={
            `https://s3-us-west-2.amazonaws.com/coin-stats-portfolio-icons/exchanges/web/${this.props.darkMode ? 'dark' : 'light'}/${this.state.clickedExchange[Object.keys(this.state.clickedExchange)[0]].type}.png`
          }
          height="30px"
          width="30px"
        />
        <span style={{ marginLeft: '7px' }}>{Object.keys(this.state.clickedExchange)[0]}</span>
      </div>
    );
  }

  get walletHeader() {
    return (
      <div style={{ fontSize: '17px' }}>
        <img
          src={
            `https://s3-us-west-2.amazonaws.com/coin-stats-portfolio-icons/wallets/web/${this.props.darkMode ? 'dark' : 'light'}/${this.state.clickedWallet[Object.keys(this.state.clickedWallet)[0]].type}.png`
          }
          height="30px"
          width="30px"
        />
        <span style={{ marginLeft: '7px' }}>{Object.keys(this.state.clickedWallet)[0]}</span>
      </div>
    );
  }

  exchangeChange(value, field, clipText) {
    const newExchangeAdditionalFields = this.state.newExchangeAdditionalFields;
    if (clipText) {
      newExchangeAdditionalFields[field] = clipText;
    } else {
      newExchangeAdditionalFields[field] = value;
    }
    this.setState({ newExchangeAdditionalFields });
  }

  addressChange(event, clipText) {
    if (clipText) {
      this.setState({ walletAddress: clipText });
    } else {
      this.setState({ walletAddress: event.target.value });
    }
  }

  submitCoinbase(additionalInfo) {
    this.setState({ exchangesLoading: true });
    this.props.addPortfolio({
      exchangeAdditionalFields: additionalInfo,
      exchangeType: this.state.clickedExchange[Object.keys(this.state.clickedExchange)[0]].type,
      isShowOnTotalDisabled: false,
      isTransactionOrdersEnabled: true,
      typeId: 1,
      name: '',
      totalCost: '',
      totalCostCurrency: 'USD',
    }).then((res) => {
      if (res.error) {
        this.setState({ finalPageSuccess: false, exchangesLoading: false });
      } else {
        this.setState({ finalPage: true, finalPageSuccess: true, exchangesLoading: false });
      }
    });
  }

  submitExchange() {
    let empty = false;
    this.state.clickedExchange[
      Object.keys(this.state.clickedExchange)[0]
    ].exchangeAdditionalFields.map((field) => {
      if (!this.state.newExchangeAdditionalFields[field.key] || this.state.newExchangeAdditionalFields[field.key].length === 0) {
        if (!empty) {
          this.setState({ emptyField: field.key });
          empty = true;
        }
      }
    });
    if (!empty) {
      this.setState({ exchangesLoading: true });
      this.props.addPortfolio({
        exchangeAdditionalFields: this.state.newExchangeAdditionalFields,
        exchangeType: this.state.clickedExchange[Object.keys(this.state.clickedExchange)[0]].type,
        isShowOnTotalDisabled: false,
        isTransactionOrdersEnabled: true,
        typeId: 1,
        name: '',
        totalCost: '',
        totalCostCurrency: 'USD',
      }).then((res) => {
        if (res.error) {
          this.setState({ finalPageSuccess: false, exchangesLoading: false });
        } else {
          this.setState({ finalPage: true, finalPageSuccess: true, exchangesLoading: false });
        }
      });
    }
  }

  submitWallet() {
    if (this.state.walletAddress.length === 0) {
      this.setState({ emptyField: 'Address' });
    } else {
      this.setState({ walletsLoading: true });
      this.props.addPortfolio({
        typeId: 2,
        walletTypeId: this.state.clickedWallet[Object.keys(this.state.clickedWallet)[0]].type,
        walletAddr: this.state.walletAddress,
        name: '',
        totalCost: null,
        totalCostCurrency: 'USD',
        isShowOnTotalDisabled: false,
      }).then((res) => {
        if (res.error) {
          this.setState({ finalPageSuccess: false, walletsLoading: false });
        } else {
          this.setState({ finalPage: true, finalPageSuccess: true, walletsLoading: false });
        }
      });
    }
  }

  syncAnother() {
    this.props.setForceFirst(true);
    this.setState({
      clickedExchange: {},
      tutorialPage: false,
      enterManualy: false,
      apiKey: '',
      apiSecret: '',
      walletAddress: '',
      finalPage: false,
      loadPortfolios: false,
      emptyField: '',
      clickedWallet: {},
    });
  }

  openPortfoliosPage() {
    this.props.setForceFirst(false);
    this.props.setShowFinalButtons();
    this.setState({ loadPortfolios: true });
  }

  render() {
    if (this.state.exchangesLoading || this.state.walletsLoading) {
      return <Loader />;
    }
    if (this.state.loadPortfolios) {
      return this.props.portfolioContent();
    }
    if (this.state.finalPage) {
      if (this.state.finalPageSuccess) {
        return (
          <Final
            showButtons={this.props.showFinalButtons}
            header={this.props.page === 'exchange' ? this.exchangeHeader : this.walletHeader}
            openPortfoliosPage={this.openPortfoliosPage.bind(this)}
            syncAnother={this.syncAnother.bind(this)}
          />
        );
      }
    }
    if (this.state.enterManualy) {
      return (
        <Manual
          isExchange={this.props.page === 'exchange'}
          exchangeAdditionalFields={this.props.page === 'exchange' ?
            this.state.clickedExchange[
              Object.keys(this.state.clickedExchange)[0]
            ].exchangeAdditionalFields : ''
          }
          newExchangeAdditionalFields={this.state.newExchangeAdditionalFields}
          header={this.props.page === 'exchange' ? this.exchangeHeader : this.walletHeader}
          walletAddress={this.state.walletAddress}
          addressChange={this.addressChange.bind(this)}
          apiKey={this.state.apiKey}
          finalPageSuccess={this.state.finalPageSuccess}
          emptyField={this.state.emptyField}
          apiSecret={this.state.apiSecret}
          exchangeChange={this.exchangeChange.bind(this)}
          clickedExchange={this.state.clickedExchange}
          submit={this.props.page === 'exchange' ? this.submitExchange.bind(this) : this.submitWallet.bind(this)}
        />
      );
    }
    if (this.state.tutorialPage) {
      return (
        <Tutorial
          texts={this.props.page === 'exchange' ?
            this.state.clickedExchange[Object.keys(this.state.clickedExchange)[0]].texts :
            this.state.clickedWallet[Object.keys(this.state.clickedWallet)[0]].texts
          }
          header={this.props.page === 'exchange' ? this.exchangeHeader : this.walletHeader}
          clickedExchange={this.state.clickedExchange}
          setManual={() => this.setState({ enterManualy: true })}
          submitCoinbase={this.submitCoinbase.bind(this)}
          exchangesLoading={this.state.exchangesLoading}
          walletsLoading={this.state.walletsLoading}
        />
      );
    }
    return (
      <div className="first-exchange">
        <div className="exchange-header"> Where do you own coin? </div>
        <div style={{ justifyContent: 'center', display: 'grid' }}>{this.props.page === 'exchange' ? this.exchanges : this.wallets}</div>
      </div>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    addPortfolio(params) {
      return dispatch(portfoliosActions.addPortfolio(params));
    },
  };
}

function mapStateToProps(state) {
  return {
    darkMode: state.ui.darkMode,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(First));
