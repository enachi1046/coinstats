import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import LivePricesSearch from './LivePricesSearch';

class Filters extends Component {
  render() {
    return (
      <Row>
        <Col sm="4">
          <LivePricesSearch />
        </Col>
      </Row>
    );
  }
}

export default Filters;
