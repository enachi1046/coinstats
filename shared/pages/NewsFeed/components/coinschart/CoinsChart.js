import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import { numberFormat } from 'utils/formating';
import SignInText from 'components/SignInText';

class CoinsChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPrice: false,
    };
  }

  priceToPercent() {
    this.setState({ showPrice: !this.state.showPrice });
  }

  get coins() {
    const coins = [];
    for (let i = 0; i < this.props.coins.length; ++i) {
      if (!this.props.coins[i].fiat) {
        coins.push(this.props.coins[i]);
      }
      if (coins.length === 20) {
        return coins;
      }
    }
    return coins;
  }

  render() {
    let counter = 0;
    const topValue = `${this.props.topValue}px`;
    const calcValue = `calc(100vh - ${Number(this.props.topValue) + 10}px)`;
    return (
      <div className="coins-chart" style={{ top: topValue, height: calcValue }}>
        {this.props.fromNews ? <span><SignInText fromNews /></span> : ''}
        {this.coins.map((coin, ind) => {
          let change24 = 'text-up';
          if (coin.percentChange24h < 0) {
            change24 = 'text-down';
          }
          return (
            <Row key={ind} className="coin-row">
              <Col xs="1" className="coin-text counter">
                {++counter}
              </Col>
              <Col xs="1">
                <img width="30px" style={{ marginTop: '10px' }} className="image mr-2" alt={`${coin.name}, ${coin.symbol}`} src={coin.iconUrl} />
              </Col>
              <Col
                className="coin-text coin-chart-name cursor-pointer"
                title={` ${coin.name} (${coin.symbol}) `}
                onClick={() => this.props.redirectToCoin(coin.id)}
              >
                {` ${coin.name} (${coin.symbol}) `}
              </Col>
              <Col
                onClick={this.priceToPercent.bind(this)}
                data-coinprice={coin.price}
                data-coinpercent={coin.percentChange24h}
                className="coin-text col-auto percent cursor-pointer"
              >
                {this.state.showPrice ? <p>$ {numberFormat(coin.price)}</p> : <p className={change24}>{coin.percentChange24h} %</p>}
              </Col>
            </Row>
          );
        })}
      </div>
    );
  }
}

export default CoinsChart;
