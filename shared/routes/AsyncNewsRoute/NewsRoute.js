import React, { Component } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { Helmet } from 'react-helmet';
import { withCookies } from 'react-cookie';
import { isServer } from 'utils/env';
import NewsFeed from 'pages/NewsFeed';
import {
  home as homeActions,
  coins as coinsActions,
  news as newsActions,
  ui as uiActions,
} from 'store/actions';
import BaseAsyncRoute from '../_BaseAsyncRoute';

class NewsRoute extends BaseAsyncRoute {
  constructor(props) {
    super(props);
    this._onReactionClick = this._onReactionClick.bind(this);
    this._onSourcesChange = this._onSourcesChange.bind(this);
    this._onSearch = this._onSearch.bind(this);
    this._loadMore = this._loadMore.bind(this);
    this._onResetSearch = this._onResetSearch.bind(this);
  }

  bootstrap() {
    this.props.setActiveNavBar({ link: 'news', active: false });
    return this.props.loadCoins().then(this._loadData.bind(this));
  }

  componentDidMount() {
    this.props.setActiveNavBar({ link: 'news', active: false });
    if (!this.props.news.length) {
      this.props.loadCoins().then(this._loadData.bind(this));
    }
  }

  _loadData() {
    const promises = [
      this.props.fetchFeedTop(),
    ];
    if (this.props.match.params.feedId) {
      const feedId = this.props.match.params.feedId.split('_')[0];
      promises.push(this.props.fetchNewsFeed('byId', { id: feedId })
        .then((payload) => {
          return this.props.fetchMoreNewsFeed('', { limit: 19 });
        }));
      return Promise.all(promises);
    } else {
      const req = queryString.parse(this.props.location.search);
      let limit = req.limit;
      if (!limit) {
        limit = 20;
      }
      const result = {};
      return this.props.fetchNewsSources().then(() => {
        if (req.filter) {
          let reactionId;
          const limit = req.limit;
          if (req.filter === 'saved') {
            reactionId = 1;
          } else if (req.filter === 'most_bullish') {
            reactionId = 2;
          } else if (req.filter === 'most_bearish') {
            reactionId = 3;
          }
          if (reactionId === 2 || reactionId === 3) {
            promises.push(this.props.fetchNewsFeed('hotNewsByReaction', {
              limit,
              reactionId,
            }));
          } else if (reactionId === 1) {
            promises.push(this.props.fetchNewsFeed('favourite', {
              limit,
            }));
          }
          this.props.setReactionId(reactionId);
        } else if (req.keywords) {
          const limit = req.limit;
          const keyWords = req.keywords;
          result.keyWords = keyWords;
          promises.push(this.props.fetchNewsFeed('search', {
            limit,
            keyWords,
          }));
        } else {
          const lastFeedDate = req.lastfeeddate;
          const sourcesForReq = req.sources;
          const params = {
            limit,
          };
          if (lastFeedDate) {
            params.lastFeedDate = lastFeedDate;
          }
          if (sourcesForReq) {
            let readySourcesForReq = '';
            this.props.newsSources.forEach((source) => {
              sourcesForReq.split(',').forEach((s) => {
                if (s === source.webURL.split('//')[1]) {
                  readySourcesForReq += `${source.id},`;
                  source.checked = true;
                }
              });
            });
            readySourcesForReq.slice(0, -1);
            params.sources = readySourcesForReq;
          }
          promises.push(this.props.fetchNewsFeed('', params));
        }
        return Promise.all(promises);
      });
    }
  }

  _onReactionClick(reaction) {
    this.props.setKeyWord(null);
    const limit = 20;
    let reactionId;
    if (reaction.value === 'saved') {
      reactionId = 1;
    } else if (reaction.value === 'most bullish') {
      reactionId = 2;
    } else if (reaction.value === 'most bearish') {
      reactionId = 3;
    } else if (reaction.value === 'all news feed') {
      // this.props.history.push('/news');
      this.props.fetchNewsFeed('', {
        limit,
      });
    }
    this.props.setReactionId(reactionId);
    if (reactionId >= 2 && reactionId <= 3) {
      // this.props.history.push(`/news/?reaction=${reaction.value.split(' ').join('_')}`);
      this.props.fetchNewsFeed('hotNewsByReaction', {
        limit,
        reactionId,
      });
    } else if (reactionId === 1) {
      // this.props.history.push('/news');
      this.props.fetchNewsFeed('favourite', {
        limit,
      });
    }
  }

