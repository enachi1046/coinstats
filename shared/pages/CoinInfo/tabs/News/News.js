import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isClient } from 'utils/env/index';
import NewsList from '../../../NewsFeed/components/NewsList';

class NewsTab extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (isClient()) {
      const href = window.location.href.split('/');
      const tab = href[href.length - 1];
      if (tab === 'news') {
        this.props.onTitleChange(`${
          this.props.coin.name} (${
          this.props.coin.symbol}/USD) Price, Charts, Market cap | News`);
        this.props.onDescriptionChange(`All the latest ${
          this.props.coin.name} news and updates on Coin Stats. ${
          this.props.coin.name} (${this.props.coin.symbol}) live price, charts, market cap, volume, latest news...`);
        this.props.onKeyWordsChange(`${
          this.props.coin.name} price, ${
          this.props.coin.symbol} news, ${
          this.props.coin.name.toLowerCase()} news, ${
          this.props.coin.symbol.toLowerCase()}, cryptocurrency, cryptocurrency news, crypto coin, ${
          this.props.coin.name.toLowerCase()} chart, ${
          this.props.coin.symbol} chart, ${
          this.props.coin.symbol} market cap, ${
          this.props.coin.symbol} price chart`);
      }
    }
  }

  _onPostClick() {

  }

  render() {
    return (
      <NewsList
        coins={this.props.coins}
        news={this.props.news}
        page="/news"
        loadMore={this.props._loadMoreNews}
        hasMore={this.props.hasMoreById}
        onCurrentPostChange={this._onPostClick.bind(this)}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    hasMoreById: state.news.hasMoreById,
    coins: Object.values(state.coins.coinsById) || [],
    news: state.news.newsByCoin || [],
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewsTab);
