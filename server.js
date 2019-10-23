const express = require('express'),
  port = process.env.PORT || 5000,
  app = express();

app.listen(port, () => console.log(`server started on port: ${port}...`));
