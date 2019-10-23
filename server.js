const express = require('express'),
  db = require('./utils/database'),
  port = process.env.PORT || 5000,
  app = express();

db.sync()
  .then(() => console.log('connected to mysql database'))
  .catch(ex => console.error('Database Connection Error! --', ex));

app.listen(port, () => console.log(`server started on port: ${port}...`));
