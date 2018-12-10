import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import {
  FacebookIcon,
  TwitterIcon,
  TelegramIcon,
  RedditIcon,
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  RedditShareButton,
} from 'react-share';
import { isClient } from 'utils/env';
import { connect } from 'react-redux';
import { auth as authActions, news as newsActions } from 'store/actions';
import { differenceInDays } from 'utils/formating';

class SingleNews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showShare: false,
    };
  }

  get reactions() {
    let favorite = false;
    let bullish = false;
    let bearish = false;
    if (this.props.feed.reactions && this.props.user) {
      (this.props.feed || []).reactions.forEach((element) => {
        if (element === 1) {
          favorite = true;
        } else if (element === 2) {
          bullish = true;
        } else if (element === 3) {
          bearish = true;
        }
      });
    }
    return {
      favorite,
      bullish,
      bearish,
    };
  }

  _onTitleClick(event) {
    if (event.target.className.split(' ').indexOf('clicked') > 0) {
      this.props.showedDescription(-1);
      this.changeTitleAndLink(true);
    } else {
      this.props.showedDescription(this.props.position);
      this.changeTitleAndLink();
    }
    this.props.onTitleClick(this.props.position);
  }

  setReaction(reactionId) {
    if (this.props.user) {
      let addReaction = false;
      if (reactionId === 1) {
        addReaction = !this.reactions.favorite;
      } else if (reactionId === 2) {
        addReaction = !this.reactions.bullish;
      } else if (reactionId === 3) {
        addReaction = !this.reactions.bearish;
      }
      if (this.props.isSetReactionLoading) {
        return;
      }
      this.props.setReactionOnNews({
        reactionId,
        feedId: this.props.feed.id,
        addReaction,
      });
      this.props.setReaction(reactionId, this.props.feed.id, addReaction);
    } else {
      this.props.history.push('/signup');
    }
  }

  onShareClick() {
    this.setState({ showShare: !this.state.showShare });
  }

  changeTitleAndLink(toDefault) {
    if (toDefault) {
      this.props.onChangeTitle('Cryptocurrency News and Trends');
      this.props.history.push(this.props.page);
    } else {
      this.props.onChangeTitle(
        `Cryptocurrency News and Trends - ${this.props.feed.title}`,
      );
      const feedId = `${this.props.feed.id}_${this.props.feed.title.split(' ').join('-').replace('%', '')}`;
      this.props.history.push(`/news/${encodeURIComponent(feedId)}`);
    }
  }

  get socials() {
    const feed = this.props.feed;
    const shareURL =
      feed.shareURL ||
      `https://coinstats.app/news/${encodeURIComponent(
        `${feed.id}_${feed.title.split(' ').join('-')}`,
      )}`;
    if (this.state.showShare) {
      return (
        <div className="share-body">
          <div className="share-inner-body">
            <p className="show-mobile">Share</p>
            <div className="show-mobile icon-close" />
            <div className="share-inner">
              <div className="share-inner-c">
                <FacebookShareButton
                  url={shareURL}
                  title={feed.title}
                  description={feed.description}
                  image={feed.imgURL}
                >
                  <span className="show-mobile">Facebook</span>
                </FacebookShareButton>
                <TwitterShareButton
                  url={shareURL}
                  title={feed.title}
                  description={feed.description}
                  image={feed.imgURL}
                >
                  <span className="show-mobile">Twitter</span>
                </TwitterShareButton>
                <RedditShareButton
                  url={shareURL}
                  title={feed.title}
                  description={feed.description}
                  image={feed.imgURL}
                >
                  <span className="show-mobile">Reddit</span>
                </RedditShareButton>
                <TelegramShareButton
                  url={shareURL}
                  title={feed.title}
                  description={feed.description}
                  image={feed.imgURL}
                >
                  <span className="show-mobile">Telegram</span>
                </TelegramShareButton>
                <div className="SocialMediaShareButton SocialMediaShareButton--copylink">
                  <span className="show-mobile">Link</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return '';
  }

  render() {
    const feed = this.props.feed;
    if (!feed.description) {
      feed.description = '';
    }
    if (feed.description.length > 500) {
      const startPosition = feed.description.indexOf(' ', 496);
      feed.description = `${feed.description.slice(0, startPosition)} `;
    }
    if (!Number(feed.feedDate)) {
      feed.feedDate = new Date(feed.feedDate).getTime();
    }
    const urlTitle = feed.title.split(' ').join('-');
    const coinKeyWords = new Set();
    const coinPercent = new Set();
    const coinTitleKeyWords = new Set();
    const coinNameKeyWords = new Set();
    const coinIdKeyWords = new Set();
    let counter = 0;
    let maxInTop = 0;
    (this.props.coins || []).forEach((coin) => {
      (feed.relatedCoins || []).forEach((keyWord) => {
        if (
          (keyWord === coin.id.toLowerCase() ||
            keyWord === coin.name.toLowerCase() ||
            keyWord === coin.symbol.toLowerCase()) &&
          maxInTop < 500
        ) {
          if (counter < 3) {
            coinKeyWords.add(coin.symbol);
            coinPercent.add(coin.percentChange24h);
            ++counter;
          }
          coinTitleKeyWords.add(coin.symbol);
          coinNameKeyWords.add(coin.name);
          coinIdKeyWords.add(coin.id);
          ++maxInTop;
        }
      });
    });

    let readySoruceLink;
    if (feed.sourceLink.search('www') > 0) {
      readySoruceLink = feed.sourceLink.split('www.')[1];
    } else {
      readySoruceLink = feed.sourceLink.split('//')[1];
    }
    let FavoriteStar = (
      <div className="icon-star" onClick={() => this.setReaction(1)} />
    );
    if (this.reactions.favorite) {
      FavoriteStar = (
        <div className="icon-star active" onClick={() => this.setReaction(1)} />
      );
    }
    return (
      <ul
        className={`news-item ${this.props.isOpen ? 'active' : ''}`}
        id={feed.id}
      >
        <li>
          <div
            className="news-image"
            style={{
              backgroundImage: `url("${feed.imgURL}")`,
            }}
          />
          <div className="share-wrapper">
            {this.socials}
            <div className="share-head" onClick={this.onShareClick.bind(this)}>
              Share
            </div>
          </div>
        </li>
        <li>
          <h2 onClick={this._onTitleClick.bind(this)} title={feed.title}>
            {feed.title}
          </h2>
          <div className="news-minor">
            <span title={new Date(feed.feedDate)} id={feed.feedDate}>
              {differenceInDays(feed.feedDate)}{' '}
            </span>
            <a
              target="_blank"
              href={feed.link}
              className={`source-link ${this.props.isOpen ? 'active' : ''}`}
            >
              {readySoruceLink}
            </a>
          </div>
          <ul className="news-footer">
            <li>
              {FavoriteStar}
              <div className="rating">
                <span>bullish: </span>
                <span
                  data-reactionid="2"
                  className="rate-num text-up"
                  onClick={() => this.setReaction(2)}
                >
                  {this.props.feed.reactionsCount[2]
                    ? this.props.feed.reactionsCount[2]
                    : 0}
                </span>
              </div>
              <div className="rating">
                <span>bearish: </span>
                <span
                  data-reactionid="3"
                  className="rate-num text-down"
                  onClick={() => this.setReaction(3)}
                >
                  {this.props.feed.reactionsCount[3]
                    ? this.props.feed.reactionsCount[3]
                    : 0}
                </span>
              </div>
            </li>
            <li>
              {[...coinKeyWords].map((coin, i) => (
                <p
                  key={i}
                  data-coinname={[...coinNameKeyWords][i]}
                  className="news-stats cursor-pointer"
                  onClick={() =>
                    this.props.redirectToCoin([...coinIdKeyWords][i])
                  }
                >
                  <span>{coin}</span>
                  <span
                    className={
                      [...coinPercent][i] > 0 ? 'text-up' : 'text-down'
                    }
                  >
                    {` ${[...coinPercent][i]}`}%
                  </span>
                </p>
              ))}
            </li>
          </ul>
        </li>
      </ul>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    isSetReactionLoading: state.news.isSetReactionLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setReaction: (reactionId, feedId, addReaction) =>
      dispatch(newsActions.setReaction(reactionId, feedId, addReaction)),
    setReactionOnNews: (reactionId, feedId, addReaction) =>
      dispatch(newsActions.setReactionOnNews(reactionId, feedId, addReaction)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(SingleNews));
