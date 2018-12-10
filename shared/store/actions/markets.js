import { createAction } from 'redux-actions';

import * as api from 'api';

export const fetchMarkets = createAction('LOAD_MARKETS', api.fetchMarkets);
export const fetchMarket = createAction('LOAD_MARKET', api.fetchMarket);
