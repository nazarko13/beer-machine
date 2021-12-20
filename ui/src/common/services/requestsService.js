const requestConfig = (method, url, params = null, headers = {}) => {
  const config = {
    url,
    method,
    headers,
  };

  if (!params) {
    return config;
  }

  if (method === 'get' || method === 'delete') {
    config.params = params;
  }

  if (method !== 'get') {
    config.data = params;
  }

  return config;
};

export const getDataAction = (url, params = null, headers = {}) =>
  requestConfig('get', url, params, headers);

export const postDataAction = (url, params = null, headers = {}) =>
  requestConfig('post', url, params, headers);

export const putDataAction = (url, params = null, headers = {}) =>
  requestConfig('put', url, params, headers);
