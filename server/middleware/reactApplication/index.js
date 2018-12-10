import React from 'react';
import Helmet from 'react-helmet';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { AsyncComponentProvider, createAsyncContext } from 'react-async-component';
import asyncBootstrapper from 'react-async-bootstrapper';
import { Provider } from 'react-redux';
import store from 'shared/store';
import { CookiesProvider } from 'react-cookie';

import config from 'config';

import ServerHTML from './ServerHTML';
import CoinStatsApp from '../../../shared/components/CoinStatsApp';
import { log } from '../../../internal/utils';

/**
 * React application middleware, supports server side rendering.
 */
export default function reactApplicationMiddleware(request, response) {
  // Ensure a nonce has been provided to us.
  // See the server/middleware/security.js for more info.
  if (typeof response.locals.nonce !== 'string') {
    throw new Error('A "nonce" value has not been attached to the response');
  }
  const nonce = response.locals.nonce;

  // It's possible to disable SSR, which can be useful in development mode.
  // In this case traditional client side only rendering will occur.
  if (config('disableSSR')) {
    if (process.env.BUILD_FLAG_IS_DEV === 'true') {
      // eslint-disable-next-line no-console
      log({
        title: 'Server',
        level: 'info',
        message: `Handling react route without SSR: ${request.url}`,
      });
    }
    // SSR is disabled so we will return an "empty" html page and
    // rely on the client to initialize and render the react application.
    const html = renderToStaticMarkup(<ServerHTML nonce={nonce} />);
    response.status(200).send(`<!DOCTYPE html>${html}`);
    return;
  }

  // Create a context for our AsyncComponentProvider.
  const asyncComponentsContext = createAsyncContext();

  // Create a context for <StaticRouter>, which will allow us to
  // query for the results of the render.
  const reactRouterContext = {};

  // Declare our React application.
  const app = (
    <Provider store={store}>
      <AsyncComponentProvider asyncContext={asyncComponentsContext}>
        <StaticRouter location={request.url} context={reactRouterContext}>
          <CookiesProvider>
            <CoinStatsApp
              browserCookies={request.cookies}
              queryParams={request.query}
            />
          </CookiesProvider>
        </StaticRouter>
      </AsyncComponentProvider>
    </Provider>
  );

  // Pass our app into the react-async-component helper so that any async
  // components are resolved for the render.
  asyncBootstrapper(app).then(() => {
    const appString = renderToString(app);

    // Generate the html response.
    const html = renderToStaticMarkup(<ServerHTML
      reactAppString={appString}
      nonce={nonce}
      helmet={Helmet.rewind()}
      asyncComponentsState={asyncComponentsContext.getState()}
    />);

    // Check if the router context contains a redirect, if so we need to set
    // the specific status and redirect header and end the response.
    if (reactRouterContext.url) {
      response.status(302).setHeader('Location', reactRouterContext.url);
      response.end();
      return;
    }

    response
      .status(reactRouterContext.missed
        ? // If the renderResult contains a "missed" match then we set a 404 code.
        // Our App component will handle the rendering of an Error404 view.
        404
        : // Otherwise everything is all good and we send a 200 OK status.
        200)
      .send(`<!DOCTYPE html>${html}`);
  });
}