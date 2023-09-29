import express from 'express';
import { blogStatsController, BlogSearchController } from './controller.js';

const app = express();
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/blog-stats', blogStatsController);

app.get('/api/blog-search', BlogSearchController);



app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
}
);

