const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mailRoutes = require('./mailRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', mailRoutes);

const PORT = process.env.PORT || 3000;
module.exports = app