  _onSourcesChange(sources) {
    this.props.fetchNewsFeed('', {
      sources: sources.join(','),
    });
  }

  _onSearch(string) {
    const keyWord = string
      .split(', ')
      .join(' ')
      .split(' ')
      .join(',');
    this.props.setKeyWord(keyWord);
    this.props.setReactionId(null);
    // this.props.history.push(`/news/?keyWords=${keyWord}`);
    this.props.fetchNewsFeed('search', {
      keyWords: keyWord,
    });
  }

  _onResetSearch() {
    this.props.loadCoins().then(() => {
      this._loadData();
    });
  }

  _loadMore() {
    if (this.props.isNewsLoading) {
      return;
    }
    const params = {};
    if (!this.props.reactionId && !this.props.keyWord) {
      if (this.props.news.length > 0) {
        params.lastFeedDate = (
          this.props.news[this.props.news.length - 1] || {}
        ).feedDate;
        params.limit = 20;
        this.props.fetchMoreNewsFeed('', params);
      }
    } else if (this.props.reactionId === 1) {
      params.limit = 20;
      params.offset = this.props.offset * 20;
      this.props.fetchMoreNewsFeed('favorite', params);
    } else if (this.props.reactionId === 2 || this.props.reactionId === 3) {
      params.limit = 20;
      params.offset = this.props.offset * 20;
      params.reactionId = this.props.reactionId;
      this.props.fetchMoreNewsFeed('hotNewsByReaction', params);
    } else if (this.props.keyWord) {
      params.limit = 20;
      params.lastFeedDate = (
        this.props.news[this.props.news.length - 1] || {}
      ).feedDate;
      params.keyWords = this.props.keyWord;
      this.props.fetchMoreNewsFeed('search', params);
    }
  }

  render() {
    const req = queryString.parse(this.props.location.search);
    const firstPost = this.props.news[0];
    let metaTitle;
    if (firstPost) {
      metaTitle = firstPost.title;
    }

    return (
      <React.Fragment>
        <Helmet>
          <meta property="og:title" content={metaTitle} />
          <meta property="og:url" content={(firstPost || {}).link} />
          <meta property="og:image" content={(firstPost || {}).imgURL} />
          <meta property="og:type" content="website" />
        </Helmet>
        <NewsFeed
          keyWords={req.keywords ? req.keywords : ''}
          _onReactionClick={this._onReactionClick}
          loadMore={this._loadMore}
          onSourcesChange={this._onSourcesChange}
          onSearch={this._onSearch}
          _onResetSearch={this._onResetSearch}
          singlePost={this.props.singlePost}
          {...this.propsFromCookies}
        />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    keyWord: state.news.keyWord,
    offset: state.news.offset,
    hasMore: state.news.hasMore,
    reactionId: state.news.reactionId,
    isNewsLoading: state.news.isNewsLoading,
    isLoading: state.coins.isCoinsLoading,
    coins: Object.values(state.coins.coinsById),
    sources: state.news.sources,
    news: state.news.news,
    user: state.auth.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setDarkMode: isDark => dispatch(uiActions.setDarkMode(isDark)),
    setActiveNavBar: activeBar =>
      dispatch(homeActions.setActiveNavBar(activeBar)),
    setKeyWord: keyWord => dispatch(newsActions.setKeyWord(keyWord)),
    setVisibalePosition: position =>
      dispatch(newsActions.setVisibalePosition(position)),
    setHaseMore: value => dispatch(newsActions.setHaseMore(value)),
    loadCoins: () => dispatch(coinsActions.loadAll()),
    fetchNewsSources: () => dispatch(newsActions.fetchSources()),
    fetchNewsFeed: (action, params) =>
      dispatch(newsActions.fetchFeed(action, params)),
    fetchMoreNewsFeed: (action, params) =>
      dispatch(newsActions.fetchMoreFeed(action, params)),
    fetchFeedTop: () =>
      dispatch(newsActions.fetchFeedTop()),
    setReactionId: id => dispatch(newsActions.setRactionId(id)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withCookies(NewsRoute));
