const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000
const db = require('./model/db')
const routes = require('./api/router')

app.use(express.urlencoded())
app.use(express.json())
app.use(cors());
app.use(routes);

app.listen(port, () => console.log(`Server is listening on Port ${port}`));