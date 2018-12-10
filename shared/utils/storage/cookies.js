import { Base64 } from 'js-base64';

export function parseCookies(cookies) {
  let user = null;
  let theme = null;
  const {
    userData,
    mode,
  } = cookies;
  if (userData) {
    user = JSON.parse(Base64.decode(userData));
  }
  if (mode) {
    theme = mode;
  }
  return { user, theme };
}
