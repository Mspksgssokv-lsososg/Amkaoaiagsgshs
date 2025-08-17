const { GoatWrapper } = require("fca-liane-utils");
module.exports.config = {
	name: "cn",
	version: "1.0.1",
	role: 0,
	author: "SK-SIDDIK-KHAN",
	description: "Text translation",
   category: "media",
	usages: "[en/ko/ja/vi] [Text]",
	countDowns: 5,
	dependencies: {
		"request":  ""
	}
};
 
module.exports.onStart = async ({ api, event, args }) => {
	const request = require('request');
	var content = args.join(" ");
	if (content.length == 0 && event.type != "message_reply") return global.utils.throwError(this.config.name, event.threadID,event.messageID);
	var translateThis = content.slice(0, content.indexOf(" ->"));
	var lang = content.substring(content.indexOf(" -> ") + 4);
	if (event.type == "message_reply") {
		translateThis = event.messageReply.body
		if (content.indexOf("-> ") !== -1) lang = content.substring(content.indexOf("-> ") + 3);
		else lang = global.GoatBot.config.language;
	}
	else if (content.indexOf(" -> ") == -1) {
		translateThis = content.slice(0, content.length)
		lang = global.GoatBot.config.language;
	}
	return request(encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=cmn&dt=t&q=${translateThis}`), (err, response, body) => {
		if (err) return api.sendMessage("An error has occurred!", event.threadID, event.messageID);
		var retrieve = JSON.parse(body);
		var text = '';
		retrieve[0].forEach(item => (item[0]) ? text += item[0] : '');
		var fromLang = (retrieve[2] === retrieve[8][0][0]) ? retrieve[2] : retrieve[8][0][0]
		api.sendMessage(` ${text}\n\n`, event.threadID, event.messageID);
	});
      }
      const wrapper = new GoatWrapper(module.exports); wrapper.applyNoPrefix({ allowPrefix: true });
 
