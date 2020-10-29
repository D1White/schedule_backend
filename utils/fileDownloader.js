const http = require("http");
const fs = require("fs");
const { faunadb, client } = require('../core/db');

const { Get, Ref, Collection } = faunadb.query;

const pattern3 = /\d.xlsx/g;


const downloadTable = (url) => {

    if (url) {
      console.log('Start file download...');
      let scheduleNum = url.match(pattern3);
      scheduleNum = parseInt(scheduleNum[0].slice(0, 1));
      const dest = `download/schedule${scheduleNum}.xlsx`;
      // const dest = path.join(__dirname, 'download', `schedule${scheduleNum}.xlsx`);
      // console.log(dest);

      const file = fs.createWriteStream(dest);

      return new Promise((resolve, reject) => {
        let responseSent = false;
        http.get(url, (response) => {
            response.pipe(file);
            file.on("finish", () => {
              file.close(() => {
                if (responseSent) return;
                responseSent = true;
                console.log('✅ File downloaded!');
                resolve();
              });
            });
          })
          .on("error", (err) => {
            if (responseSent) return;
            responseSent = true;
            reject(err);
          });
      });

    }else {
      console.log(`🛑 File don't download`);
    }

  // })

};

exports.downloadTable = downloadTable;
