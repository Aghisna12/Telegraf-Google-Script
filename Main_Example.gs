var token = "Your-Telegram-Bot-Token";
var bot = new Telegram(token);

function myFunction() {
  var me = bot.getMe();
  Logger.log(me);
}
