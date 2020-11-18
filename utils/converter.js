const XLSX = require("xlsx");
const { faunadb, client } = require('../core/db');

const { Ref, Collection, Update, Create } = faunadb.query;

let data = {
  info: {
    date: '',
    time: '',
    fullDate: '',
    build: ''
  },
  schedule: {
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
  },
}


const regex = /\s{2}.+/g;

const bruteForce = (from, to, dayOfWeek, worksheet) => {

  let arr = [];

  for (let j = from; j < to; j++) {
    if(worksheet[`P${j}`]){
      const separator = worksheet[`P${j}`].v.search(regex)

      const obj = {
        teacher: worksheet[`P${j}`].v.slice(0, separator),
        subject: worksheet[`P${j}`].v.slice(separator).trim(),
      }

      arr.push(obj);
    }else {
      arr.push({teacher: '', subject: ''});
    }
  }

  switch (dayOfWeek) {
    case 1:
      data.schedule.mon = arr;
      break;
    case 2:
      data.schedule.tue = arr;
      break;
    case 3:
      data.schedule.wed = arr;
      break;
    case 4:
      data.schedule.thu = arr;
      break;
    case 5:
      data.schedule.fri = arr;
      break;
    default:
      break;
  }
  
}

const Converter = (fileName) => {
  console.log('Start data convert...');

  const workbook = XLSX.readFile(fileName);
  const worksheet = workbook.Sheets['Лист1'];

  //Monday
  bruteForce(7, 11, 1, worksheet);
  //Tue
  bruteForce(11, 15, 2, worksheet);
  //Wed
  bruteForce(15, 19, 3, worksheet);
  //Thu
  bruteForce(19, 23, 4, worksheet);
  //Fri
  bruteForce(23, 27, 5, worksheet);

  const date = new Date();

  data.info.date = date.toString().slice(4, 15);
  data.info.time = date.toString().slice(16, 24);
  data.info.fullDate = date.toString();

  if (process.env.PORT === '3001') {
    data.info.build = 'local';
  }else {
    data.info.build = 'heroku';
  }

  client.query(
      Create(Collection("schedule"),
        { data: data}
      )
  )

  console.log('✅ Data converted!');

  // return data;
  // console.log(data);

}

exports.Converter = Converter;