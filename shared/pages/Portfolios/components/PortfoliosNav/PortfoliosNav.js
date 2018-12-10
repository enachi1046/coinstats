import React, { Component } from 'react';
import {
  Nav,
  NavItem,
  NavLink,
  Button,
  Input,
  Row,
  Col,
  Card,
  ListGroup,
  ListGroupItem,
  // Modal,
  // ModalHeader,
} from 'reactstrap';
import Switch from 'addons/Switch';
import MiniLoader from 'addons/MiniLoader';
import classnames from 'classnames';
import {
  ui as uiActions,
  auth as authActions,
  portfolios as portfoliosActions,
  coins as coinsActions,
} from 'store/actions';
import { connect } from 'react-redux';
import storage from 'utils/storage';
import { parseFunctionsResource } from 'api/resources';
import { isClient } from 'utils/env/index';
import ImportCSVModal from '../ImportCSVModal';

class PortfoliosNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      justOpnened: false,
      isCurrencyOpen: false,
      hideSmallAssets:
        storage.getItem('HIDE_SMALL_ASSETS') === 'true' ? true : '',
      hideUnidentified:
        storage.getItem('HIDE_UNIDENTIFIED') === 'true' ? true : '',
    };
  }

  _closeCurrency(event) {
    if (
      !event.target.classList.contains('currency-changer') &&
      !event.target.classList.contains('currency') &&
      !this.state.justOpnened
    ) {
      this.setState({ isCurrencyOpen: false });
    } else {
      this.setState({ justOpnened: false });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.isCurrencyOpen && this.state.isCurrencyOpen) {
      this.setState({ justOpnened: true });
    }
  }

  componentDidMount() {
    if (isClient) {
      document.addEventListener('click', this._closeCurrency.bind(this));
    }
  }

  onBecomeProClick() {
    this.props.toggleSubscriptionModal();
  }

  get becomePro() {
    if (this.props.user && !this.props.hasUnlimited) {
      return (
        <div
          className="become-pro-btn mx-3 mt-3"
          onClick={this.onBecomeProClick.bind(this)}
        >
          Become Pro
        </div>
      );
    }
    return '';
  }

  componentWillUnmount() {
    if (isClient) {
      document.removeEventListener('click', this._closeCurrency.bind(this));
    }
  }
  switchTab(ind) {
    this.props.setActiveTab(ind);
    this.props.onTabSwitch(ind);
  }

  _switchMainPair(e) {
    storage.setItem('currency', e);
    this.props.switchMainPair(e);
    this.setState({ isCurrencyOpen: false });
  }

  _switchCurrencies() {
    this.setState({ isCurrencyOpen: !this.state.isCurrencyOpen });
  }

  _exportPorfolio() {
    this.setState({ exportLoading: true });
    parseFunctionsResource.call('sendCSV', {}).then((success) => {
      const data = new Blob([success], { type: 'text/csv' });
      const csvURL = window.URL.createObjectURL(data);
      const tempLink = document.createElement('a');
      tempLink.href = csvURL;
      tempLink.setAttribute('download', 'filename.csv');
      tempLink.style.display = 'none';
      document.body.appendChild(tempLink);
      tempLink.click();
      this.setState({ exportLoading: false });
    });
  }

  _toggleSmallAssets() {
    this.props.setHideSmallAssets(!this.state.hideSmallAssets);
    this.setState({ hideSmallAssets: !this.state.hideSmallAssets });
  }

  _toggleUnidentified() {
    this.props.setHideUnidentified(!this.state.hideUnidentified);
    this.setState({ hideUnidentified: !this.state.hideUnidentified });
  }

  render() {
    let exportBtn = (
      <div className="export-btn" onClick={this._exportPorfolio.bind(this)}>
        <span> Export CSV</span>
        <span className="export-btn-img" />
      </div>
    );
    if (this.state.exportLoading) {
      exportBtn = (
        <div className="export-btn export-btn-loading">
          Export CSV <MiniLoader size={20} />
        </div>
      );
    }
    let importBtn = (
      <div className="export-btn" onClick={this.props.toggleImportCSVModal}>
        <span>Import CSV</span>
        <span className="import-btn-img" />
      </div>
    );
    if (this.state.importLoading) {
      importBtn = (
        <div className="export-btn">
          Import CSV <MiniLoader size={20} />
        </div>
      );
    }
    const { portfolios } = this.props;
    let addPortfolioBtn = (
      <div
        className="mx-3 add-portfolio-btn"
        onClick={this.props.toggle.bind(this)}
      >
        Add Portfolio
      </div>
    );
    if (!this.props.hasUnlimited && portfolios.length > 2) {
      addPortfolioBtn = (
        <div
          className="mx-3 add-portfolio-btn"
          onClick={() => this.props.toggleSubscriptionModal(true)}
        >
          <i className="fa fa-plus" />&nbsp; Add Portfolio
        </div>
      );
    }
    return (
      <Nav
        className={`${this.props.className} nav nav-tabs tabs-vertical`}
        tabs
      >
        {this.becomePro}
        {addPortfolioBtn}
        {portfolios.map((portfolio, ind) => {
          const className = classnames({
            active: this.props.activeTab === ind,
          });
          return (
            <NavItem key={ind} className="cursor-pointer">
              <NavLink
                className={className}
                onClick={() => {
                  this.switchTab(ind);
                }}
                href="#"
              >
                {portfolio.name}
              </NavLink>
            </NavItem>
          );
        })}
        {/* <NavItem className="float-right bg-primary bg-inverse">
          <NavLink onClick={this.props.onAddNew}>
            <i
              className="fa fa-plus mr-1 cursor-pointer"
              title="Add new Portfolio"
            ></i>
            Add Portfolio
          </NavLink>
        </NavItem> */}
        <hr className="mt-3" />
        <li>
          <Row className="h-100" noGutters>
            <Col xs="12">
              <ListGroup flush>
                <ListGroupItem
                  className="d-flex align-items-center"
                  style={{ height: '50%', border: '0' }}
                >
                  <div className="w-100">
                    <span className="mr-3" style={{ display: 'inline-block' }}>
                      Hide Small Assets
                    </span>
                    <div
                      className={`switch-bg ${this.state.hideSmallAssets ? 'switch-bg-moved' : ''}`}
                      onClick={this._toggleSmallAssets.bind(this)}
                    >
                      <div
                        className={`switch-circle ${this.state.hideSmallAssets ? 'switch-circle-moved' : ''}`}
                      />
                    </div>
                  </div>
                </ListGroupItem>
                <ListGroupItem
                  className="d-flex justify-content-between align-items-center"
                  style={{ height: '50%', border: '0' }}
                >
                  <div className="w-100">
                    <span className="mr-3" style={{ display: 'inline-block' }}>
                      Hide Unknown Coins
                    </span>
                    <div
                      className={`switch-bg ${this.state.hideUnidentified ? 'switch-bg-moved' : ''}`}
                      onClick={this._toggleUnidentified.bind(this)}
                    >
                      <div
                        className={`switch-circle ${this.state.hideUnidentified ? 'switch-circle-moved' : ''}`}
                      />
                    </div>
                  </div>
                </ListGroupItem>
                <ListGroupItem
                  className="d-flex justify-content-between align-items-center"
                  style={{ height: '50%', border: '0' }}
                >
                  <div className="w-100">
                    <Row
                      onClick={this._switchCurrencies.bind(this)}
                      className="justify-content-between aling-items-center cursor-pointer"
                    >
                      <Col xs="auto" className="align-self-center">
                        <div className="m-0">Currency</div>
                      </Col>
                      <Col xs="auto" className="align-self-center">
                        <div style={{ display: 'flex', marginRight: '10px' }}>
                          {this.props.globalMainPair.symbol}
                          <snap
                            className="currency-img"
                            style={{
                              backgroundImage: `url(/images/currency-${
                                this.state.isCurrencyOpen ? 'opened' : 'closed'}-${
                                this.props.darkMode ? 'dark' : 'light'}.svg)`,
                            }}
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                </ListGroupItem>
                <ListGroupItem
                  className="d-flex justify-content-between align-items-center"
                  style={{ height: '50%', border: '0' }}
                >
                  <div className="w-100">{exportBtn}</div>
                </ListGroupItem>
                <ListGroupItem
                  className="d-flex justify-content-between align-items-center"
                  style={{ height: '50%', border: '0' }}
                >
                  {/* <div className="w-100">{importBtn}</div> */}
                </ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
        </li>
        <li
          className="currency-changer"
          style={
            this.state.isCurrencyOpen
              ? { display: 'block' }
              : { display: 'none' }
          }
        >
          <div
            onClick={this._switchMainPair.bind(this, 'USD')}
            className="currency"
          >
            USD
          </div>
          <div
            onClick={this._switchMainPair.bind(this, 'BTC')}
            className="currency"
          >
            BTC
          </div>
          <div
            onClick={this._switchMainPair.bind(this, 'ETH')}
            className="currency"
          >
            ETH
          </div>
          {this.props.fiats.map((currency, ind) => {
            return (
              <div
                onClick={this._switchMainPair.bind(this, currency.id)}
                className="currency"
                key={ind}
              >
                {currency.name}
              </div>
            );
          })}
        </li>
        {/* <ImportCSVModal /> */}
      </Nav>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    darkMode: state.ui.darkMode,
    activeTab: state.coins.activeTab,
    globalMainPair: state.coins.globalMainPair,
    fiats: Object.values(state.coins.coinsById).filter((c) => {
      return c.fiat && c.symbol !== 'USD';
    }),
    hasUnlimited: state.auth.hasUnlimited,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    switchMainPair(v) {
      return dispatch(coinsActions.switchMainPair(v));
    },
    setActiveTab(value) {
      return dispatch(portfoliosActions.setActiveTab(value));
    },
    toggleSubscriptionModal(a) {
      return dispatch(authActions.toggleSubscriptionModal(a));
    },
    setHideSmallAssets(v) {
      return dispatch(uiActions.setHideSmallAssets(v));
    },
    setHideUnidentified(v) {
      return dispatch(uiActions.setHideUnidentified(v));
    },
    toggleImportCSVModal() {
      return dispatch(uiActions.toggleImportCSVModal());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PortfoliosNav);
