import { handleActions } from 'redux-actions';

const initialState = {
  isModalOpen: false,
};

const subsribeReducer = handleActions(
  {
    TOGGLE_SUBSCRIPTION_MODAL: (state, { payload }) => {
      document.getElementsByTagName('body')[0].classList.toggle('background-overflow');
      return {
        ...state,
        isModalOpen: !state.isModalOpen,
      };
    },
  },
  initialState,
);

export default subsribeReducer;
