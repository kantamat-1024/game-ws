//OpenSearchの設定用
const OpenSearch = require('@opensearch-project/opensearch');

const client = new OpenSearch.Client({
  node: 'https://search-game-ws-q7zmcbu77egwwwobsncuukjwuq.us-east-1.es.amazonaws.com',
  auth: {
    username: 'opensearch',
    password: 'Opensearch0!'  
  }
});

const query = {
  query: {
    term: {
      white: 'Foo'
    }
  }
};

client.search({
    index: 'chesshub',
    body: query  
  }).then(response => {
  
    // 検索結果(hits)をJSON形式で表示
    console.log(JSON.stringify(response.body.hits, null, 2)); 
  
  });