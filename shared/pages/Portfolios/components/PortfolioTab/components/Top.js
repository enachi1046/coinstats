import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { numberFormat } from 'utils/formating';

import Chart from './Chart';

class Top extends Component {
  shouldComponentUpdate() {
    if (this.props.portfolio.portfolioSyncState === 1) {
      return false;
    }
    return true;
  }

  render() {
    return (
      <div className="mb-4 px-4">
        <Row>
          <Col>
            <h2 className="mr-3">
              {this.props.globalMainPair.sign}
              {numberFormat(this.props.price)}
              <div
                className="cursor-pointer display-6 refresh-button d-inline-flex ml-2 mt-1"
                onClick={this.props.loadPortfolios}
                title="Refresh Portfolios"
              >
                <img
                  src={this.props.ImgReload}
                  height="22px"
                  width="22px"
                  className={this.props.reloadIconClasses}
                />
              </div>
            </h2>
            {this.props.profitLoss}
          </Col>
          <Col className="col-auto">{this.props.addButton}</Col>
        </Row>
        {this.props.showChartText ? (
          <Row className="text-center">
            <Col xs="12">
              <Chart
                orderedCoinsLength={this.props.orderedCoins.length}
                portfolio={this.props.portfolio}
              />
              {this.props.chartDays}
            </Col>
          </Row>
        ) : ''}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    portfolios: state.coins.portfolios,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Top);
