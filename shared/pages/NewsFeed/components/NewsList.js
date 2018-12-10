import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { isClient } from 'utils/env';
import MiniLoader from 'addons/MiniLoader';
import { home as homeActions } from 'store/actions';
import Loader from 'addons/Loader';

import SingleNews from './SingleNews';

class NewsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDescriptionPosition: this.props.isVisibalePosition,
      reactions: ['All News Feed', 'Most Bullish', 'Most Bearish', 'Saved'],
      title: 'Cryptocurrency News and Trends',
    };
  }

  redirectToCoin(coin) {
    if (coin.length > 0) {
      this.props.setActiveNavBar({ link: 'news', active: false });
      let path = `/liveprices/${coin.toLowerCase()}`;
      if (this.props.user) {
        path += '/news';
      }
      this.props.history.push(path);
    }
  }

  setShowedDescription(position) {
    this.setState({
      showDescriptionPosition: position,
    });
  }

  _setTitle(title) {
    this.setState({ title });
  }

  _onTitleClick(position) {
    if (this.props.onCurrentPostChange) {
      this.props.onCurrentPostChange(position);
    }
  }

  render() {
    if (this.props.isNewsLoading && this.props.news.length === 0) {
      return <Loader style={{ position: 'relative', background: 'transparent' }} />;
    }
    return this.props.news.map((singleNews, index) => (
      <SingleNews
        page={this.props.page}
        coins={this.props.coins}
        feed={singleNews}
        key={singleNews.id}
        position={index}
        onChangeTitle={this._setTitle.bind(this)}
        redirectToCoin={this.redirectToCoin.bind(this)}
        isOpen={index === this.state.showDescriptionPosition}
        showedDescription={this.setShowedDescription.bind(this)}
        onTitleClick={this._onTitleClick.bind(this)}
      />
    ));
  }
}

function mapStateToProps(state) {
  return {
    isNewsLoading: state.news.isNewsLoading,
    user: state.auth.user,
    isVisibalePosition: state.news.isVisibalePosition,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setActiveNavBar: activeBar => dispatch(homeActions.setActiveNavBar(activeBar)),
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewsList));
