import { handleActions } from 'redux-actions';

const initialState = {
  sources: [],
  news: [],
  topNews: [],
  newsByCoin: [],
  isNewsLoading: false,
  isTopNewsLoading: false,
  isNewsByCoinLoading: false,
  isSetReactionLoading: false,
  setReactionError: '',
  reactionId: null,
  keyWord: null,
  hasMore: true,
  hasMoreById: true,
  offset: 1,
  isVisibalePosition: -1,
};

const updateReaction = (payload, feed) => {
  if (parseInt(feed.id) === parseInt(payload.feedId)) {
    if (payload.addReaction) {
      if (payload.reactionId === 1) {
        feed.reactions.push(1);
      } else {
        if (payload.reactionId === 2 && feed.reactionsCount[3]) {
          feed.reactionsCount[3] -= 1;
        } else if (payload.reactionId === 3 && feed.reactionsCount[2]) {
          feed.reactionsCount[2] -= 1;
        }
        if (feed.reactionsCount[payload.reactionId]) {
          feed.reactionsCount[payload.reactionId] += 1;
        } else {
          feed.reactionsCount[payload.reactionId] = 1;
        }
      }
    } else if (payload.reactionId !== 1) {
      feed.reactionsCount[payload.reactionId] -= 1;
    } else {
      let ind = -1;
      feed.reactions.map((element, index) => {
        if (element === 1) {
          ind = index;
        }
      });
      if (ind >= 0) {
        feed.reactions.splice(ind, 1);
      }
    }
  }
  return feed;
};

