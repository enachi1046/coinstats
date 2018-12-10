import { combineReducers } from 'redux';
import coinsReducer from './coins';
import newsReducer from './news';
import marketsReducer from './markets';
import authReducer from './auth';
import subscriptionReducer from './subscription';
import livePricesReducer from './livePrices';
import homeReducer from './home';
import uiReducer from './ui';
// import { routerReducer } from 'react-router-redux';

const appReducer = combineReducers({
  coins: coinsReducer,
  news: newsReducer,
  markets: marketsReducer,
  auth: authReducer,
  subscription: subscriptionReducer,
  livePrices: livePricesReducer,
  home: homeReducer,
  ui: uiReducer,
  // routing: routerReducer,
});

export default function (state, action) {
  return appReducer(state, action);
}
