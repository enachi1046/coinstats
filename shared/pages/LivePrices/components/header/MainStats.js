import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import { numberFormat } from 'utils/formating';

class MainStats extends Component {
  render() {
    if (!this.props.stats) {
      return <ul className="statistics-title" />;
    }
    return (
      <ul className="statistics-title">
        <li>Market Cap: <span>${numberFormat(this.props.stats.marketCap)}</span></li>
        <li>24h Vol: <span>${numberFormat(this.props.stats.volume)}</span></li>
        <li>BTC Dominance: <span>{this.props.stats.btcDominance}%</span></li>
      </ul>
    );
  }
}

export default MainStats;