const newsReducer = handleActions(
  {
    SET_REACTION_ON_FEED: (state, { payload }) => {
      const news = state.news.map((feed) => {
        return updateReaction(payload, feed);
      });
      const topNews = state.topNews.map((feed) => {
        return updateReaction(payload, feed);
      });
      const newsByCoin = state.newsByCoin.map((feed) => {
        return updateReaction(payload, feed);
      });
      return {
        ...state,
        news,
        topNews,
        newsByCoin,
      };
    },
    SET_KEY_WORD: (state, { payload }) => {
      return {
        ...state,
        offset: 1,
        hasMore: true,
        keyWord: payload,
      };
    },
    LOAD_NEWS_SOURCES: (state, { isLoading: isNewsLoading, error, payload }) => {
      if (isNewsLoading || error) {
        return {
          ...state,
          loadSourcesError: error,
          isNewsLoading,
        };
      }
      const sources = payload.map((source) => {
        source.checked = !!source.isSelected;
        return source;
      });
      return {
        ...state,
        isNewsLoading,
        sources,
        loadSourcesError: error,
      };
    },
    LOAD_NEWS_FEED: (state, { isLoading: isNewsLoading, error, payload }) => {
      let isHaseMore = true;
      if (isNewsLoading || error) {
        return {
          ...state,
          loadFeedError: error,
          isNewsLoading,
        };
      }
      let news = payload;
      if (!news || news.length === 0) {
        news = [];
        isHaseMore = false;
      } else if (state.reactionId === 2 || state.reactionId === 3) {
        isHaseMore = true;
        news.map((element) => {
          const obj = element;
          state.sources.forEach((source) => {
            if (source.id === element.sourceId) {
              obj.sourceLink = source.weburl;
            }
          });
          return obj;
        });
      }
      return {
        hasMore: isHaseMore,
        ...state,
        offset: 1,
        isNewsLoading,
        news,
        isVisibalePosition: -1,
        loadFeedError: error,
      };
    },
    LOAD_NEWS_TOP: (state, { isLoading: isTopNewsLoading, error, payload }) => {
      if (isTopNewsLoading || error) {
        return {
          ...state,
          loadFeedError: error,
          isTopNewsLoading,
        };
      }
      let topNews = payload;
      if (!topNews || topNews.length === 0) {
        topNews = [];
      } else if (state.reactionId === 2 || state.reactionId === 3) {
        topNews.map((element) => {
          const obj = element;
          state.sources.forEach((source) => {
            if (source.id === element.sourceId) {
              obj.sourceLink = source.weburl;
            }
          });
          return obj;
        });
      }
      return {
        ...state,
        isTopNewsLoading,
        topNews,
        loadFeedError: error,
      };
    },
    LOAD_MORE_NEWS_BY_ID: (state, { isLoading: isNewsByCoinLoading, payload, error }) => {
      let hasMoreById = true;
      let offset = state.offset;
      if (isNewsByCoinLoading || error) {
        return {
          ...state,
          isNewsByCoinLoading,
          loadFeedError: error,
        };
      }
      let newNews = payload;
      if (!newNews || newNews.length === 0) {
        hasMoreById = false;
        newNews = [];
        --offset;
      } else {
        if (state.news.length === 1) {
          newNews.map((news, i) => {
            if (news.id === state.news[0].id) {
              newNews.splice(i, 1);
              --i;
            }
          });
        }
        if (state.reactionId === 2 || state.reactionId === 3) {
          hasMoreById = true;
          newNews.map((element) => {
            const obj = element;
            state.sources.forEach((source) => {
              if (source.id === element.sourceId) {
                obj.sourceLink = source.weburl;
              }
            });
            return obj;
          });
        }
      }
      ++offset;
      return {
        ...state,
        isNewsByCoinLoading,
        offset,
        newsByCoin: state.newsByCoin.concat(newNews),
        hasMoreById,
        loadFeedError: error,
      };
    },
    LOAD_MORE_NEWS: (state, { isLoading: isNewsLoading, payload, error }) => {
      let isHaseMore = true;
      let offset = state.offset;
      if (isNewsLoading || error) {
        return {
          ...state,
          isNewsLoading,
          loadFeedError: error,
        };
      }
      let newNews = payload;
      if (!newNews || newNews.length === 0) {
        isHaseMore = false;
        newNews = [];
        --offset;
      } else {
        if (state.news.length === 1) {
          newNews.map((news, i) => {
            if (news.id === state.news[0].id) {
              newNews.splice(i, 1);
              --i;
            }
          });
        }
        if (state.reactionId === 2 || state.reactionId === 3) {
          isHaseMore = true;
          newNews.map((element) => {
            const obj = element;
            state.sources.forEach((source) => {
              if (source.id === element.sourceId) {
                obj.sourceLink = source.weburl;
              }
            });
            return obj;
          });
        }
      }
      ++offset;
      return {
        ...state,
        isNewsLoading,
        offset,
        news: state.news.concat(newNews),
        hasMore: isHaseMore,
        loadFeedError: error,
      };
    },
    LOAD_NEWS_BY_COIN: (state, { isLoading: isNewsByCoinLoading, payload, error }) => {
      if (isNewsByCoinLoading || error) {
        return {
          ...state,
          isNewsByCoinLoading,
          loadFeedError: error,
        };
      }
      return {
        ...state,
        isNewsByCoinLoading,
        newsByCoin: payload,
        loadFeedError: error,
      };
    },
    SET_REACTION_ID: (state, { payload }) => {
      return {
        ...state,
        offset: 1,
        hasMore: true,
        reactionId: payload,
      };
    },
    SET_HASE_MORE: (state, { payload }) => {
      return {
        ...state,
        hasMore: payload,
      };
    },
    SET_VISIBALE_POSITION: (state, { payload }) => {
      return {
        ...state,
        isVisibalePosition: payload,
      };
    },
    SET_REACTION: (state, { payload, isLoading: isSetReactionLoading, error }) => {
      if (isSetReactionLoading || error) {
        return {
          ...state,
          isSetReactionLoading,
          setReactionError: error,
        };
      }
      return {
        ...state,
        isSetReactionLoading,
        news: state.news.map((post) => {
          if (post.id === payload.id) {
            return payload;
          }
          return post;
        }),
      };
    },
  },
  initialState,
);

export default newsReducer;
