import { handleActions } from 'redux-actions';

const initialState = {
  title: '',
  metaTitle: '',
  metaURL: '',
  metaIMG: '',
  defaultURL: 'http://coin-stats.com',
  defaultIMG: 'http://coin-stats.com/imgs/favicon.png',
  defaultTitle: 'Coin Stats - Cryptocurrency research and portfolio tracker',
  actviveNavBar: { link: '/', active: false },
};

const homeReducer = handleActions(
  {
    SET_ACTVIVE_NAV_BAR: (state, { payload }) => {
      return {
        ...state,
        actviveNavBar: { link: payload.link, active: payload.active },
      };
    },
    CHANGE_TITLE: (state, { payload }) => {
      return {
        ...state,
        title: payload,
      };
    },
    CHANGE_METAS: (state, { payload }) => {
      return {
        ...state,
        metaTitle: payload.metaTitle,
        metaURL: payload.metaURL,
        metaIMG: payload.metaIMG,
      };
    },
  },
  initialState,
);

export default homeReducer;
