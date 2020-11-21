const request = require("request");

const { downloadTable } = require("./fileDownloader");
const { Converter } = require("./converter");
const { faunadb, client } = require('../core/db');

const { Ref, Collection, Update, Create } = faunadb.query;

const URL = "http://omc.univ.kiev.ua/ru/studentu-i-vykladachu/rozklad-zanyat/";

const pattern = /\<a href=".+"><span style=".+">Розклад 3 курсу/g;
const pattern2 = /http.+\.xlsx/g;

const urlParser = () => {

  console.log('Url Parsing...');

  request(URL, (err, res, body) => {
    if (err) throw err;

    let result = body.match(pattern);
    result = result[0].match(pattern2);

    if (res.statusCode === 200) {

        console.log('✅ Url Parsed!');

        client.query(
          Update(
            Ref(Collection("downloadUrl"), "280625102128677381"),
            {data: {"downloadUrl": result[0]}}
          )
        )

        console.log('✅ Url Sended!');


        downloadTable(result[0]).then(() => {

          let scheduleNum = result[0].match(/\/\d{1,2}\//g);
          scheduleNum = parseInt(scheduleNum[0].slice(1, 3));
          
          Converter(`download/schedule${scheduleNum}.xlsx`);

        });

    }else {
      console.warn("🛑 Parsing error");
      console.log('Response code: ', res.statusCode);
    }
    
  });


};

exports.urlParser = urlParser;
