import { handleActions } from 'redux-actions';
import storage from 'utils/storage';
import { Base64 } from 'js-base64';

const initialState = {
  user: null,
  error: '',
  isLoading: false,
  token: storage.getItem('SESSION_TOKEN'),
  hasUnlimited: storage.getItem('HAS_UNLIMITED') && storage.getItem('HAS_UNLIMITED') !== 'false',
  isModalOpen: false,
  resetPasswordMessage: null,
};

const authReducer = handleActions(
  {
    SET_RESET_PASSWORD_MESSAGE: (state) => {
      return {
        ...state,
        resetPasswordMessage: null,
      };
    },
    AUTH_SET_USER: (state, { payload }) => {
      let user = payload.user;
      if (user.toJSON) {
        user = user.toJSON();
      }
      if (typeof document !== 'undefined') {
        const userData = Base64.encode(JSON.stringify(user));
        document.cookie = `userData=${userData};`;
      }
      return {
        ...state,
        user,
      };
    },
    AUTH_LOG_IN: (state, { payload, isLoading, error = '' }) => {
      if (isLoading || error) {
        return {
          ...state,
          isLoading,
          error,
        };
      }
      storage.setItem('HAS_UNLIMITED', payload.result.hasUnlimitedAccess || false);
      storage.setItem('SESSION_TOKEN', payload.result.sessionToken);
      let user = payload.user;
      if (user.toJSON) {
        user = user.toJSON();
      }
      return {
        ...state,
        user,
        error,
        isLoading,
        token: payload.result.sessionToken,
        hasUnlimited: payload.result.hasUnlimitedAccess,
      };
    },
    AUTH_LOG_OUT: (state, { isLoading, payload }) => {
      storage.removeItem('HAS_UNLIMITED');
      storage.removeItem('SESSION_TOKEN');
      return {
        ...state,
        user: null,
        isLoading,
        token: null,
        hasUnlimited: false,
      };
    },
    AUTH_TOGGLE_MODAL: (state, { payload }) => {
      let isModalOpen;
      if (typeof payload !== 'undefined') {
        isModalOpen = payload;
      } else {
        isModalOpen = !state.isModalOpen;
      }
      return {
        ...state,
        isModalOpen,
      };
    },
    AUTH_REQUEST_PASSWORD_RESET: (state, { error, isLoading, payload }) => {
      if (isLoading || error) {
        return {
          ...state,
          isLoading,
          error,
        };
      }
      let resetPasswordMessage = '';
      if (payload === 'social') {
        resetPasswordMessage = "It seems you're logged in with social account. Try to login with Facebook or Twitter";
      }
      return {
        ...state,
        resetPasswordMessage,
        isLoading,
        error,
      };
    },
  },
  initialState,
);

export default authReducer;
