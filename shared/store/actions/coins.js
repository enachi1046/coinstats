import { createAction } from 'redux-actions';

import * as api from 'api';

export const fetchCoin = createAction('LOAD_CURRENT_COIN', api.coins.fetchCoin);
export const fetchSupportedExchanges = createAction(
  'FETCH_SUPPORTED_EXCHANES',
  api.coins.fetchSupportedExchanges,
);
export const loadAll = createAction('LOAD_COINS', api.coins.fetchCoins);

export const loadCoins = createAction('LOAD_COINS', api.fetchMarketData);
export const loadFiats = createAction('LOAD_FIATS', api.coins.fetchFiats);
export const loadChart = createAction('LOAD_CHART', api.portfolios.loadChart);
export const loadFavorites = createAction('LOAD_FAVORITES', api.loadFavorites);

export const switchMainPair = createAction('SWITCH_MAIN_PAIR');
export const toggleHideSmallAssets = createAction('TOGGLE_HIDE_SMALL_ASSETS');
export const toggleHideUnidentified = createAction('TOGGLE_HIDE_UNIDENTIFIED');
export const showChart = createAction('SHOW_CHART');
export const loadBTC = createAction('LOAD_BTC', api.coins.fetchCoin);
export const cleanOldUserPortfolios = createAction('CLEAN_PORTFOLIOS');

export const loadCoinChart = createAction(
  'CURRENT_COIN_CHART',
  api.coins.fetchCurrentCoinChart,
);
