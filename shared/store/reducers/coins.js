import { handleActions } from 'redux-actions';

import { calculatePortfolios } from 'utils/coins';
import CURRENCY_SIGNS from 'const/currency-signs';
import { APP_URL } from 'const/api';
import storage from 'utils/storage';

const initialState = {
  hasUsualPortfolio: false,
  firstFetch: true,
  activeTab: 0,
  BTC: {},
  coinsById: {},
  currentCoin: null,
  maxUi: 0,
  portfolios: [],
  chartInfo: [],
  globalTotalUSD: 0,
  globalTotalProfitUSD: 0,
  globalTotal: 0,
  globalTotalProfit: 0,
  globalTotalPositiveProfit: 0,
  coinPriceFromExchange: {},
  addTransactionError: null,
  deleteTransactionError: null,
  addPortfolioError: null,
  hideSmallAssets:
    storage.getItem('HIDE_SMALL_ASSETS') &&
    storage.getItem('HIDE_SMALL_ASSETS') !== 'false',
  hideUnidentified:
    storage.getItem('HIDE_UNIDENTIFIED') &&
    storage.getItem('HIDE_UNIDENTIFIED') !== 'false',
  showChart:
    storage.getItem('SHOW_CHART') && storage.getItem('SHOW_CHART') !== 'false',
  darkMode:
    storage.getItem('DARK_MODE') && storage.getItem('DARK_MODE') !== 'false',
  userFavoriteCoins: [],
  globalMainPair: {
    sign: '$',
    symbol: 'USD',
    identifier: 'usd',
    usdValue: 1,
  },
  errors: {
    fetchCoins: null,
    fetchFiat: null,
    fetchPortfolios: null,
    fetchFavorites: null,
    fetchCharts: null,
    addPortfolio: null,
    deletePortfolio: null,
    addTransaction: null,
    deleteTransaction: null,
  },
  isLoading: {
    fetchCoins: false,
    fetchFiat: false,
    fetchPortfolios: false,
    fetchFavorites: false,
    fetchCharts: false,
    addPortfolio: false,
    deletePortfolio: false,
    addTransaction: false,
    deleteTransaction: false,
  },
};

