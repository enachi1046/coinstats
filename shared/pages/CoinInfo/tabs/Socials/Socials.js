import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { isClient } from 'utils/env/index';

import TwitterIFrame from '../../components/TwitterIFrame';
import RedditIFrame from '../../components/RedditIFrame';

class SocialsTab extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (isClient()) {
      const href = window.location.href.split('/');
      const tab = href[href.length - 1];
      if (tab === 'socials') {
        this.props.onTitleChange(
          `${this.props.coin.name} (${
            this.props.coin.symbol
          }/USD) Price | Cryptocurrency News | Coin Stats`,
        );
        this.props.onDescriptionChange(
          `Cryptocurrency news, updates and discussions from social media; Twitter and Reddit. Coin Stats provides ${
            this.props.coin.name
          } (${
            this.props.coin.symbol
          }) latest news, price changes, charts, market cap, volume...`,
        );
        this.props.onKeyWordsChange(
          `${
            this.props.coin.name
          } price, ${this.props.coin.symbol.toLowerCase()} news, ${this.props.coin.name.toLowerCase()} news, ${this.props.coin.symbol.toLowerCase()} twitter, ${this.props.coin.symbol.toLowerCase()} reddit, cryptocurrency news, ${this.props.coin.name.toLowerCase()} chart, ${
            this.props.coin.symbol
          } chart, cryptocurrency, crypto news`,
        );
      }
    }
  }

  render() {
    const { coin } = this.props;
    return (
      <div className="coin-info-socials">
        <Row>
          <Col md={6}>
            {coin.twitterUrl ? <TwitterIFrame url={coin.twitterUrl} /> : null}
          </Col>
          <Col md={6}>
            {coin.redditUrl ? <RedditIFrame url={coin.redditUrl} /> : null}
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    news: state.news.newsByCoin || [],
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SocialsTab);
