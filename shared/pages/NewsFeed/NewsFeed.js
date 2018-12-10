import React, { Component } from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import { withRouter } from 'react-router-dom';
import Layout from 'layouts/Blank';
import { Helmet } from 'react-helmet';
import config from 'config';
import {
  portfolios as portfoliosActions,
  home as homeActions,
} from 'store/actions';
import MiniLoader from 'addons/MiniLoader';
import storage from 'utils/storage';
import { differenceInDays } from 'utils/formating';

import CoinsChart from './components/coinschart/CoinsChart';
import UserPortfolio from './components/portfolio/UserPortfolio';
import SingleNews from './components/SingleNews';
import Header from './components/header/Header';
import { isClient } from '../../utils/env/index';
import NewsList from './components/NewsList';
import CurrentPost from './components/CurrentPost';

class NewsFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDescriptionPosition: props.isVisibalePosition,
      reactions: ['All News Feed', 'Most Bullish', 'Most Bearish', 'Saved'],
      title: config('htmlPage.title.newsFeed'),
      topValue: 81,
      currentPostIndex: 0,
      currentPostType: 'top',
      ...this._getCurrenPostData(),
    };
  }

  _getCurrenPostData() {
    if (this.props.match.params.feedId) {
      const feedId = this.props.match.params.feedId.split('_')[0];
      let currentPostIndex = 0;
      let currentPostType = 'top';
      let i = 0;
      while (!currentPostIndex && this.props.topNews[i]) {
        if (feedId === this.props.topNews[i].id) {
          currentPostIndex = i;
        }
        i++;
      }
      if (!currentPostIndex) {
        currentPostType = 'recent';
      }
      i = 0;
      while (!currentPostIndex && this.props.news[i]) {
        if (feedId === this.props.news[i].id) {
          currentPostIndex = i;
        }
        i++;
      }
      return {
        currentPostIndex,
        currentPostType,
      };
    }
  }

  componentDidMount() {
    this.setState(this._getCurrenPostData());
  }

  setShowedDescription(position) {
    this.setState({
      showDescriptionPosition: position,
    });
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

  _setTitle(title) {
    this.setState({ title });
  }

  get hasMore() {
    if (this.props.news.length < 6) {
      return false;
    }
    return this.props.hasMore;
  }

  _onCurrentPostChange(type, index) {
    this.setState({
      currentPostType: type,
      currentPostIndex: index,
    });
  }

  get currentPost() {
    if (this.state.currentPostType === 'top') {
      return this.props.topNews[this.state.currentPostIndex];
    }
    return this.props.news[this.state.currentPostIndex];
  }

  render() {
    return (
      <Layout id="news" {...this.props}>
        <Helmet>
          <title>{this.state.title}</title>
          <meta
            name="description"
            content={config('htmlPage.description.newsFeed')}
          />
          <meta
            name="keywords"
            content={config('htmlPage.keywords.newsFeed')}
          />
        </Helmet>
        <section>
          <div className="guide np">
            <ul className="news-layout">
              <li ref={(ref) => { this.scrollParentRef = ref; }}>
                <Header
                  coins={this.props.coins}
                  sources={this.props.sources}
                  reactions={this.state.reactions}
                  onSourceSelect={this.props.onSourcesChange}
                  onSearch={this.props.onSearch}
                  _onResetSearch={this.props._onResetSearch}
                  _onReactionClick={this.props._onReactionClick}
                />
                <InfiniteScroll
                  loader={<MiniLoader style={{ width: '100%', marginTop: '20px', height: '30px' }} key={0} />}
                  loadMore={this.props.loadMore}
                  hasMore={this.props.hasMore}
                  useWindow={false}
                >
                  <ul className="news-row">
                    <li>
                      <div className="news-row-head">
                        Handpicked News Just For You
                      </div>
                      <NewsList
                        coins={this.props.coins}
                        page="/news"
                        news={this.props.topNews}
                        loadMore={this.props.loadMore}
                        hasMore={this.hasMore}
                        onCurrentPostChange={this._onCurrentPostChange.bind(this, 'top')}
                        redirectToCoin={this.redirectToCoin.bind(this)}
                      />
                    </li>
                    <li>
                      <div className="news-row-head">
                        Recent News
                      </div>
                      <NewsList
                        coins={this.props.coins}
                        page="/news"
                        news={this.props.news}
                        loadMore={this.props.loadMore}
                        hasMore={this.hasMore}
                        onCurrentPostChange={this._onCurrentPostChange.bind(this, 'recent')}
                        redirectToCoin={this.redirectToCoin.bind(this)}
                      />
                    </li>
                  </ul>
                </InfiniteScroll>
              </li>
              <li>
                <CurrentPost
                  post={this.currentPost}
                  coins={this.props.coins}
                  redirectToCoin={this.redirectToCoin.bind(this)}
                  show={this.props.singlePost}
                />
              </li>
            </ul>
          </div>
        </section>
      </Layout>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    isVisibalePosition: state.news.isVisibalePosition,
    hasMore: state.news.hasMore,
    coins: Object.values(state.coins.coinsById),
    sources: state.news.sources,
    news: state.news.news,
    topNews: state.news.topNews,
    user: ownProps.user || state.auth.user,
    isUserLoading: state.auth.isLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setActiveNavBar: activeBar =>
      dispatch(homeActions.setActiveNavBar(activeBar)),
    loadPortfolios: () => dispatch(portfoliosActions.loadPortfolios()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(NewsFeed));