const coinsReducer = handleActions(
  {
    CURRENT_COIN_CHART(state, { isLoading, payload }) {
      if (isLoading) {
        return {
          ...state,
          isCoinChartLoading: isLoading,
        };
      }
      const coinChartInfoDates = [];
      const coinChartInfoUSD = [];
      const coinChartInfoBTC = [];
      const coinChartInfoETH = [];
      payload.map((value) => {
        coinChartInfoDates.push(value[0] * 1000);
        coinChartInfoUSD.push(value[1]);
        coinChartInfoBTC.push(value[2]);
        coinChartInfoETH.push(value[3]);
      });
      return {
        ...state,
        coinChartInfoDates,
        coinChartInfoUSD,
        coinChartInfoBTC,
        coinChartInfoETH,
      };
    },
    SET_ACTIVE_TAB(state, { payload }) {
      return {
        ...state,
        activeTab: payload,
      };
    },
    CLEAN_PORTFOLIOS(state) {
      return {
        ...state,
        portfolios: [],
        globalTotal: 0,
        globalTotalProfit: 0,
      };
    },
    LOAD_FAVORITE_COINS(state, { payload }) {
      if (!payload) {
        return state;
      }
      return {
        ...state,
        userFavoriteCoins: payload,
      };
    },
    SWITCH_MAIN_PAIR(state, { payload }) {
      if (!payload) {
        return state;
      }
      const coin = Object.values(state.coinsById).filter((c) => {
        return c.id === payload || c.symbol === payload;
      })[0];
      if (!coin) {
        return state;
      }
      const globalMainPair = {
        id: coin.fiat ? coin.id : coin.symbol,
        sign: CURRENCY_SIGNS[coin.symbol] || coin.symbol,
        symbol: coin.name,
        identifier: coin.name.toLowerCase(),
        usdValue: coin.price,
      };
      return {
        ...state,
        ...calculatePortfolios(state.portfolios, { ...state, globalMainPair }),
        globalMainPair,
      };
    },
    LOAD_FIATS: (state, { isLoading, payload, error }) => {
      if (isLoading || error) {
        return {
          ...state,
          errors: {
            ...state.errors,
            fetchFiat: error,
          },
          isLoading: {
            ...state.isLoading,
            fetchFiat: isLoading,
          },
        };
      }
      const coinsById = JSON.parse(JSON.stringify(state.coinsById));

      coinsById.FiatCoinUSD = {
        id: 'FiatCoinUSD',
        name: 'USD',
        symbol: 'USD',
        price: 1,
        fiat: true,
        iconUrl: 'imgs/fiatcoinflag/USD.imageset/USD.png',
      };
      Object.keys(payload).forEach((name, index) => {
        if (name === 'USD') {
          return;
        }
        const currency = payload[name];
        const key = `FiatCoin${name}`;
        coinsById[key] = {};
        coinsById[key].id = key;
        coinsById[key].price = 1 / currency.rate;
        coinsById[
          key
        ].iconUrl = `imgs/fiatcoinflag/${name}.imageset/${name}.png`;
        coinsById[key].name = name;
        coinsById[key].symbol = currency.symbol;
        coinsById[key].fiat = true;
      });

      return {
        ...state,
        coinsById,
        errors: {
          ...state.errors,
          fetchFiat: error,
        },
        isLoading: {
          ...state.isLoading,
          fetchFiat: isLoading,
        },
      };
    },
    LOAD_CURRENT_COIN: (state, { isLoading, payload, error }) => {
      if (isLoading || error) {
        return {
          ...state,
          errors: {
            ...state.errors,
            fetchCoin: error,
          },
          isLoading: {
            ...state.isLoading,
            fetchCoin: isLoading,
          },
        };
      }
      const currentCoin = {
        id: payload.i,
        price: payload.pu,
        bitcoinPrice: payload.pb,
        iconUrl: `${APP_URL}/files/812fde17aea65fbb9f1fd8a478547bde/${payload.ic}`,
        name: payload.n,
        symbol: payload.s,
        marketCap: payload.m || 0,
        volume24h: payload.v || 0,
        availableSupply: payload.a || 0,
        totalSupply: payload.t || 0,
        percentChange1h: payload.p1 || 0,
        percentChange24h: payload.p24 || 0,
        percentChange7d: payload.p7 || 0,
        explorers: payload.exp || [],
        twitter_url: payload.tu,
        reddit_url: payload.ru,
        rank: payload.r,
      };
      return {
        ...state,
        errors: {
          ...state.errors,
          fetchCoin: error,
        },
        isLoading: {
          ...state.isLoading,
          fetchCoin: isLoading,
        },
        currentCoin,
      };
    },
    LOAD_BTC: (state, { isLoading, payload, error }) => {
      if (isLoading || error) {
        return {
          ...state,
          errors: {
            ...state.errors,
            fetchCoin: error,
          },
          isLoading: {
            ...state.isLoading,
            fetchCoin: isLoading,
          },
        };
      }
      const BTC = {
        id: payload.i,
        price: payload.pu,
        bitcoinPrice: payload.pb,
        iconUrl: `${APP_URL}/files/812fde17aea65fbb9f1fd8a478547bde/${payload.ic}`,
        name: payload.n,
        symbol: payload.s,
        marketCap: payload.m || 0,
        volume24h: payload.v || 0,
        availableSupply: payload.a || 0,
        totalSupply: payload.t || 0,
        percentChange1h: payload.p1 || 0,
        percentChange24h: payload.p24 || 0,
        percentChange7d: payload.p7 || 0,
        explorers: payload.exp || [],
        twitter_url: payload.tu,
        reddit_url: payload.ru,
        rank: payload.r,
      };
      return {
        ...state,
        errors: {
          ...state.errors,
          fetchCoin: error,
        },
        isLoading: {
          ...state.isLoading,
          fetchCoin: isLoading,
        },
        BTC,
      };
    },
    LOAD_COINS: (state, { isLoading, payload, error }) => {
      if (isLoading || error) {
        return {
          ...state,
          errors: {
            ...state.errors,
            fetchCoins: error,
          },
          isLoading: {
            ...state.isLoading,
            fetchCoins: isLoading,
          },
        };
      }

      const coinsById = JSON.parse(JSON.stringify(state.coinsById));
      let BTC = {};
      payload.forEach((coin) => {
        coinsById[coin.i] = {};
        coinsById[coin.i].id = coin.i;
        coinsById[coin.i].price = coin.pu || 0;
        coinsById[coin.i].bitcoinPrice = coin.pb || 0;
        coinsById[
          coin.i
        ].iconUrl = `${APP_URL}/files/812fde17aea65fbb9f1fd8a478547bde/${coin.ic}`;
        coinsById[coin.i].name = coin.n;
        coinsById[coin.i].symbol = coin.s;
        coinsById[coin.i].marketCap = coin.m || 0;
        coinsById[coin.i].volume24h = coin.v || 0;
        coinsById[coin.i].websiteUrl = coin.w;
        coinsById[coin.i].redditUrl = coin.ru;
        coinsById[coin.i].twitterUrl = coin.tu;
        coinsById[coin.i].availableSupply = coin.a || 0;
        coinsById[coin.i].totalSupply = coin.t || 0;
        coinsById[coin.i].percentChange1h = coin.p1 || 0;
        coinsById[coin.i].percentChange24h = coin.p24 || 0;
        coinsById[coin.i].percentChange7d = coin.p7 || 0;
        coinsById[coin.i].explorers = coin.exp || [];
        coinsById[coin.i].rank = coin.r;
        if (coin.s === 'BTC') {
          BTC = coinsById[coin.i];
        }
      });
      return {
        ...state,
        coinsById,
        BTC,
        errors: {
          ...state.errors,
          fetchCoins: error,
        },
        isLoading: {
          ...state.isLoading,
          fetchCoins: isLoading,
        },
      };
    },
    LOAD_PORTFOLIOS: (state, { isLoading, payload, error }) => {
      if (isLoading || error) {
        return {
          ...state,
          errors: {
            ...state.errors,
            fetchPortfolios: error,
          },
          isLoading: {
            ...state.isLoading,
            fetchPortfolios: isLoading,
          },
        };
      }
      const { portfolios, profit, buyPrice, maxUi, price } = payload;
      let hasUsualPortfolio = false;
      if (portfolios.length > 0) {
        portfolios.map((portfolio) => {
          if (portfolio.altfolioType === 0) {
            hasUsualPortfolio = true;
          }
        });
      }
      return {
        ...state,
        ...calculatePortfolios(portfolios, state),
        hasUsualPortfolio,
        firstFetch: false,
        globalTotal: price.USD,
        globalTotalProfit: profit.USD,
        globalTotalPositiveProfit: buyPrice.USD,
        globalTotalUSD: price.USD,
        globalTotalProfitUSD: profit.USD,
        globalTotalPositiveProfitUSD: buyPrice.USD,
        maxUi,
        errors: {
          ...state.errors,
          fetchPortfolios: error,
        },
        isLoading: {
          ...state.isLoading,
          fetchPortfolios: isLoading,
        },
      };
    },
    LOAD_ALL_CURRENT_COIN_TRANSACTIONS: (state, { isLoading, payload, error }) => {
      if (isLoading) {
        return {
          ...state,
          errors: {
            ...state.errors,
            fetchSingleCoinTransactions: error,
          },
          isLoading: {
            ...state.isLoading,
            fetchSingleCoinTransactions: isLoading,
          },
        };
      }
      let hasMoreTransactions = false;
      if (payload.transactions.length === payload.limit) {
        hasMoreTransactions = true;
      }
      const currentCoinTransactions = state.currentCoinTransactions;
      currentCoinTransactions.portfolios.map((portfolio) => {
        if (portfolio.identifier === payload.portfolioId) {
          payload.transactions.map((transaction) => {
            portfolio.transactions.push(transaction);
          });
          portfolio.hasMoreTransactions = hasMoreTransactions;
        }
      });
      return {
        ...state,
        currentCoinTransactions,
        errors: {
          ...state.errors,
          fetchSingleCoinTransactions: error,
        },
        isLoading: {
          ...state.isLoading,
          fetchSingleCoinTransactions: isLoading,
        },
      };
    },
    LOAD_CURRENT_COIN_TRANSACTIONS: (state, { isLoading, payload, error }) => {
      if (isLoading) {
        return {
          ...state,
          errors: {
            ...state.errors,
            fetchSingleCoin: error,
          },
          isLoading: {
            ...state.isLoading,
            fetchSingleCoin: isLoading,
          },
        };
      }
      const { transactions } = payload;
      return {
        ...state,
        currentCoinTransactions: transactions,
        errors: {
          ...state.errors,
          fetchSingleCoin: error,
        },
        isLoading: {
          ...state.isLoading,
          fetchSingleCoin: isLoading,
        },
      };
    },
    ADD_PORTFOLIO: (state, { isLoading, payload, error }) => {
      if (isLoading || error) {
        return {
          ...state,
          errors: {
            ...state.errors,
            addPortfolio: error,
          },
          isLoading: {
            ...state.isLoading,
            addPortfolio: isLoading,
          },
        };
      }

      const newPortfolio = JSON.parse(JSON.stringify(payload));
      if (!newPortfolio.portfolioItems) {
        newPortfolio.portfolioItems = [];
      }
      const portfolios = JSON.parse(JSON.stringify(state.portfolios));
      let pushed = false;
      portfolios.forEach((portfolio, ind) => {
        if (portfolio.identifier === payload.identifier) {
          pushed = true;
          portfolios[ind] = newPortfolio;
        }
      });
      if (!pushed) {
        portfolios.push(newPortfolio);
      }
      let hasUsualPortfolio = false;
      portfolios.map((portfolio) => {
        if (portfolio.altfolioType === 0) {
          hasUsualPortfolio = true;
        }
      });
      return {
        ...state,
        ...calculatePortfolios(portfolios, state),
        hasUsualPortfolio,
        globalTotal: calculatePortfolios(portfolios, state).portfolios[0].price
          .USD,
        globalTotalProfit: calculatePortfolios(portfolios, state).portfolios[0]
          .profit.USD,
        activeTab: portfolios.length - 1,
        errors: {
          ...state.errors,
          addPortfolio: error,
        },
        isLoading: {
          ...state.isLoading,
          addPortfolio: isLoading,
        },
      };
    },
    LOAD_PORTFOLIO: (state, { isLoading, payload, error }) => {
      if (isLoading || error) {
        return {
          ...state,
          errors: {
            ...state.errors,
            updateExchange: error,
          },
          isLoading: {
            ...state.isLoading,
            updateExchange: isLoading,
          },
        };
      }
      const portfolios = state.portfolios.map((p) => {
        if (p.identifier === payload.identifier) {
          return payload;
        }
        return p;
      });
      return {
        ...state,
        ...calculatePortfolios(portfolios, state),
        globalTotal: calculatePortfolios(portfolios, state).portfolios[0].price
          .USD,
        globalTotalProfit: calculatePortfolios(portfolios, state).portfolios[0]
          .profit.USD,
        errors: {
          ...state.errors,
          updateExchange: error,
        },
        isLoading: {
          ...state.isLoading,
          updateExchange: isLoading,
        },
      };
    },
    UPDATE_EXCHANGE: (state, { isLoading, payload, error }) => {
      if (isLoading || error) {
        return {
          ...state,
          errors: {
            ...state.errors,
            updateExchange: error,
          },
          isLoading: {
            ...state.isLoading,
            updateExchange: isLoading,
          },
        };
      }
      const portfolios = state.portfolios.map((p) => {
        if (p.identifier === payload.response.identifier) {
          return payload.response;
        }
        return p;
      });
      return {
        ...state,
        ...calculatePortfolios(portfolios, state),
        globalTotal: calculatePortfolios(portfolios, state).portfolios[0].price
          .USD,
        globalTotalProfit: calculatePortfolios(portfolios, state).portfolios[0]
          .profit.USD,
        errors: {
          ...state.errors,
          updateExchange: error,
        },
        isLoading: {
          ...state.isLoading,
          updateExchange: isLoading,
        },
      };
    },
    UPDATE_WALLET: (state, { isLoading, payload, error }) => {
      if (isLoading || error) {
        return {
          ...state,
          errors: {
            ...state.errors,
            updateWallet: error,
          },
          isLoading: {
            ...state.isLoading,
            updateWallet: isLoading,
          },
        };
      }
      const portfolios = state.portfolios.map((p) => {
        if (p.identifier === payload.response.identifier) {
          return payload.response;
        }
        return p;
      });
      return {
        ...state,
        ...calculatePortfolios(portfolios, state),
        globalTotal: calculatePortfolios(portfolios, state).portfolios[0].price
          .USD,
        globalTotalProfit: calculatePortfolios(portfolios, state).portfolios[0]
          .profit.USD,
        errors: {
          ...state.errors,
          updateWallet: error,
        },
        isLoading: {
          ...state.isLoading,
          updateWallet: isLoading,
        },
      };
    },
    DELETE_PORTFOLIO: (state, { isLoading, payload, error }) => {
      if (isLoading || error) {
        return {
          ...state,
          errors: {
            ...state.errors,
            deletePortfolio: error,
          },
          isLoading: {
            ...state.isLoading,
            deletePortfolio: isLoading,
          },
        };
      }
      const portfolios = state.portfolios.filter((portfolio) => {
        return portfolio.identifier !== payload.portfolioId;
      });
      return {
        ...state,
        ...calculatePortfolios(portfolios, state),
        globalTotal: calculatePortfolios(portfolios, state).portfolios[0].price
          .USD,
        globalTotalProfit: calculatePortfolios(portfolios, state).portfolios[0]
          .profit.USD,
        activeTab: 0,
        errors: {
          ...state.errors,
          deletePortfolio: error,
        },
        isLoading: {
          ...state.isLoading,
          deletePortfolio: isLoading,
        },
      };
    },
    ADD_TRANSACTION: (state, { isLoading, payload, error }) => {
      if (isLoading || error) {
        return {
          ...state,
          errors: {
            ...state.errors,
            addTransaction: error,
          },
          isLoading: {
            ...state.isLoading,
            addTransaction: isLoading,
          },
        };
      }
      const { portfolios, transactions } = payload;
      let portfolioInd = -1;
      let oldPortf;
      let portfUpdated;
      const oldPortfolios = state.portfolios.map((oldPortfolio, ind) => {
        let res = oldPortfolio;
        portfolios.forEach((newPortfolio) => {
          if (newPortfolio.identifier === oldPortfolio.identifier) {
            portfolioInd = ind;
            oldPortf = res;
            res = newPortfolio;
            portfUpdated = true;
          }
        });
        return res;
      });
      let newGlobalProfit;
      if (!portfUpdated) {
        oldPortfolios.push(portfolios[0]);
        newGlobalProfit = portfolios[0].profit.USD;
        if (Number(state.globalTotalProfit)) {
          newGlobalProfit = state.globalTotalProfit + portfolios[0].profit.USD;
        }
      } else {
        newGlobalProfit = oldPortf.profit.USD + portfolios[0].profit.USD;
        if (Number(state.globalTotalProfit)) {
          newGlobalProfit =
            state.globalTotalProfit -
            oldPortf.profit.USD +
            portfolios[0].profit.USD;
        }
      }
      let updated = false;
      const currentCoinTransactions = state.currentCoinTransactions;
      if (currentCoinTransactions) {
        const newTransactions = state.currentCoinTransactions.portfolios[portfolioInd].transactions.map((tr) => {
          if (tr.identifier === transactions[0].identifier) {
            updated = true;
            return transactions[0];
          }
          return tr;
        });
        if (!updated) {
          newTransactions.push(transactions[0]);
        }
        if (portfolioInd >= 0) {
          currentCoinTransactions.portfolios[portfolioInd].transactions = newTransactions;
        }
      }
      let newGlobalTotal;
      if (Number(state.globalTotal)) {
        newGlobalTotal =
          state.globalTotal +
          transactions[0].count * transactions[0].purchasePricesJson.USD;
      } else {
        newGlobalTotal =
          transactions[0].count * transactions[0].purchasePricesJson.USD;
      }
      return {
        ...state,
        ...calculatePortfolios(oldPortfolios, state),
        activeTab: state.portfolios.length > 1 ? state.activeTab : 1,
        currentCoinTransactions,
        globalTotal: newGlobalTotal,
        globalTotalProfit: newGlobalProfit,
        errors: {
          ...state.errors,
          addTransaction: error,
        },
        isLoading: {
          ...state.isLoading,
          addTransaction: isLoading,
        },
      };
    },
    DELETE_TRANSACTION: (state, { isLoading, payload, error }) => {
      if (isLoading || error) {
        return {
          ...state,
          errors: {
            ...state.errors,
            deleteTransaction: error,
          },
          isLoading: {
            ...state.isLoading,
            deleteTransaction: isLoading,
          },
        };
      }
      const { portfolios, transactionId } = payload;
      let portfolioInd = -1;
      const oldPortfolios = state.portfolios.map((oldPortfolio) => {
        let res = oldPortfolio;
        portfolios.forEach((newPortfolio, ind) => {
          if (newPortfolio.identifier === oldPortfolio.identifier) {
            portfolioInd = ind;
            res = newPortfolio;
          }
        });
        return res;
      });
      const currentCoinTransactions = state.currentCoinTransactions;
      const newTransactions = [];
      state.currentCoinTransactions.portfolios[portfolioInd].transactions.map((transaction) => {
        if (transaction.identifier !== transactionId) {
          newTransactions.push(transaction);
        }
      });
      currentCoinTransactions.portfolios[portfolioInd].transactions = newTransactions;
      return {
        ...state,
        ...calculatePortfolios(oldPortfolios, state),
        globalTotal: calculatePortfolios(portfolios, state).portfolios[0].price
          .USD,
        globalTotalProfit: calculatePortfolios(portfolios, state).portfolios[0]
          .profit.USD,
        currentCoinTransactions,
        errors: {
          ...state.errors,
          deleteTransaction: error,
        },
        isLoading: {
          ...state.isLoading,
          deleteTransaction: isLoading,
        },
      };
    },
    LOAD_CHART: (state, { isLoading, payload, error }) => {
      if (isLoading || error) {
        return {
          ...state,
          chartInfo: [],
          isLoading: {
            ...state.isLoading,
            fetchCharts: isLoading,
          },
          errors: {
            ...state.errors,
            fetchCharts: isLoading,
          },
        };
      }
      return {
        ...state,
        chartInfo: payload,
        isLoading: {
          ...state.isLoading,
          fetchCharts: isLoading,
        },
      };
    },
    FETCH_SUPPORTED_EXCHANES: (state, { isLoading, payload, error }) => {
      if (isLoading || error) {
        return {
          ...state,
          supportedExchanges: [],
          isLoading: {
            ...state.isLoading,
            fetchSupportedExchanges: isLoading,
          },
          errors: {
            ...state.errors,
            fetchSupportedExchanges: isLoading,
          },
        };
      }
      return {
        ...state,
        supportedExchanges: payload,
        isLoading: {
          ...state.isLoading,
          fetchSupportedExchanges: isLoading,
        },
      };
    },
    TOGGLE_HIDE_SMALL_ASSETS(state, { payload }) {
      storage.setItem('HIDE_SMALL_ASSETS', !state.hideSmallAssets);
      return {
        ...state,
        hideSmallAssets: !state.hideSmallAssets,
      };
    },
    TOGGLE_HIDE_UNIDENTIFIED(state, { payload }) {
      storage.setItem('HIDE_UNIDENTIFIED', !state.hideUnidentified);
      return {
        ...state,
        hideUnidentified: !state.hideUnidentified,
      };
    },
    SHOW_CHART(state, { payload }) {
      storage.setItem('SHOW_CHART', !state.showChart);
      return {
        ...state,
        showChart: !state.showChart,
      };
    },
    // TOGGLE_DARK_MODE(state, { payload }) {
    //   console.log('xx');
    //   storage.setItem('DARK_MODE', !state.darkMode);
    //   return {
    //     ...state,
    //     darkMode: !state.darkMode,
    //   };
    // },
  },
  initialState,
);

export default coinsReducer;
