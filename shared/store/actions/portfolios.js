import { createAction } from 'redux-actions';

import * as api from 'api';

export const addPortfolio = createAction('ADD_PORTFOLIO', api.portfolios.addPortfolio);
export const deletePortfolio = createAction('DELETE_PORTFOLIO', api.portfolios.deletePortfolio);
export const loadPortfolios = createAction('LOAD_PORTFOLIOS', api.portfolios.fetchUserPortfolios);
export const loadSingleCoinTranscations = createAction(
  'LOAD_CURRENT_COIN_TRANSACTIONS',
  api.portfolios.loadSingleCoinTranscations,
);
export const loadAllForCurrentTransaction = createAction(
  'LOAD_ALL_CURRENT_COIN_TRANSACTIONS',
  api.portfolios.loadAllForCurrentTransaction,
);
export const updateWallet = createAction('UPDATE_WALLET', api.portfolios.updateWallet);
export const updateExchange = createAction('UPDATE_EXCHANGE', api.portfolios.updateExchange);
export const loadChart = createAction('LOAD_CHART', api.portfolios.loadChart);
export const importCSV = createAction('IMPORT_CSV', api.portfolios.importCSV);

export const showChart = createAction('SHOW_CHART');
export const setActiveTab = createAction('SET_ACTIVE_TAB');
export const loadPortfolio = createAction('LOAD_PORTFOLIO', api.portfolios.fetchUserPortfolio);
