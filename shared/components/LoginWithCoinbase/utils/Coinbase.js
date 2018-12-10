const Coinbase = {
  baseUrl: 'https://coinbase.com',
  oauth: {
    authorize(params) {
      const redirectUri = `${Coinbase.baseUrl}/oauth/javascript_sdk_redirect`;
      let url = `${Coinbase.baseUrl}/oauth/authorize?response_type=code`;
      url += '&grant_type=authorization_code';
      url += `&redirect_uri=${encodeURIComponent(redirectUri)}`;
      url += `&client_id=${params.clientId}`;
      if (params.scopes) {
        url += `&scope=${encodeURIComponent(params.scopes)}`;
      }

      if (params.meta) {
        Object.keys(params.meta).forEach((key) => {
          url += `&meta[${encodeURIComponent(key)}]=${encodeURIComponent(params.meta[key])}`;
        });
      }

      const width = 850;
      const height = 600;
      const left = (screen.width - width) / 2;
      const top = (screen.height - height) / 4;
      window.open(url, 'coinbase-oauth', `width=${width},height=${height},left=${left},top=${top}`);

      window.addEventListener(
        'message',
        (event) => {
          if (event.origin.replace('www.', '') !== Coinbase.baseUrl) {
            return;
          }

          event.source.close();
          const data = JSON.parse(event.data);
          params.success(data);
        },
        false,
      );
    },
  },
};

module.exports = Coinbase;
