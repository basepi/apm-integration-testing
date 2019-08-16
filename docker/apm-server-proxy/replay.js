const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const readFile = promisify(fs.readFile);

const APM_SERVER_HOST = '0.0.0.0';
const APM_SERVER_PORT = '8200';
const PATH_TO_FILE = path.resolve(__dirname, './shared-volume/captured-events-small.json')

async function init() {
  const content = await readFile(PATH_TO_FILE);
  const items = JSON.parse(content.toString());

  for await (let item of items) {
    try {
      console.log(`http://${APM_SERVER_HOST}:${APM_SERVER_PORT}${item.url}`);
      await axios({
        method: item.method,
        url: `http://${APM_SERVER_HOST}:${APM_SERVER_PORT}${item.url}`,
        headers: { 'content-type': 'application/x-ndjson' },
        data: item.data
      });
      console.log('done');
    } catch (e) {
      console.log('error', e);
      console.log(e.response.data);
    }
  }
}

init();
