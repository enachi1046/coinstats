import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Col, Row } from 'reactstrap';
import queryString from 'query-string';
import config from 'config';

import Layout from 'layouts/Blank';
import storage from 'utils/storage';
import MiniLoader from 'addons/MiniLoader';
import SectionIntro from 'components/SectionIntro';
import SectionFooter from 'components/SectionFooter';

import LivePricesSearch from './components/header/LivePricesSearch';
import Coins from './components/Coins';
import MainStats from './components/header/MainStats';
import Pagination from './components/header/Pagination';

class LivePrices extends React.Component {
  constructor(props) {
    super(props);

    this.orderedCoins = this.orderedCoins.bind(this);
  }

  orderedCoins() {
    if (this.props.orderKey === 'position') {
      if (this.props.orderDir === 'asc') {
        return this.props.coins
          .slice(
            this.props.coins.length - (this.props.start + this.props.pageSize),
            this.props.coins.length - this.props.start,
          )
          .reverse();
      }
      return this.props.coins.slice(
        this.props.start,
        this.props.start + this.props.pageSize,
      );
    }
    return this.props.coins
      .slice(this.props.start, this.props.start + this.props.pageSize)
      .sort((a, b) => {
        let k = 0;
        const orderKey = this.props.orderKey;
        if (a[orderKey] > b[orderKey]) {
          k = 1;
        }
        if (a[orderKey] < b[orderKey]) {
          k = -1;
        }
        if (a[orderKey] === b[orderKey]) {
          if (a.rank > b.rank) {
            return 1;
          } else {
            return -1;
          }
        }
        if (this.props.orderDir === 'asc') {
          k = -k;
        }
        return k;
      });
  }

  get markets() {
    if (
      this.props.isLoading &&
      (!this.props.market || !this.props.market.marketCap)
    ) {
      return (
        <div className="all-market">
          <div className="d-flex justify-content-center">
            <MiniLoader />
          </div>
        </div>
      );
    } else {
      return <MainStats stats={this.props.market} />;
    }
  }

  render() {
    const activeClass = {};
    const orderKeyClass = this.props.orderKey;
    if (this.props.orderDir === 'asc') {
      activeClass[orderKeyClass] = 'order_class_asc';
    } else {
      activeClass[orderKeyClass] = 'order_class_desc';
    }
    const pagination = (
      <Pagination
        totalPages={Math.floor(
          this.props.coins.length / this.props.pageSize + 1,
        )}
        currPage={this.props.currPage}
        orderDir={this.props.orderDir}
        orderKey={this.props.orderKey}
        pageSize={this.props.pageSize}
        onPageSizeChange={this.props.onPageSizeChange}
        onPrev={this.props.onPrevPage}
        onNext={this.props.onNextPage}
      />
    );
    return (
      <Layout id="livePrices" {...this.props} showFooter>
        <Helmet>
          <title>{config('htmlPage.title.livePrices')}</title>
          <meta
            name="description"
            content={config('htmlPage.description.livePrices')}
          />
          <meta
            name="keywords"
            content={config('htmlPage.keywords.livePrices')}
          />
        </Helmet>
        <section>
          <div className="guide">
            {this.markets}
            <ul className="search-and-pagination">
              <div className="search-wrapper">
                <LivePricesSearch />
              </div>
              <li className="pagination-holder">{pagination}</li>
            </ul>
            <Coins
              onOrderChange={this.props.onOrderChange}
              activeClass={activeClass}
              orderedCoins={this.orderedCoins()}
            />
            <ul className="search-and-pagination">
              <li className="pagination-holder">{pagination}</li>
            </ul>
          </div>
          <SectionIntro />
        </section>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.markets.isMarketLoading,
    market: state.markets.market,
    coins: Object.values(state.coins.coinsById).filter(c => !c.fiat),
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LivePrices);
