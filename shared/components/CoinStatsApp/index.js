import 'normalize.css/normalize.css';

import { connect } from 'react-redux';
import React, { Component } from 'react';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import Helmet from 'react-helmet';

import config from 'config';

import 'assets/styles/style.scss';

import Error404 from 'routes/Error404';

import AsyncLivePricesRoute from 'routes/AsyncLivePricesRoute';
import AsyncNewsRoute from 'routes/AsyncNewsRoute';
import AsyncPortfoliosRoute from 'routes/AsyncPortfoliosRoute';
import AsyncCoinInfoRoute from 'routes/AsyncCoinInfoRoute';
import AsyncHomeRoute from 'routes/AsyncHomeRoute';
import AsyncAuthRoute from 'routes/AsyncAuthRoute';

import { home as homeActions } from 'store/actions';


class CoinStatsApp extends Component {
  render() {
    return (
      <div className="root">
        <Helmet>
          <html lang="en" />
          <meta charSet="utf-8" />
          <meta name="application-name" content={config('htmlPage.title.home')} />
          <meta name="description" content={config('htmlPage.description.home')} />
          <meta name="keywords" content={config('htmlPage.keywords.home')} />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#2b2b2b" />
          <meta property="og:title" content="Coin Stats - Crypto research and portfolio tracker" />
          <meta property="og:description" content={config('htmlPage.description.home')} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="http://coin-stats.com/" />
          <meta property="og:image" content="http://coin-stats.com/imgs/favicon.png" />
          <title>{config('htmlPage.defaultTitle')}</title>
          <link rel="shortcut icon" href="/favicon.png" />
          <meta name="msapplication-TileColor" content="#2b2b2b" />
          <link rel="manifest" href="/manifest.json" />
          <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700" rel="stylesheet" />
          <link
            rel="stylesheet"
            href="https://use.fontawesome.com/releases/v5.0.13/css/all.css"
            integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp"
            crossOrigin="anonymous"
          />
          <link rel="alternate" href="https://coinstats.app/" hrefLang="en-us" />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.1.0/css/flag-icon.min.css"
          />
          <link rel="stylesheet" type="text/css" href="/fonts/icomoon/style.css" />
          <script async src="https://www.googletagmanager.com/gtag/js?id=UA-122858415-1" />
          <script>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'UA-122858415-1');
            `}
          </script>
          {'<!-- Hotjar Tracking Code for https://coinstats.app/ -->'}
          <script>
            {`
            (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:1011861,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
          </script>
          {'<!-- Yandex.Metrika counter -->'}
          <script type="text/javascript">
            {`
              (function (d, w, c) {
                (w[c] = w[c] || []).push(function() {
                  try {
                    w.yaCounter50313364 = new Ya.Metrika2({
                      id:50313364,
                      clickmap:true,
                      trackLinks:true,
                      accurateTrackBounce:true
                    });
                  } catch(e) { }
                });

                var n = d.getElementsByTagName("script")[0],
                  s = d.createElement("script"),
                  f = function () { n.parentNode.insertBefore(s, n); };
                s.type = "text/javascript";
                s.async = true;
                s.src = "https://mc.yandex.ru/metrika/tag.js";

                if (w.opera == "[object Opera]") {
                  d.addEventListener("DOMContentLoaded", f, false);
                } else { f(); }
            })(document, window, "yandex_metrika_callbacks2");
          `}
          </script>
          {`
            <noscript>
              <div>
                <img src="https://mc.yandex.ru/watch/50313364" style="position:absolute; left:-9999px;" alt="" />
              </div>
            </noscript>
          `}
          {'<!-- /Yandex.Metrika counter -->'}
        </Helmet>
        <Switch>
          <Route
            path="/"
            exact
            render={props => (<AsyncLivePricesRoute {...props} {...this.props} />)}
          />
          <Route
            path="/news"
            exact
            render={props => (<AsyncNewsRoute {...props} {...this.props} />)}
          />
          <Route
            path="/news/:feedId"
            exact
            render={props => (<AsyncNewsRoute {...props} {...this.props} singlePost />)}
          />
          <Route
            path="/liveprices"
            exact
            render={props => (<AsyncLivePricesRoute {...props} {...this.props} />)}
          />
          <Route
            path="/liveprices/:coinName"
            exact
            render={props => (<AsyncCoinInfoRoute {...props} {...this.props} />)}
          />
          <Route
            path="/liveprices/:coinName/:tab"
            render={props => (<AsyncCoinInfoRoute {...props} {...this.props} />)}
          />
          <Route
            path="/portfolio"
            render={props => (<AsyncPortfoliosRoute {...props} {...this.props} />)}
          />
          <Route
            path="/signup"
            render={props => (<AsyncAuthRoute {...props} {...this.props} />)}
          />
          <Route
            path="/signin"
            render={props => (<AsyncAuthRoute {...props} {...this.props} />)}
          />
          <Route component={Error404} />
        </Switch>
        <script async src="https://checkout.stripe.com/checkout.js" />
      </div>
    );
  }
}

export default CoinStatsApp;
