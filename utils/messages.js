var moment = require("moment");

function format(user,text){
return { user:user,
  text:text,
  time: moment().format("h:mm a")} 
}

module.exports = format;
