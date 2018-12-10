import React, { Component } from 'react';
import { Col } from 'reactstrap';
import { connect } from 'react-redux';
import { Timeline } from 'react-twitter-widgets';
import { isServer } from 'utils/env';
import MiniLoader from 'addons/MiniLoader';

class TwitterIFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  render() {
    if (isServer()) {
      return (
        <div className="d-flex">
          <MiniLoader />
        </div>
      );
    }
    return (
      <Timeline
        style={{ display: this.state.loading ? 'none' : 'block' }}
        dataSource={{
          sourceType: 'profile',
          screenName: this.props.url.replace('https://twitter.com/', ''),
        }}
        options={{
          theme: this.props.darkMode ? 'dark' : 'light',
          username: this.props.url.replace('https://twitter.com/', ''),
          height: '700',
        }}
        onLoad={() => this.setState({ loading: false })}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    darkMode: state.ui.darkMode,
  };
}

export default connect(mapStateToProps)(TwitterIFrame);
