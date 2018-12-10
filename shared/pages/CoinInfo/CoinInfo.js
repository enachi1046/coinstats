import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Row, Col, Card, CardBody, Nav, NavItem, NavLink } from 'reactstrap';
import config from 'config';
import Link from 'react-router-dom/Link';
import Layout from 'layouts/Blank';

import { Helmet } from 'react-helmet';
import storage from 'utils/storage';
import Loader from 'addons/Loader';

import NameCol from './components/NameCol';
import VolumeCol from './components/VolumeCol';
import Links from './components/Links';

import NewsTab from './tabs/News';
import MarketsTab from './tabs/Markets';
import SocialsTab from './tabs/Socials';
import HoldingsTab from './tabs/Holdings';
import ChartTab from './tabs/Chart';

const metaTags = (symbol, price) => {
  switch (symbol) {
    case 'EOS':
      return (
        <script type="application/ld+json">
          {`"@context": "http://schema.org",
          "@type": "Product",
          "name": "EOS",
          "image":"https://api.coin-stats.com/api//files/812fde17aea65fbb9f1fd8a478547bde/8185ae6eaeded75c4729f6393129d98c_1765.png",
          "description": "EOS price, charts and market cap for today. All the latest cryptocurrency news and trends.",
          "offers": {
            "@type": "Offer",
            "price": ${price},
            "priceCurrency": "USD"
          }`}
        </script>
      );
    case 'BTC':
      return (
        <script type="application/ld+json">
          {`"@context": "http://schema.org",
          "@type": "Product",
          "name": "Bitcoin",
          "image":"https://api.coin-stats.com/api//files/812fde17aea65fbb9f1fd8a478547bde/f3738cc5df5f59afb57111d67d951170_1.png",
          "description":"Bitcoin (BTC) price, charts and market cap for today. All the latest cryptocurrency news and trends.",
          "offers": {
            "@type": "Offer",
            "price": ${price},
            "priceCurrency": "USD"
          }`}
        </script>
      );
    case 'ETH':
      return (
        <script type="application/ld+json">
          {`"@context": "http://schema.org",
          "@type": "Product",
          "name": "Ethereum",
          "image":"https://api.coin-stats.com/api//files/812fde17aea65fbb9f1fd8a478547bde/e1259737fa19af705f0207d5b384c37e_1027.png",
          "description": "Ethereum (ETH) price, charts and market cap for today. All the latest cryptocurrency news and trends.",
          "offers": {
            "@type": "Offer",
            "price": ${price},
            "priceCurrency": "USD"
          }`}
        </script>
      );
    case 'XRP':
      return (
        <script type="application/ld+json">
          {`"@context": "http://schema.org",
          "@type": "Product",
          "name": "XRP",./r
          "image":"https://api.coin-stats.com/api//files/812fde17aea65fbb9f1fd8a478547bde/f4f2f3a21bc4692c79d66d0b12f15c61_xrp.png",
          "description": "XRP price, charts and market cap for today. All the latest cryptocurrency news and trends.",
          "offers": {
            "@type": "Offer",
            "price": ${price},
            "priceCurrency": "USD"
          }`}
        </script>
      );
    default:
      return '';
  }
};

const NEWS_NAV_TABS = [
  {
    id: 'chart',
    label: 'CHART',
    component: ChartTab,
  },
  {
    id: 'socials',
    label: 'SOCIAL',
    component: SocialsTab,
  },
  {
    id: 'news',
    label: 'NEWS',
    component: NewsTab,
  },
  {
    id: 'markets',
    label: 'MARKETS',
    component: MarketsTab,
  },
  {
    id: 'holdings',
    label: 'HOLDINGS',
    component: HoldingsTab,
  },
];

class CoinInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: `${props.coin.name} (${
        props.coin.symbol
      }/USD) Price, Charts, Market cap | Coin Stats`,
      description: `Get everything you need to know about ${props.coin.name} (${
        props.coin.symbol
      }) price, charts and market cap. All the latest cryptocurrency news and trends. Find the latest and most accurate ethereum live price on Coin Stats.`,
      keyWords: `${
        props.coin.name
      }, ${props.coin.name.toLowerCase()} price, buy ${props.coin.name.toLowerCase()}, ${props.coin.name.toLowerCase()} usd, ${props.coin.name.toLowerCase()} price usd, ${props.coin.name.toLowerCase()} value, ${props.coin.name.toLowerCase()} chart, ${props.coin.symbol.toLowerCase()} value, ${
        props.coin.symbol
      } chart, ${props.coin.symbol.toLowerCase()} price, cryptocurrency, crypto coin, market cap, digital currency, crypto market, ${props.coin.symbol.toLowerCase()}`,
    };
  }

  componentDidMount() {
    this.setState({
      title: `Find ${this.props.coin.name} (${
        this.props.coin.symbol
      }) live price and charts`,
      description: `Get everything you need to know about ${
        this.props.coin.name
      } (${
        this.props.coin.symbol
      }) price, charts and market cap. All the latest cryptocurrency news and trends. Find the latest and most accurate ethereum live price on Coin Stats.`,
      keyWords: `${
        this.props.coin.name
      }, ${this.props.coin.name.toLowerCase()} price, buy ${this.props.coin.name.toLowerCase()}, ${this.props.coin.name.toLowerCase()} usd, ${this.props.coin.name.toLowerCase()} price usd, ${this.props.coin.name.toLowerCase()} value, ${this.props.coin.name.toLowerCase()} chart, ${this.props.coin.symbol.toLowerCase()} value, ${
        this.props.coin.symbol
      } chart, ${this.props.coin.symbol.toLowerCase()} price, cryptocurrency, crypto coin, market cap, digital currency, crypto market, ${this.props.coin.symbol.toLowerCase()}`,
    });
    window.scrollTo(0, 0);
  }

  onTitleChange(title) {
    this.setState({ title });
  }

  onDescriptionChange(description) {
    this.setState({ description });
  }

  onKeyWordsChange(keyWords) {
    this.setState({ keyWords });
  }

  get activeTab() {
    const activeTabId = this.props.match.params.tab;
    if (!activeTabId) {
      return NEWS_NAV_TABS[0];
    }
    return (
      NEWS_NAV_TABS.filter((tab) => {
        return tab.id === activeTabId;
      })[0] || NEWS_NAV_TABS[0]
    );
  }

  get coin() {
    return this.props.coin;
  }

  render() {
    if (!this.coin) {
      return <Loader />;
    }
    const coin = this.coin;
    const ActiveTabElement = this.activeTab.component;
    return (
      <Layout id="coinInfo" {...this.props}>
        <Helmet>
          {metaTags(coin.symbol, coin.price)}
          <title>{this.state.title}</title>
          <meta name="description" content={this.state.description} />
          <meta name="keywords" content={this.state.keyWords} />
        </Helmet>
        <section style={{ marginTop: '30px' }}>
          <div className="guide">
            <div className="coin-info-header">
              <Row noGutters>
                <Col
                  className="order-1
                            order-md-1
                            col-12
                            col-xl-auto"
                >
                  <NameCol
                    id={this.coin.id}
                    BTC={this.props.BTC}
                    iconUrl={this.coin.iconUrl}
                    name={this.coin.name}
                    symbol={this.coin.symbol}
                    price_btc={this.coin.bitcoinPrice}
                    price_usd={this.coin.price}
                    percentChange24h={this.coin.percentChange24h}
                  />
                </Col>
                <Col
                  className="order-2
                            order-md-2
                            col-12
                            col-md-auto
                            col-lg"
                >
                  <VolumeCol
                    volume_usd_24h={this.coin.volume24h}
                    available_supply={this.coin.availableSupply}
                    symbol={this.coin.symbol}
                    total_supply={this.coin.totalSupply}
                    market_cap_usd={this.coin.marketCap}
                    percentChange1h={this.coin.percentChange1h}
                    percentChange24h={this.coin.percentChange24h}
                    percentChange7d={this.coin.percentChange7d}
                  />
                </Col>
                <Col
                  className="order-3
                            order-md-3
                            col-12
                            col-md
                            col-lg-auto"
                >
                  <Links
                    id={this.coin.id}
                    symbol={this.coin.symbol}
                    explorers={this.coin.explorers}
                    rank={this.coin.rank}
                    webSite={this.coin.websiteUrl}
                  />
                </Col>
              </Row>
            </div>
            <Card className="coin-info-card mt-3">
              <Nav className="coin-info-tabs">
                {NEWS_NAV_TABS.map((item, ind) => {
                  return (
                    <NavItem
                      key={item.id}
                      active={item.id === this.activeTab.id}
                    >
                      <Link
                        className={`nav-link ${
                          item.id === this.activeTab.id ? 'active' : ''
                        }`}
                        onClick={() => this.props.onTabChange(item.id)}
                        to={`/liveprices/${this.coin.id}/${item.id}`}
                      >
                        {item.label}
                      </Link>
                    </NavItem>
                  );
                })}
              </Nav>
              <CardBody>
                <ActiveTabElement
                  coin={coin}
                  coinid={this.coin.id}
                  _loadMoreNews={this.props._loadMoreNews}
                  onTitleChange={this.onTitleChange.bind(this)}
                  onDescriptionChange={this.onDescriptionChange.bind(this)}
                  onKeyWordsChange={this.onKeyWordsChange.bind(this)}
                />
              </CardBody>
            </Card>
          </div>
        </section>
      </Layout>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    BTC: state.coins.BTC,
    coinsById: state.coins.coinsById,
    news: state.news.newsByCoin || [],
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(CoinInfo));
