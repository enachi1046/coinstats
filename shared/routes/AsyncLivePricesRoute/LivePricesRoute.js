import React, { Component } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { withCookies } from 'react-cookie';
import LivePrices from 'pages/LivePrices';
import { isClient } from 'utils/env/index';
import {
  coins as coinsActions,
  markets as marketsActions,
  livePrices as livePricesActions,
  home as homeActions,
  ui as uiActions,
} from 'store/actions';
import BaseAsyncRoute from '../_BaseAsyncRoute';

class LivePricesRoute extends BaseAsyncRoute {
  constructor(props) {
    super(props);
    const req = queryString.parse(this.props.location.search);
    let rowsperpage;
    let start;
    let currPage;
    if (req.orderdir || req.orderkey) {
      if (req.orderkey && req.orderdir) {
        this.props.reorder({ newKey: req.orderkey, newDir: req.orderdir });
      }
      if (req.orderkey && !req.orderdir) {
        this.props.reorder({ newKey: req.orderkey, newDir: this.props.orderDir });
      }
      if (!req.orderkey && req.orderdir) {
        this.props.reorder({ newKey: this.props.orderKey, newDir: req.orderkey });
      }
    }
    if (req.pagesize) {
      rowsperpage = req.pagesize === 'show-all' ? this.props.coins.length : Number(req.pagesize);
    }
    if (Number(req.page)) {
      if (rowsperpage) {
        start = (Number(req.page) - 1) * rowsperpage;
      } else {
        start = 0;
      }
      currPage = Number(req.page);
    }
    this.state = {
      pageSize: rowsperpage || 20,
      currPage: currPage || 1,
      start: start || 0,
    };
  }

  bootstrap() {
    this.props.setActiveNavBar({ link: 'liveprices', active: false });
    const promises = [
      this.props.fetchMarket(),
      this.props.loadCoins(),
    ];
    const req = queryString.parse(this.props.location.search);
    if (!req.orderdir && !req.orderkey) {
      promises.push(this.props.reorder({ newKey: 'marketCap', newDir: 'asc' }));
    }
    return Promise.all(promises);
  }

  componentDidMount() {
    this.props.setActiveNavBar({ link: 'liveprices', active: false });
    this.props.fetchMarket().then(() => {
      this.props.loadCoins();
      const req = queryString.parse(this.props.location.search);
      if (!req.orderdir && !req.orderkey) {
        this.props.reorder({ newKey: 'marketCap', newDir: 'asc' });
      }
    });
  }

  _onPageSizeChange(newPageCount) {
    let count = newPageCount;
    if (newPageCount === 'show-all') {
      count = this.props.coins.length;
    }
    this.setState({ pageSize: count, currPage: 1, start: 0 });
    if (isClient()) {
      const req = queryString.parse(this.props.location.search);
      let orderkey;
      let orderdir;
      if (req.orderkey) {
        orderkey = req.orderkey;
      }
      if (req.orderdir) {
        orderdir = req.orderdir;
      }
      this.props.history.push(`?pagesize=${newPageCount}&page=1${
        orderkey ? `&orderkey=${orderkey}` : ''}${
        orderdir ? `&orderdir=${orderdir}` : ''}`);
    }
  }

  _onPaginationNextClick() {
    const rowsperpage = this.state.pageSize;
    let start = this.state.start;
    const coinsLength = this.props.coins.length;
    if (start + rowsperpage < coinsLength) {
      start += rowsperpage;
      const currPage = ++this.state.currPage;
      this.setState({ start, currPage });
      if (isClient()) {
        const req = queryString.parse(this.props.location.search);
        let orderkey;
        let orderdir;
        if (req.orderkey) {
          orderkey = req.orderkey;
        }
        if (req.orderdir) {
          orderdir = req.orderdir;
        }
        this.props.history.push(`?pagesize=${rowsperpage}&page=${currPage}${
          orderkey ? `&orderkey=${orderkey}` : ''}${
          orderdir ? `&orderdir=${orderdir}` : ''}`);
      }
    }
  }

  _onPaginationPreviousClick() {
    const rowsperpage = this.state.pageSize;
    let start = this.state.start;
    if (start - rowsperpage >= 0) {
      start -= rowsperpage;
      const currPage = --this.state.currPage;
      this.setState({ start });
      if (isClient()) {
        const req = queryString.parse(this.props.location.search);
        let orderkey;
        let orderdir;
        if (req.orderkey) {
          orderkey = req.orderkey;
        }
        if (req.orderdir) {
          orderdir = req.orderdir;
        }
        this.props.history.push(`?pagesize=${rowsperpage}&page=${currPage}${
          orderkey ? `&orderkey=${orderkey}` : ''}${
          orderdir ? `&orderdir=${orderdir}` : ''}`);
      }
    }
  }

  _onOrderChange(key) {
    let newDir;
    const newKey = key;
    if (this.props.orderKey === key) {
      if (this.props.orderDir === 'asc') {
        newDir = 'desc';
      } else {
        newDir = 'asc';
      }
    } else if (key === 'position' || key === 'name' || key === 'percentChange24h') {
      newDir = 'desc';
    } else {
      newDir = 'asc';
    }
    const req = queryString.parse(this.props.location.search);
    let pagesize;
    let page;
    if (Number(req.pagesize)) {
      pagesize = Number(req.pagesize);
    }
    if (Number(req.page)) {
      page = Number(req.page);
    }
    this.props.history.push(`?${
      pagesize ? `&pagesize=${pagesize}` : ''}${
      page ? `&page=${page}` : ''}&orderkey=${newKey}&orderdir=${newDir}`);
    this.props.reorder({ newKey, newDir });
  }

  render() {
    const orderKey = this.props.orderKey;
    const orderDir = this.props.orderDir;
    return (
      <LivePrices
        {...this.propsFromCookies}
        currPage={this.state.currPage}
        start={this.state.start}
        orderKey={orderKey}
        orderDir={orderDir}
        pageSize={this.state.pageSize}
        onOrderChange={this._onOrderChange.bind(this)}
        onPageSizeChange={this._onPageSizeChange.bind(this)}
        onPrevPage={this._onPaginationPreviousClick.bind(this)}
        onNextPage={this._onPaginationNextClick.bind(this)}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    orderKey: state.livePrices.orderKey,
    orderDir: state.livePrices.orderDir,
    isLoading: state.markets.isMarketLoading,
    market: state.markets.market,
    coins: Object.values(state.coins.coinsById),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setDarkMode: isDark => dispatch(uiActions.setDarkMode(isDark)),
    setActiveNavBar: activeBar => dispatch(homeActions.setActiveNavBar(activeBar)),
    loadCoins: () => dispatch(coinsActions.loadAll()),
    fetchMarket: () => dispatch(marketsActions.fetchMarket()),
    setStart: newValue => dispatch(livePricesActions.setStart(newValue)),
    setRowsPerPage: newValue => dispatch(livePricesActions.setRowsPerPage(newValue)),
    reorder: newValue => dispatch(livePricesActions.reorder(newValue)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withCookies(LivePricesRoute));
