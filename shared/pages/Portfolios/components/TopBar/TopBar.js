import React, { Component } from 'react';
import { connect } from 'react-redux';
import { numberFormat } from 'utils/formating';
import { Row, Col, Card, CardBody, ListGroup, ListGroupItem } from 'reactstrap';
import { auth as authActions, coins as coinsActions, ui as uiActions } from 'store/actions';
import ImgReload from './assets/reload.svg';

class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };
  }

  get globalTotalPositiveProfit() {
    if (!this.props.globalTotalPositiveProfit) {
      return 0;
    }
    return numberFormat((this.props.globalTotalProfit / this.props.globalTotalPositiveProfit) * 100);
  }

  onBecomeProClick() {
    this.props.toggleSubscriptionModal();
  }

  get becomePro() {
    if (this.props.user && !this.props.hasUnlimited) {
      return (
        <Col xs="auto" className="align-items-center">
          <div className="become-pro-btn" onClick={this.onBecomeProClick.bind(this)}>
            Become Pro
          </div>
        </Col>
      );
    }
    return '';
  }

  render() {
    let reloadIconClasses = 'fa-spin';
    if (!this.props.isPortfoliosLoading) {
      reloadIconClasses = '';
    }
    let globalTotalProfit;
    if (this.props.globalTotalProfit < 0) {
      globalTotalProfit = (
        <h4 className="text-danger width-auto">
          -{this.props.globalMainPair.sign}
          {numberFormat(-this.props.globalTotalProfit)}
          ({this.globalTotalPositiveProfit}%)
          <small>
            <i className="ti-angle-down text-danger" />
          </small>
        </h4>
      );
    } else {
      globalTotalProfit = (
        <h4 className="text-success width-auto">
          {this.props.globalMainPair.sign}
          {numberFormat(this.props.globalTotalProfit)}
          ({this.globalTotalPositiveProfit}%)
          <small>
            <i className="ti-angle-up text-success" />
          </small>
        </h4>
      );
    }
    let price = this.props.portfolios[0].price[this.props.globalMainPair.symbol];
    if (!price) {
      price = this.props.portfolios[0].price.USD / this.props.globalMainPair.usdValue;
    }
    return (
      <Row className="justify-content-between">
        <Col xs="12">
          <Card style={{ marginBottom: '17px', borderRadius: 0 }}>
            <CardBody className="h-100">
              <Row>
                <div
                  className="cursor-pointer display-6 refresh-button d-inline-flex ml-2 mt-1"
                  onClick={this.props.loadPortfolios}
                  title="Refresh Portfolios"
                >
                  <img src={ImgReload} height="20px" width="22px" className={reloadIconClasses} />
                </div>
                <Col className="align-self-center">
                  <h4 className="mr-3 mt-1">
                    {this.props.globalMainPair.sign}
                    {numberFormat(price)}
                  </h4>
                  <div>{globalTotalProfit}</div>
                </Col>
                {this.becomePro}
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  return {
    portfolios: state.coins.portfolios,
    user: state.auth.user,
    hasUnlimited: state.auth.hasUnlimited,
    globalTotal: state.coins.globalTotal,
    globalTotalProfit: state.coins.globalTotalProfit,
    globalTotalPositiveProfit: state.coins.globalTotalPositiveProfit,
    globalMainPair: state.coins.globalMainPair,
    coinsById: state.coins.coinsById,
    isPortfoliosLoading: state.coins.isLoading.fetchPortfolios,
    hideSmallAssets: state.ui.hideSmallAssets,
    hideUnidentified: state.ui.hideUnidentified,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleSubscriptionModal() {
      return dispatch(authActions.toggleSubscriptionModal());
    },
    loadCoins(v) {
      return dispatch(coinsActions.loadCoins(v));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TopBar);
