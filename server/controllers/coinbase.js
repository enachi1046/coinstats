/* eslint-disable */
import config from 'config';
import Parse from 'parse/node';
import axios from 'axios';
import oauthSignature from 'oauth-signature';
import queryString from 'query-string';
import { Client } from 'coinbase';

function coinbaseGetAuthToken(code, redirectUri) {
  return axios
    .post('https://api.coinbase.com/oauth/token', {
      grant_type: 'authorization_code',
      code: code,
      client_id: config('coinbase.clientId'),
      client_secret: config('coinbase.clientSecret'),
      redirect_uri: redirectUri || 'https://coinbase.com/oauth/javascript_sdk_redirect',
    }).then((res) => res.data);
}

function coinbaseGetUser(accessToken) {
  return axios.get('https://api.coinbase.com/v2/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.data);
}

export function tokenRequest(req, res) {
  let url = 'https://www.coinbase.com/oauth/authorize';
  url += `?client_id=${config('coinbase.clientId')}`;
  url += '&response_type=code';
  url += `&redirect_uri=${config('coinbase.redirectUri')}`;
  url += '&scope=wallet:user:read,wallet:user:email,wallet:accounts:read';
  res.redirect(url);
}

export function oAuthCallback(req, res) {
  coinbaseGetAuthToken(req.query.code, config('coinbase.redirectUri'))
    .then(data => {
      return coinbaseGetUser(data.access_token);
    }).then((user) => {
      return Parse.Cloud.run('signUp', {
        UUID: '',
        email: user.data.email,
        displayName: user.data.name || user.data.email,
      });
    }).catch((e) => {
      console.error(e);
      res.status(500).json({
        message: 'Something went wrong...',
      });
    });
}

export function coinbaseOAuth(req, res) {
  coinbaseGetAuthToken(req.body.code)
    .then(response => {
      res.json(response);
    });
}
