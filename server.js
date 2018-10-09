const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema.js');
const db = require('./db');
const morgan = require('morgan');
const path = require('path');

const app = express();

app.use(morgan('dev'));

app.use(
  '/graphql',
  expressGraphQL({
    schema,
    graphiql: true,
  })
);

app.use(express.static(path.join(__dirname, 'public')));

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

const syncDB = async () => {
  try {
    await db.sync();
    app.listen(4000, () => {
      console.log('server running on port 4000');
    });
  } catch (error) {
    console.error(error);
  }
};

syncDB();
