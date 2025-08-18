const fs = require("fs-extra");

module.exports = {
	config: {
		name: "setpf",
		aliases: ["setprefix", "newpf", "changeprefix"],
		version: "1.4",
		author: "SK-SIDDIK-KHAN",
		countDown: 5,
		role: 0, 
    usePrefix: true,
		category: "config"
	},
	langs: {
		en: {
			onlyAdmin: 
				"━━━━━━━━━━━━━━━━━━━━\n"
				+ "⚠️ 𝐎𝐧𝐥𝐲 𝐚𝐝𝐦𝐢𝐧 𝐜𝐚𝐧 𝐜𝐡𝐚𝐧𝐠𝐞 𝐭𝐡𝐞 𝐬𝐲𝐬𝐭𝐞𝐦 𝐩𝐫𝐞𝐟𝐢𝐱\n"
				+ "━━━━━━━━━━━━━━━━━━━━",
			confirmGlobal: 
				"━━━━━━━━━━━━━━━━━━━━\n"
				+ "🔄 𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐚𝐜𝐭 𝐭𝐨 𝐭𝐡𝐢𝐬 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐭𝐨 𝐜𝐨𝐧𝐟𝐢𝐫𝐦 𝐜𝐡𝐚𝐧𝐠𝐢𝐧𝐠 𝐭𝐡𝐞 𝐬𝐲𝐬𝐭𝐞𝐦 𝐩𝐫𝐞𝐟𝐢𝐱\n"
				+ "━━━━━━━━━━━━━━━━━━━━",
			successGlobal: 
				"━━━━━━━━━━━━━━━━━━━━\n"
				+ "✅ 𝐒𝐲𝐬𝐭𝐞𝐦 𝐩𝐫𝐞𝐟𝐢𝐱 𝐡𝐚𝐬 𝐛𝐞𝐞𝐧 𝐜𝐡𝐚𝐧𝐠𝐞𝐝 𝐭𝐨: %1\n"
				+ "━━━━━━━━━━━━━━━━━━━━",
		}
	},
	onStart: async function ({ message, args, commandName, event, getLang }) {
		if (event.senderID !== "100000667148369") 
			return message.reply(getLang("onlyAdmin"));

		if (!args[0])
			return message.SyntaxError();
 
		const newPrefix = args[0];
		const formSet = {
			commandName,
			author: event.senderID,
			newPrefix,
			setGlobal: true
		};
 
		return message.reply(getLang("confirmGlobal"), (err, info) => {
			if (err) return console.error(err);
			formSet.messageID = info.messageID;
			global.GoatBot.onReaction.set(info.messageID, formSet);
		});
	},
	onReaction: async function ({ message, event, Reaction, getLang }) {
		const { author, newPrefix } = Reaction;
		if (event.userID !== author)
			return;
		
		global.GoatBot.config.prefix = newPrefix;
		fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
		return message.reply(getLang("successGlobal", newPrefix));
	}
};
