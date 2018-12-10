import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Helmet } from 'react-helmet';
import {
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  TabContent,
  TabPane,
  Card,
  Button,
} from 'reactstrap';

import {
  portfolios as portfoliosActions,
  home as homeActions,
  coins as coinsActions,
} from 'store/actions';
import Layout from 'layouts/Blank';
import { isServer } from 'utils/env';
import storage from 'utils/storage';
import config from 'config';
import { portfolios as portfolioApi } from 'api';

import SignInText from 'components/SignInText';
import Loader from 'addons/Loader';
import { isClient } from 'utils/env';
import TopBar from './components/TopBar';
import AddCoin from './components/AddCoin';
import PortfoliosNav from './components/PortfoliosNav';
import PortfolioTab from './components/PortfolioTab';
import PortfolioTypes from './components/PortfolioTypes';
import First from './components/First';

class Portfolios extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstWallet: false,
      firstExchange: false,
      isAddTransactionOpen: false,
      maxUI: 0,
      globalPortfId: '',
      globalPortfType: 0,
      globalPortfTransactions: [],
      lineChartData: '',
      modal: false,
      showPortfolios: 'hide',
      portfolioType: 0,
      forceFirst: false,
      showFinalSuccessButtons: true,
      exchangesList: [],
      walletsList: [],
    };
    this.toggle = this.toggle.bind(this);
    this.toggleTr = this.toggleTr.bind(this);
    this.showPortfolios = this.showPortfolios.bind(this);
    this._onAddPortfolio = this._onAddPortfolio.bind(this);
  }

  setForceFirst(value) {
    this.setState({
      forceFirst: value,
      firstWallet: false,
      firstExchange: false,
    });
  }

  onBackButtonEvent(e) {
    if (
      window.location.href.split('/')[
        window.location.href.split('/').length - 1
      ] === 'new'
    ) {
      e.preventDefault();
      this.setState({
        forceFirst: false,
        firstExchange: false,
        firstWallet: false,
        isAddTransactionOpen: false,
      });
    }
  }

  componentDidMount() {
    if (isClient()) {
      window.onpopstate = this.onBackButtonEvent.bind(this);
    }
    if (this.props.user) {
      this.props.loadPortfolios();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.user && this.props.user) {
      this.props.loadPortfolios();
    }
    if (prevState.modal !== this.state.modal) {
      document
        .getElementsByTagName('body')[0]
        .classList.toggle('background-overflow');
    }
  }

  toggleTab(tab) {
    if (this.props.activeTab === tab) {
      return;
    }
    this.props.setActiveTab(tab);
  }

  toggleTr(portfolio = {}) {
    document
      .getElementsByTagName('body')[0]
      .classList.toggle('background-overflow');
    this.setState({
      isAddTransactionOpen: !this.state.isAddTransactionOpen,
      globalPortfId: portfolio.identifier,
      globalPortfTransactions: portfolio.transactions,
      globalPortfType: portfolio.altfolioType,
    });
  }

  toggle(e) {
    if (e === 0) {
      this.setState({
        modal: !this.state.modal,
        portfolioType: e,
      });
    } else {
      this.setState({
        forceFirst: true,
        firstExchange: false,
        firstWallet: false,
      });
    }
  }

  showPortfolios() {
    let show = 'show';
    if (this.state.showPortfolios === 'show') {
      show = 'hide';
    }
    this.setState({
      showPortfolios: show,
    });
  }

  _onAddPortfolio(data) {
    if (data.selectedExchange.type === 10) {
      data.exchangeAdditionalFields = data.coinbaseData;
    }
    return this.props
      .addPortfolio(data)
      .then(({ error, payload }) => {
        if (error) {
          return Promise.reject(error);
        }
        if (!data.identifier) {
          this.toggle(0);
        }
        this.props.setActiveTab(this.props.portfolios.length - 1);
        this.toggleTab(this.props.portfolios.length - 1);
        return Promise.resolve(payload);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  _onDeletePortfolio(id) {
    return this.props.deletePortfolio(id).then(({ error }) => {
      if (!error) {
        this.props.setActiveTab(0);
      }
    });
  }

  _onCoinClick(coinId) {
    this.props.setActiveNavBar({ link: 'portfolio', active: false });
    let path = `/liveprices/${coinId}`;
    if (this.props.user) {
      path += '/holdings';
    }
    this.props.history.push(path);
  }

  toggleFirst(page) {
    this.setState({ [page]: !this.state[page] });
  }

  giveContent() {
    this.setState({ firstWallet: false, firstExchange: false });
    return this.content;
  }

  loadSuported() {
    if (!this.state.exchangesList.length) {
      portfolioApi.loadSupportedExchanges().then((res) => {
        this.setState({ exchangesList: res.data.exchanges });
      });
    }
    if (!this.state.walletsList.length) {
      portfolioApi.loadSupportedWallets().then((res) => {
        this.setState({ walletsList: res.data.wallets });
      });
    }
  }

  get content() {
    if (this.state.firstExchange || this.state.firstWallet) {
      return (
        <First
          exchangesList={this.state.exchangesList}
          walletsList={this.state.walletsList}
          setShowFinalButtons={() =>
            this.setState({ showFinalSuccessButtons: false })
          }
          showFinalButtons={this.state.showFinalSuccessButtons}
          page={this.state.firstExchange ? 'exchange' : 'wallet'}
          portfolioContent={this.giveContent.bind(this)}
          setForceFirst={this.setForceFirst.bind(this)}
        />
      );
    }
    const { portfolios } = this.props;
    if (!isClient()) {
      return (
        <span>
          <Loader />
        </span>
      );
    }
    if (
      (this.props.isLoading && this.props.firstFetch) ||
      this.props.isUserLoading
    ) {
      return (
        <span>
          <Loader />
        </span>
      );
    }
    if (!this.props.user) {
      return (
        <span>
          <SignInText />
        </span>
      );
    }
    if (
      (portfolios.length < 2 && !this.props.firstFetch) ||
      this.state.forceFirst
    ) {
      this.props.history.push('/portfolio/new');
      this.loadSuported();
      return (
        <div className="empty-portfolios">
          <div>
            <Button
              style={{
                textAlign: 'left',
                paddingLeft: '25px',
              }}
              className="mb-3 add-first-btn"
              onClick={() => this.toggleFirst('firstWallet')}
            >
              <i className="fa fa-plus" />&nbsp; Add Wallet
            </Button>
          </div>
          <div>
            <Button
              style={{
                textAlign: 'left',
                paddingLeft: '25px',
              }}
              className="mb-3 add-first-btn"
              onClick={() => this.toggleFirst('firstExchange')}
            >
              <i className="fa fa-plus" />&nbsp; Add Exchange
            </Button>
          </div>
          {this.props.hasUsualPortfolio ? (
            <div>
              <Button
                style={{
                  textAlign: 'left',
                  paddingLeft: '25px',
                }}
                className="mb-3 add-first-btn"
                color="info"
                onClick={() => this.toggle(0)}
              >
                <i className="fa fa-plus" />&nbsp; Add Portfolio Manually
              </Button>
            </div>
          ) : (
            <div>
              <Button
                style={{
                  textAlign: 'left',
                  paddingLeft: '25px',
                }}
                className="mb-3 add-first-btn"
                onClick={this.toggleTr.bind(this)}
              >
                <i className="fa fa-plus" />&nbsp; Add Manual Transaction
              </Button>
            </div>
          )}
          <Modal
            isOpen={this.state.modal}
            toggle={this.toggle}
            className={this.props.className}
          >
            <ModalHeader toggle={this.toggle}>Add new Portfolio</ModalHeader>
            <PortfolioTypes
              hidePortfolioTypes
              onAddPortfolio={this._onAddPortfolio}
              portfolioType={this.state.portfolioType}
            />
          </Modal>
          <Modal
            isOpen={this.state.isAddTransactionOpen}
            toggle={this.toggleTr.bind(this)}
            className={this.props.className}
          >
            <ModalHeader toggle={this.toggleTr.bind(this)}>
              Add Transaction
            </ModalHeader>
            <ModalBody>
              <AddCoin
                globalPortfId={this.state.globalPortfId}
                globalPortfTransactions={this.state.globalPortfTransactions}
                globalPortfType={this.state.globalPortfType}
                allPortfolios={this.props.portfolios}
                onTransactionSaved={() => {
                  this.setState({
                    isAddTransactionOpen: false,
                  });
                }}
              />
            </ModalBody>
          </Modal>
        </div>
      );
    }
    this.props.history.push('/portfolio');
    return (
      <div className="oveflow-x-auto for-table-responsivity w-100 portfolio-card mt-4">
        <div className="vtabs customvtab w-100 portfolio-base-div">
          <PortfoliosNav
            portfolios={portfolios}
            onTabSwitch={this.toggleTab.bind(this)}
            toggle={this.toggle}
            className={`bg-white-or-black ${this.state.showPortfolios}`}
          />
          <TabContent activeTab={this.props.activeTab} className="pt-0 pb-0">
            {/* <TopBar loadPortfolios={this.props.loadPortfolios} /> */}
            {portfolios.map((portfolio, ind) => {
              let portfolioTab;
              if (
                this.props.portfolios[this.props.activeTab] &&
                this.props.portfolios[this.props.activeTab].identifier &&
                this.props.portfolios[this.props.activeTab].identifier ===
                  portfolio.identifier
              ) {
                portfolioTab = (
                  <PortfolioTab
                    addTransactionCallback={(id) => {
                      return this.toggleTr(portfolio);
                    }}
                    activePortfolioId={
                      this.props.portfolios[this.props.activeTab].identifier
                    }
                    portfolio={portfolio}
                    items={portfolio.portfolioItems}
                    onCoinClick={this._onCoinClick.bind(this)}
                    lineChartData={this.state.lineChartData}
                    showPortfolios={this.showPortfolios}
                    showPortfolioText={this.state.showPortfolios}
                    onAddPortfolio={this._onAddPortfolio.bind(this)}
                    onDeletePortfolio={this._onDeletePortfolio.bind(this)}
                  />
                );
              }
              return (
                <TabPane
                  className="bg-white-or-black py-4"
                  tabId={ind}
                  key={portfolio.identifier}
                >
                  {portfolioTab}
                </TabPane>
              );
            })}
          </TabContent>
        </div>
        <Modal
          isOpen={this.state.isAddTransactionOpen}
          toggle={this.toggleTr.bind(this)}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggleTr.bind(this)}>
            Add Transaction
          </ModalHeader>
          <ModalBody>
            <AddCoin
              globalPortfId={this.state.globalPortfId}
              globalPortfTransactions={this.state.globalPortfTransactions}
              globalPortfType={this.state.globalPortfType}
              allPortfolios={this.props.portfolios}
              onTransactionSaved={() => {
                this.setState({
                  isAddTransactionOpen: false,
                });
              }}
            />
          </ModalBody>
        </Modal>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}>Add new Portfolio</ModalHeader>
          <PortfolioTypes onAddPortfolio={this._onAddPortfolio} />
        </Modal>
      </div>
    );
  }

  render() {
    return (
      <Layout id="portfolios" {...this.props}>
        <Helmet>
          <title>{config('htmlPage.title.portfolio')}</title>
          <meta
            name="description"
            content={config('htmlPage.description.portfolio')}
          />
          <meta
            name="keywords"
            content={config('htmlPage.keywords.portfolio')}
          />
        </Helmet>
        <section>
          <div className="guide">{this.content}</div>
        </section>
      </Layout>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setActiveNavBar: (activeBar) => {
      return dispatch(homeActions.setActiveNavBar(activeBar));
    },
    setActiveTab(value) {
      return dispatch(portfoliosActions.setActiveTab(value));
    },
    loadPortfolios() {
      return dispatch(portfoliosActions.loadPortfolios());
    },
    addPortfolio(params) {
      return dispatch(portfoliosActions.addPortfolio(params));
    },
    deletePortfolio(id) {
      return dispatch(portfoliosActions.deletePortfolio(id));
    },
  };
}

function mapStateToProps(state, ownProps) {
  return {
    hasUsualPortfolio: state.coins.hasUsualPortfolio,
    firstFetch: state.coins.firstFetch,
    activeTab: state.coins.activeTab,
    isUserLoading: state.auth.isLoading,
    isLoading: state.coins.isLoading.fetchPortfolios,
    globalTotal: state.coins.globalTotal,
    portfolios: state.coins.portfolios.map((portfolio) => {
      const portfolioItem = portfolio.portfolioItems;

      for (const id in portfolioItem) {
        const totalInBtc =
          portfolioItem[id].count * portfolioItem[id].price.BTC;
        if (state.ui.hideSmallAssets && totalInBtc < 0.0001) {
          portfolioItem[id].hide = true;
        } else {
          portfolioItem[id].hide = false;
        }
        if (state.ui.hideUnidentified && id.indexOf('Fake') !== -1) {
          portfolioItem[id].hide = true;
        }
      }
      return {
        ...portfolio,
      };
    }),
    user: ownProps.user || state.auth.user,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(Portfolios));
