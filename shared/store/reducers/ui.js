import { handleActions } from 'redux-actions';
import storage from 'utils/storage';

const initialState = {
  darkMode: true,
  hideSmallAssets: false,
  hideUnidentified: false,
  isImportCSVModalOpen: false,
};

const uiReducer = handleActions({
  TOGGLE_DARK_MODE: (state, { payload }) => {
    const darkMode = !state.darkMode;
    if (darkMode) {
      document.cookie = 'mode=dark';
    } else {
      document.cookie = 'mode=light';
    }
    return {
      ...state,
      darkMode,
    };
  },
  SET_DARK_MODE: (state, { payload }) => {
    const darkMode = payload;
    if (darkMode) {
      document.cookie = 'mode=dark';
    } else {
      document.cookie = 'mode=light';
    }
    return {
      ...state,
      darkMode,
    };
  },
  TOGGLE_HIDE_SMALL_ASSETS(state, { payload }) {
    storage.setItem('HIDE_SMALL_ASSETS', !state.hideSmallAssets);
    return {
      ...state,
      hideSmallAssets: !state.hideSmallAssets,
    };
  },
  SET_HIDE_SMALL_ASSETS(state, { payload }) {
    storage.setItem('HIDE_SMALL_ASSETS', payload);
    return {
      ...state,
      hideSmallAssets: payload,
    };
  },
  TOGGLE_HIDE_UNIDENTIFIED(state, { payload }) {
    storage.setItem('HIDE_UNIDENTIFIED', !state.hideUnidentified);
    return {
      ...state,
      hideUnidentified: !state.hideUnidentified,
    };
  },
  SET_HIDE_UNIDENTIFIED(state, { payload }) {
    storage.setItem('HIDE_UNIDENTIFIED', payload);
    return {
      ...state,
      hideUnidentified: payload,
    };
  },
  TOGGLE_IMPORT_CSV_MODAL: (state, { payload }) => {
    document.getElementsByTagName('body')[0].classList.toggle('background-overflow');
    return {
      ...state,
      isImportCSVModalOpen: !state.isImportCSVModalOpen,
    };
  },
}, initialState);

export default uiReducer;
