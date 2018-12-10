import { handleActions } from 'redux-actions';
import { log } from 'util';

const initialState = {
  rowsperpage: 100,
  start: 0,
  orderKey: 'marketCap',
  orderDir: 'asc',
};

const livePricesReducer = handleActions(
  {
    SET_START: (state, { payload }) => {
      return {
        ...state,
        start: payload,
      };
    },
    SET_ROWS_PER_PAGE: (state, { payload }) => {
      return {
        ...state,
        rowsperpage: payload,
      };
    },
    REORDER: (state, { payload }) => {
      return {
        ...state,
        orderKey: payload.newKey,
        orderDir: payload.newDir,
      };
    },
  },
  initialState,
);

export default livePricesReducer;
