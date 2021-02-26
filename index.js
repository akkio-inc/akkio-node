const https = require('https');
class Akkio {
  constructor(key) {
    this.API_KEY = key;
    this.PORT = 443;
    this.URL = 'api.akk.io';
  }
  request(method, address, params) {
    return new Promise((resolve, reject) => {
      let paramStrings = [];
      for (let k in params) {
        paramStrings.push(`${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`);
      }
      let queryString = '';
      let postData = '';
      if (method == 'GET') {
        queryString = `?${paramStrings.join('&')}`;
      } else {
        postData = JSON.stringify(params);
      }
      let options = {
        hostname: this.URL,
        port: this.PORT,
        path: `${address}${queryString}`,
        method: method
      };
      if (method != 'GET') {
        options.headers = {
          'Content-Type': 'application/json',
          'Content-Length': postData.length
        }
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
        console.error(error)
      });
      req.write(postData);
      req.end();
    });
  }
  getModels() {
    return this.request('GET', '/v1/models', {
      api_key: this.API_KEY
    });
  }

  deleteModel(id) {
    return this.request('DELETE', '/v1/models', {
      api_key: this.API_KEY,
      id: id
    });
  }

  getDatasets() {
    return this.request('GET', '/v1/datasets', {
      api_key: this.API_KEY
    });
  }
  getDataset(id) {
    return this.request('GET', '/v1/datasets', {
      api_key: this.API_KEY,
      id: id
    });
  }


  createDataset(name) {
    return this.request('POST', '/v1/datasets', {
      api_key: this.API_KEY,
      name: name
    });
  }

  deleteDataset(id) {
    return this.request('DELETE', '/v1/datasets', {
      api_key: this.API_KEY,
      id: id
    });
  }

  addRowsToDataset(id, rows) {
    return this.request('POST', '/v1/datasets', {
      api_key: this.API_KEY,
      id: id,
      rows: rows
    });
  }

  parseDataset(id) {
    return this.request('POST', '/v1/datasets', {
      api_key: this.API_KEY,
      id: id,
      parse_fields: true
    });
  }

  createModel(id, predict_fields, ignore_fields, params) {
    ignore_fields = ignore_fields || [];
    let requestParams = {
      api_key: this.API_KEY,
      dataset_id: id,
      predict_fields: predict_fields,
      ignore_fields: ignore_fields,
      extra_attention: false,
      duration: 10
    };
    if (params) {
      Object.assign(requestParams, params);
    }
    return this.request('POST', '/v1/models', requestParams);
  }

  makePrediction(id, data) {
    return this.request('POST', '/v1/models', {
      api_key: this.API_KEY,
      id: id,
      data: data
    });
  }
}


module.exports = key => new Akkio(key);
