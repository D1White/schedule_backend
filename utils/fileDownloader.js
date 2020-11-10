const http = require("http");
const fs = require("fs");

const pattern3 = /\d.xlsx/g;
const pattern4 = /\/\d{1,2}\//g; //http://omc.univ.kiev.ua/wp-content/uploads/2020/11/Розклад-3-курс.xlsx


const downloadTable = (url) => {

    if (url) {
      console.log('Start file download...');
      let scheduleNum = url.match(pattern4);
      scheduleNum = parseInt(scheduleNum[0].slice(1, 3));
      const dest = `download/schedule${scheduleNum}.xlsx`;

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

};

exports.downloadTable = downloadTable;
