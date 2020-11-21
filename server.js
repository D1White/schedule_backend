const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require("cors");

const { GroupCtrl } = require("./controllers/GroupController");

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("It's live")
})

app.get('/ipz32', GroupCtrl.index);
app.get('/ipz32/:id', GroupCtrl.show);
app.get('/url', GroupCtrl.downloadUrl);
// app.patch('/ipz32', GroupCtrl.update);


app.listen(process.env.PORT, () => {
  console.log('SERVER RUNNING');
  console.log(`Server is listening at http://localhost:${process.env.PORT}/`);
})