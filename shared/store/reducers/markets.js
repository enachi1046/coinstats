import { handleActions } from 'redux-actions';
import { log } from 'util';

const initialState = {
  market: [],
  markets: [],
  isMarketLoading: false,
  isMarketsLoading: false,
};

const livePricesReducer = handleActions(
  {
    LOAD_MARKET: (state, { isLoading: isMarketLoading, payload }) => {
      if (isMarketLoading) {
        return {
          ...state,
          isMarketLoading,
        };
      }
      return {
        ...state,
        isMarketLoading,
        market: payload,
      };
    },
    LOAD_MARKETS: (state, { isLoading: isMarketsLoading, error, payload }) => {
      if (isMarketsLoading) {
        return {
          ...state,
          isMarketsLoading,
          error,
        };
      }
      return {
        ...state,
        isMarketsLoading,
        error,
        markets: payload,
      };
    },
  },
  initialState,
);

export default livePricesReducer;
