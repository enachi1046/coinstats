import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
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

import { auth as authActions, news as newsActions } from 'store/actions';
import MiniLoader from 'addons/MiniLoader';
import storage from 'utils/storage';
import { differenceInDays } from 'utils/formating';

class CurrentPost extends Component {
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
    if (this.props.post.reactions && this.props.user) {
      (this.props.post || {}).reactions.forEach((element) => {
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
        postId: this.props.post.id,
        addReaction,
      });
      this.props.setReaction(reactionId, this.props.post.id, addReaction);
    } else {
      this.props.history.push('/signup');
    }
  }

  get socials() {
    const post = this.props.post;
    const shareURL =
      post.shareURL ||
      `https://coinstats.app/news/${encodeURIComponent(
        `${post.id}_${post.title.split(' ').join('-')}`,
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
                  title={post.title}
                  description={post.description}
                  image={post.imgURL}
                >
                  <span className="show-mobile">Facebook</span>
                </FacebookShareButton>
                <TwitterShareButton
                  url={shareURL}
                  title={post.title}
                  description={post.description}
                  image={post.imgURL}
                >
                  <span className="show-mobile">Twitter</span>
                </TwitterShareButton>
                <RedditShareButton
                  url={shareURL}
                  title={post.title}
                  description={post.description}
                  image={post.imgURL}
                >
                  <span className="show-mobile">Reddit</span>
                </RedditShareButton>
                <TelegramShareButton
                  url={shareURL}
                  title={post.title}
                  description={post.description}
                  image={post.imgURL}
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

  onShareClick() {
    this.setState({ showShare: !this.state.showShare });
  }

  render() {
    const post = this.props.post;
    if (!post) {
      return null;
    }
    let video = null;
    if (post.link.indexOf('youtube') > -1) {
      video = (
        <div className="video-wrapper">
          <iframe
            title={post.title}
            src={post.link.replace('/watch?v=', '/embed/')}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
    if (!post) {
      return null;
    }
    if (!post.description) {
      post.description = '';
    }
    if (post.description.length > 500) {
      const startPosition = post.description.indexOf(' ', 496);
      post.description = `${post.description.slice(0, startPosition)} `;
    }
    if (!Number(post.feedDate)) {
      post.feedDate = new Date(post.feedDate).getTime();
    }
    const urlTitle = post.title.split(' ').join('-');
    const coinKeyWords = new Set();
    const coinPercent = new Set();
    const coinTitleKeyWords = new Set();
    const coinNameKeyWords = new Set();
    const coinIdKeyWords = new Set();
    let counter = 0;
    let maxInTop = 0;
    (this.props.coins || []).forEach((coin) => {
      (post.relatedCoins || []).forEach((keyWord) => {
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
    if (post.sourceLink.search('www') > 0) {
      readySoruceLink = post.sourceLink.split('www.')[1];
    } else {
      readySoruceLink = post.sourceLink.split('//')[1];
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
      <div className={`full-news-mobile-wrapper ${this.props.show ? 'show' : ''}`}>
        {/* Toggle show class for mobile version */}
        <ul className="news-splash-full news-item" id={post.id}>
          <li>
            <div
              className="news-image"
              style={{
                backgroundImage: `url(${post.imgURL})`,
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
            <Link className="icon-close show-mobile" to="/news" />
            <h2 title={post.title}>
              {post.title}
            </h2>
            <div className="news-full-details">
              {video}
              <p>
                {post.description}
                <a className="read-source" href={post.sourceLink} target="_blank">
                  […]
                </a>
              </p>
            </div>
            <div className="news-minor">
              <span title={new Date(post.feedDate)} id={post.feedDate}>
                {differenceInDays(post.feedDate)}{' '}
              </span>
              <a
                target="_blank"
                href={post.link}
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
                    {post.reactionsCount[2]
                      ? post.reactionsCount[2]
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
                    {post.reactionsCount[3]
                      ? post.reactionsCount[3]
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
      </div>
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

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(CurrentPost));
