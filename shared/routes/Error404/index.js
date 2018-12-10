import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Error404 extends Component {
  componentWillMount() {
    const { staticContext } = this.props;
    if (staticContext) {
      staticContext.missed = true;
    }
  }

  render() {
    return (
      <span style={{
        display: 'grid',
        paddingTop: '170px',
        justifyContent: 'center',
      }}
      >
        <div style={{ color: '#fea856', fontSize: '150px' }}>404</div>
        <div style={{ color: '#fea856', fontSize: '44px' }}>NOT FOUND</div>
      </span>
    );
  }
}

Error404.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  staticContext: PropTypes.object,
};

Error404.defaultProps = {
  staticContext: {},
};

export default Error404;
