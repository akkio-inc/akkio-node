const https = require('https');
class Akkio {
  constructor(api_key) {
    this.request = (method, url, params) => new Promise((resolve, reject) => {
      params = Object.assign({
        api_key
      }, params)

      const data = method === 'GET' ? '' : JSON.stringify(params)
      const options = {
        hostname: 'api.akk.io',
        port: 443,
        path: `${url}${method === 'GET' ? `?${
          Object.entries(params)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
            .join('&')
      }` : ''}`,
        method,
        ...!!data
          ? {
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': data.length
            }
          }
          : {}
      }

      let s = '';
      const req = https.request(options, res => {
        res.on('data', d => {
          s += d;
        }).on('end', e => {
          resolve(JSON.parse(s));
        });
      });
      req.on('error', error => {
        reject(new Error(error))
      });
      req.write(data);
      req.end();
    });
  }

  datasets = {
    list: () => this.request('GET', '/v1/datasets'),
    get: (id) => this.request('GET', '/v1/datasets', { id }),
    create: (name) => this.request('POST', '/v1/datasets', { name }),
    delete: (id) => this.request('DELETE', '/v1/datasets', { id }),
    update: (id, { rows, parse_fields, fields }) => this.request('POST', '/v1/datasets', { id, rows, parse_fields, fields })
  }

  models = {
    list: () => this.request('GET', '/v1/models'),
    create: ({
      dataset_id,
      predict_fields,
      ignore_fields = [],
      extra_attention = false,
      duration = 10
    }) => this.request('POST', '/v1/models', {
      dataset_id,
      predict_fields,
      ignore_fields,
      extra_attention,
      duration
    }),
    delete: (id) => this.request('DELETE', '/v1/models', { id }),
    predict: (id, data) => this.request('POST', '/v1/models', { id, data }),
  }
}

module.exports = key => new Akkio(key);