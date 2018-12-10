import config from 'config';

export function jsonToPrice(json, coins, toCoin, symbol) {
  if (
    toCoin.symbol === symbol ||
    (symbol === 'bitcoin' && toCoin.symbol === 'BTC')
  ) {
    return 1;
  }
  if (json[toCoin.symbol]) {
    return parseFloat(json[toCoin.symbol]);
  }
  if (toCoin.symbol === 'USD' && json.USDT) {
    return parseFloat(json.USDT);
  }

  let priceInUSD = json.USD || json.USDT;
  if (!priceInUSD) {
    const coinSymbol = Object.keys(json)[0];
    const priceInCoin = parseFloat(json[coinSymbol]);
    const coin = Object.values(coins).filter((c) => {
      return c.symbol === coinSymbol;
    })[0];
    priceInUSD = coin && coin.price ? priceInCoin * coin.price : 0;
  }
  const currCoin = Object.values(coins).filter((c) => {
    return c.symbol === toCoin.symbol;
  })[0];
  if (currCoin && currCoin.price) {
    return priceInUSD / currCoin.price;
  }
  return 0;
}

export function priceToJson(symbol, coins, price) {
  const priceObj = {};
  priceObj.USD = price;
  const btcPrice = Object.values(coins).filter((c) => {
    return c.symbol === 'BTC';
  })[0].price;
  priceObj.BTC = price / btcPrice;
  const ethPrice = Object.values(coins).filter((c) => {
    return c.symbol === 'ETH';
  })[0].price;
  priceObj.ETH = price / ethPrice;
  return priceObj;
}

export function getCurrentPriceFromPortfolioItem(
  coinId,
  exchange,
  coinPriceFromExchange,
  coinsById,
  globalMainPair,
) {
  if (exchange !== 'average' && coinPriceFromExchange[coinId]) {
    const prices = coinPriceFromExchange[coinId][exchange];
    if (prices && Object.keys(prices).length > 0) {
      return jsonToPrice(prices, coinsById, globalMainPair, coinId);
    } else if (coinsById[coinId]) {
      return coinsById[coinId].price / globalMainPair.usdValue;
    }
    return 0;
  }
  if (coinsById[coinId]) {
    return coinsById[coinId].price / globalMainPair.usdValue;
  }
  return 0;
}
export function calculatePortfolios(oldPortfolios = [], { globalMainPair, coinsById }) {
  const portfolios = JSON.parse(
    JSON.stringify(
      oldPortfolios.filter((p) => {
        return p.identifier !== 'totalPortfolio';
      }),
    ),
  );
  const totalPortfolio = {
    name: 'All Assets',
    identifier: 'totalPortfolio',
    total: 0,
    portfolioItems: [],
    price: {
      USD: 0,
      BTC: 0,
      ETH: 0,
    },
    profit: {
      USD: 0,
      BTC: 0,
      ETH: 0,
    },
    profitPercent: {
      USD: 0,
      BTC: 0,
      ETH: 0,
    },
    altfolioType: 0,
    orderUI: -1,
  };
  const portfolioItems = {};

  let buyPriceUSD = 0;
  let buyPriceBTC = 0;
  let buyPriceETH = 0;
  portfolios.forEach((portfolio) => {
    if (!portfolio.isSharedPortfolio) {
      if (
        Object.keys(portfolio.profit).length !== 0 &&
        !portfolio.isShowOnTotalDisabled
      ) {
        totalPortfolio.profit.USD += portfolio.profit.USD;
        totalPortfolio.profit.BTC += portfolio.profit.BTC;
        totalPortfolio.profit.ETH += portfolio.profit.ETH;

        buyPriceUSD += portfolio.buyPrice.USD;
        buyPriceBTC += portfolio.buyPrice.BTC;
        buyPriceETH += portfolio.buyPrice.ETH;

        totalPortfolio.price.USD += portfolio.price.USD;
        totalPortfolio.price.BTC += portfolio.price.BTC;
        totalPortfolio.price.ETH += portfolio.price.ETH;
      }
    }

    portfolio.portfolioItems = portfolio.portfolioItems.map((item) => {
      item.coin = coinsById[item.coinId];
      // if (coinsById[item.coinId]) {
      //   item.coinImgUrl = coinsById[item.coinId].iconUrl;
      // }
      if (item.coinImgUrl) {
        if (item.coinImgUrl.indexOf('http') === -1) {
          item.coinImgUrl = `https://api.coin-stats.com/api/files/${config(
            'urls.APP_ID',
          )}/${item.coinImgUrl}`;
        }
      }
      if (!portfolio.isShowOnTotalDisabled) {
        if (portfolioItems[item.coinId]) {
          portfolioItems[item.coinId].count += item.count;
        } else {
          portfolioItems[item.coinId] = JSON.parse(JSON.stringify(item));
        }
      }
      return item;
    });
  });
  totalPortfolio.profitPercent.USD =
    (totalPortfolio.profit.USD / buyPriceUSD) * 100;
  totalPortfolio.profitPercent.BTC =
    (totalPortfolio.profit.BTC / buyPriceBTC) * 100;
  totalPortfolio.profitPercent.ETH =
    (totalPortfolio.profit.ETH / buyPriceETH) * 100;

  totalPortfolio.portfolioItems = Object.values(portfolioItems);
  portfolios.unshift(totalPortfolio);
  const sharedPortfolios = [];
  const usualPortfolios = [];
  portfolios.forEach((p) => {
    if (p.isSharedPortfolio) {
      sharedPortfolios.push(p);
    } else {
      usualPortfolios.push(p);
    }
  });
  usualPortfolios.sort((a, b) => {
    if (a.orderUI > b.orderUI) {
      return 1;
    }
    return -1;
  });
  return {
    portfolios: usualPortfolios.concat(sharedPortfolios),
  };
}

export function makeRandomString(count) {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < count; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

export function makeRandomColor(count = 6) {
  let color = '';
  const possible = 'ABCDEF0123456789';

  for (let i = 0; i < count; i++) {
    color += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return color;
}
