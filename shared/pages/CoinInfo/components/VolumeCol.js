import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';

import { numberFormat } from 'utils/formating';

class VolumeCol extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let hour = 'text-up';
    if (this.props.percentChange1h < 0) {
      hour = 'text-down';
    }
    let day = 'text-up';
    if (this.props.percentChange24h < 0) {
      day = 'text-down';
    }
    let week = 'text-up';
    if (this.props.percentChange7d < 0) {
      week = 'text-down';
    }
    return (
      <div className="coin-info-header-block">
        <div className="coin-info-volume-data">
          <Row className="align-items-center">
            <Col className="col-12 col-md-7">
              <Row className="no-gutters justify-content-between coin-info-row">
                <Col className="col-auto">
                  <span className="coin-info-row-param">
                    Market Cap:
                  </span>
                </Col>
                <Col className="col-auto">
                  <span className="coin-info-row-value">
                    ${numberFormat(this.props.market_cap_usd)}
                  </span>
                </Col>
              </Row>
              <Row className="no-gutters justify-content-between coin-info-row">
                <Col className="col-auto">
                  <span className="coin-info-row-param">
                    Volume 24h:
                  </span>
                </Col>
                <Col className="col-auto">
                  <span className="coin-info-row-value">
                    ${numberFormat(this.props.volume_usd_24h)}
                  </span>
                </Col>
              </Row>
              <Row className="no-gutters justify-content-between coin-info-row">
                <Col className="col-auto">
                  <span className="coin-info-row-param">
                    Available Supply:
                  </span>
                </Col>
                <Col className="col-auto">
                  <span className="coin-info-row-value">
                    {numberFormat(this.props.available_supply)}{' '}
                    {this.props.symbol}
                  </span>
                </Col>
              </Row>
              <Row className="no-gutters justify-content-between coin-info-row">
                <Col className="col-auto">
                  <span className="coin-info-row-param">
                    Total Supply:
                  </span>
                </Col>
                <Col className="col-auto">
                  <span className="coin-info-row-value">
                    {numberFormat(this.props.total_supply)} {this.props.symbol}
                  </span>
                </Col>
              </Row>
            </Col>
            <Col className="col-12 col-md-5">
              <div className="coin-info-prices">
                <Row className="no-gutters justify-content-between coin-info-row">
                  <Col className="col-auto">
                    <span className="coin-info-row-param">
                      Price Change 1h:
                    </span>
                  </Col>
                  <Col className="col-auto">
                    <span className={`coin-info-row-value ${hour}`}>
                      {Math.abs(this.props.percentChange1h)}%
                    </span>
                  </Col>
                </Row>
                <Row className="no-gutters justify-content-between coin-info-row">
                  <Col className="col-auto">
                    <span className="coin-info-row-param">
                      Price Change 1d:
                    </span>
                  </Col>
                  <Col className="col-auto">
                    <span className={`coin-info-row-value ${day}`}>
                      {Math.abs(this.props.percentChange24h)}%
                    </span>
                  </Col>
                </Row>
                <Row className="no-gutters justify-content-between coin-info-row">
                  <Col className="col-auto">
                    <span className="coin-info-row-param">
                      Price Change 1w:
                    </span>
                  </Col>
                  <Col className="col-auto">
                    <span className={`coin-info-row-value ${week}`}>
                      {Math.abs(this.props.percentChange7d)}%
                    </span>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default VolumeCol;
