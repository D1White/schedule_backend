const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require("cors");
const schedule = require('node-schedule');


const { GroupCtrl } = require("./controllers/GroupController");
const { urlParser } = require("./utils/urlParser");

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("Shalom")
})

// app.get('/ipz32', GroupCtrl.index);
app.get('/ipz32', GroupCtrl.index);
app.get('/url', GroupCtrl.downloadUrl);
app.patch('/ipz32', GroupCtrl.update);


schedule.scheduleJob(' * * * * * 5 ', () => {
  console.log('tick', new Date());
  urlParser();
});

app.listen(process.env.PORT, () => {
  console.log('SERVER RUNNING');
  console.log(`Server is listening at http://localhost:${process.env.PORT}/`);
})