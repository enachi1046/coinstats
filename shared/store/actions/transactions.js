import { createAction } from 'redux-actions';

import * as api from 'api';

export const addTransaction = createAction('ADD_TRANSACTION', api.transactions.addTransaction);
export const deleteTransaction = createAction('DELETE_TRANSACTION', api.transactions.deleteTransaction);
