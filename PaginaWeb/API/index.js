const express = require('express');
const cors = require('cors');
require('dotenv').config();
const routes = require('./routes')();
const app = express();

app.use(cors({ origin: '*'}));
app.use('/', routes);

const api_port = process.env.API_PORT || 8080;
app.listen(api_port, () => {
    console.log("API running on: ", api_port);
});