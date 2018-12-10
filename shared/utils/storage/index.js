import { isServer } from 'utils/env';

function isLocalStorageNameSupported() {
  if (!window.localStorage) {
    return false;
  }

  const testKey = 'test';
  const storage = window.localStorage;

  try {
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    return 'localStorage' in window && window.localStorage;
  } catch (error) {
    return false;
  }
}

function isSessionStorageNameSupported() {
  if (!window.sessionStorage) {
    return false;
  }
  const testKey = 'test';
  const storage = window.sessionStorage;
  try {
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    return 'sessionStorage' in window && window.sessionStorage;
  } catch (error) {
    return false;
  }
}

const cookieStorage = {
  setItem(name, value, days = 30) {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value}${expires}; path=/`;
  },
  getItem(k) {
    const nameEQ = `${k}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },
  removeItem(k) {
    return this.setItem(k, '', -1);
  },
  hasItem(k) {
    return !!this.getItem(k);
  },
  clear() {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  },
};

function getStorage() {
  if (isServer()) {
    return null;
  }
  if (isLocalStorageNameSupported()) {
    return window.localStorage;
  }
  console.error('Local storage not supported, trying session storage.');
  if (isSessionStorageNameSupported()) {
    return window.sessionStorage;
  }
  console.error('Session storage not supported, saving in cookies.');
  return cookieStorage;
}

export default {
  data: {},
  storage: getStorage(),
  setItem(k, v) {
    this.data[k] = v;
    if (this.storage) {
      this.storage.setItem(k, v);
    }
  },
  getItem(k) {
    if (!this.data[k] && this.storage) {
      this.data[k] = this.storage.getItem(k);
    }
    return this.data[k];
  },
  removeItem(k) {
    delete this.data[k];
    if (this.storage) {
      this.storage.removeItem(k);
    }
  },
  hasItem(k) {
    if (!this.data[k] && this.storage) {
      this.data[k] = this.storage.getItem(k);
    }
    return !!this.data[k];
  },
  clear() {
    this.data = {};
    if (this.storage) {
      this.storage.clear();
    }
  },
};
