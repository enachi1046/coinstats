/* eslint-disable */
import config from 'config';
import Parse from 'parse/node';
import axios from 'axios';
import oauthSignature from 'oauth-signature';
import queryString from 'query-string';

export function tokenRequest(req, res) {
  const CALLBACK_URL = config('twitter.callbackUrl');

  const oauth_consumer_key = config('twitter.apiKey');
  const oauth_timestamp = Math.floor(Date.now() / 1000);
  const oauth_nonce = Date.now();

  const signature = oauthSignature.generate(
    'POST',
    'https://api.twitter.com/oauth/request_token',
    {
      oauth_consumer_key,
      oauth_nonce,
      oauth_timestamp,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_version: '1.0',
      oauth_callback: CALLBACK_URL,
    },
    config('twitter.apiSecret'),
  );

  axios
    .post(
      'https://api.twitter.com/oauth/request_token',
      {},
      {
        headers: {
          Authorization: `OAuth oauth_consumer_key="${oauth_consumer_key}",oauth_signature_method="HMAC-SHA1",oauth_timestamp="${oauth_timestamp}",oauth_nonce="${oauth_nonce}",oauth_version="1.0",oauth_signature="${signature}",oauth_callback="${encodeURIComponent(
            CALLBACK_URL,
          )}",`,
        },
      },
    )
    .then(response => {
      const data = queryString.parse(response.data);
      res.writeHead(302, {
        Location: `https://api.twitter.com/oauth/authorize?oauth_token=${data.oauth_token}`,
      });
      res.end();
    })
    .catch(error => {
      if (error.response) {
        console.error(error.response.data);
      } else {
        console.error(error);
      }
      res.end();
    });
}

export function oAuthCallback(req, res) {
  const { oauth_token, oauth_verifier } = req.query;

  const oauth_consumer_key = config('twitter.apiKey');
  const oauth_timestamp = Math.floor(Date.now() / 1000);
  const oauth_nonce = Date.now();

  const signature = oauthSignature.generate(
    'POST',
    'https://api.twitter.com/oauth/access_token',
    {
      oauth_consumer_key,
      oauth_nonce,
      oauth_token,
      oauth_timestamp,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_version: '1.0',
    },
    config('twitter.apiSecret'),
  );

  axios
    .post(
      'https://api.twitter.com/oauth/access_token',
      queryString.stringify({
        oauth_verifier,
      }),
      {
        headers: {
          Authorization: `OAuth oauth_consumer_key="${oauth_consumer_key}",oauth_signature_method="HMAC-SHA1",oauth_token="${oauth_token}",oauth_timestamp="${oauth_timestamp}",oauth_nonce="${oauth_nonce}",oauth_version="1.0",oauth_signature="${signature}"`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
    .then(response => {
      const data = queryString.parse(response.data);
      const { oauth_token, oauth_token_secret } = data;

      const authData = {
        auth_token: oauth_token,
        auth_token_secret: oauth_token_secret,
        consumer_key: oauth_consumer_key,
        consumer_secret: config('twitter.apiSecret'),
      };
      return Parse.Cloud.run('loginV2', {
        twitterAuthToken: oauth_token,
        twitterAuthSecret: oauth_token_secret,
        authData,
      }).then(info => {
        res.render('twitter-login', { info });
      });
    })
    .catch(e => {
      console.error(e);
      res.json({
        error: e,
      });
    });
}
