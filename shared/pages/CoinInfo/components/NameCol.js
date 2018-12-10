import React, { Component } from 'react';
import { numberFormat, priceBtcFormat, formatPercent } from 'utils/formating';
import { Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { coins as coinsActions } from 'store/actions';

class NameCol extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let change24 = 'text-up';
    if (this.props.percentChange24h < 0) {
      change24 = 'text-down';
    }
    let change24BTC = 'text-up';
    if (
      ((1 + this.props.percentChange24h / 100) /
        (1 + this.props.BTC.percentChange24h / 100) -
        1) *
        100 <
      0
    ) {
      change24BTC = 'text-down';
    }
    return (
      <div className="coin-info-header-block coin-info-prcie">
        <Row className="no-gutters">
          <Col className="col-auto">
            <img
              src={this.props.iconUrl}
              className="coin-info-img"
              alt={`${this.props.name}, ${this.props.symbol}`}
            />
          </Col>
          <Col>
            <h1 className="coin-info-name">
              {this.props.name} ({this.props.symbol})
            </h1>
          </Col>
        </Row>
        <div className="coin-prices">
          <div>
            <span className="coin-info-price">
              ${numberFormat(this.props.price_usd)}
            </span>
            <span className={`${change24} coin-info-price-percent`}>
              {formatPercent(this.props.percentChange24h)} %
            </span>
          </div>
          <div>
            <span className="coin-info-price">
              ฿{priceBtcFormat(this.props.price_btc)}
            </span>
            <span className={`${change24BTC} coin-info-price-percent`}>
              {formatPercent(
                ((1 + this.props.percentChange24h / 100) /
                  (1 + this.props.BTC.percentChange24h / 100) -
                  1) *
                  100,
              )}{' '}
              %
            </span>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NameCol);
