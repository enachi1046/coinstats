import { createAction } from 'redux-actions';

import * as api from 'api';

export const fetchNewsByCoin = createAction('LOAD_NEWS_BY_COIN', api.fetchNewsByCoin);
export const fetchSources = createAction('LOAD_NEWS_SOURCES', api.fetchSources);
export const fetchFeed = createAction('LOAD_NEWS_FEED', api.fetchNewsFeed);
export const fetchFeedTop = createAction('LOAD_NEWS_TOP', api.fetchTopNews);
export const setRactionId = createAction('SET_REACTION_ID');
export const setReaction = createAction('SET_REACTION', api.setReaction);
export const fetchMoreFeed = createAction('LOAD_MORE_NEWS', api.fetchNewsFeed);
export const fetchMoreFeedById = createAction('LOAD_MORE_NEWS_BY_ID', api.fetchNewsFeed);
export const setHaseMore = createAction('SET_HASE_MORE');
export const setVisibalePosition = createAction('SET_VISIBALE_POSITION');
export const setKeyWord = createAction('SET_KEY_WORD');
export const setReactionOnNews = createAction('SET_REACTION_ON_FEED');
