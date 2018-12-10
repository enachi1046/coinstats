import { createAction } from 'redux-actions';

import * as api from 'api';

export const logIn = createAction('AUTH_LOG_IN', api.auth.logIn);
export const signUp = createAction('AUTH_LOG_IN', api.auth.signUp);
export const logInFB = createAction('AUTH_LOG_IN', api.auth.logInFB);
export const logInTW = createAction('AUTH_LOG_IN', api.auth.logInTW);
export const logOut = createAction('AUTH_LOG_OUT', api.auth.logOut);
export const requestPasswordReset = createAction('AUTH_REQUEST_PASSWORD_RESET', api.auth.requestPasswordReset);
export const setUser = createAction('AUTH_SET_USER');
export const toggleModal = createAction('AUTH_TOGGLE_MODAL');
export const toggleSubscriptionModal = createAction('TOGGLE_SUBSCRIPTION_MODAL');
export const setResetPasswordMessage = createAction('SET_RESET_PASSWORD_MESSAGE');
