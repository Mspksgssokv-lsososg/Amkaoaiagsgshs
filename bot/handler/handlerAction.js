const createFuncMessage = global.utils.message;
const handlerCheckDB = require("./handlerCheckData.js");

const request = require("request");
const axios = require("axios");
const fs = require("fs-extra");

module.exports = (api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData) => {
	const handlerEvents = require(process.env.NODE_ENV === 'development' ? "./handlerEvents.dev.js" : "./handlerEvents.js")(
		api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData
	);

	return async function (event) {
		const message = createFuncMessage(api, event);

		await handlerCheckDB(usersData, threadsData, event);
		const handlerChat = await handlerEvents(event, message);
		if (!handlerChat) return;

		const { onStart, onChat, onReply, onEvent, handlerEvent, onReaction, typ, presence, read_receipt } = handlerChat;

		switch (event.type) {
			case "message":
			case "message_reply":
			case "message_unsend":
				onChat();
				onStart();
				onReply();

				if (event.type === "message_unsend") {
					let resend = await threadsData.get(event.threadID, "settings.reSend");
					if (resend && event.senderID !== api.getCurrentUserID()) {
						const msgIndex = global.reSend?.[event.threadID]?.findIndex(e => e.messageID === event.messageID);
						if (msgIndex > -1) {
							const deletedMsg = global.reSend[event.threadID][msgIndex];
							const senderName = await usersData.getName(event.senderID);
							const attachments = [];

							if (deletedMsg.attachments?.length) {
								let count = 0;
								for (const att of deletedMsg.attachments) {
									if (att.type === "audio") {
										count++;
										const filePath = `scripts/cmds/tmp/${count}.mp3`;
										const res = (await axios.get(att.url, { responseType: "arraybuffer" })).data;
										fs.writeFileSync(filePath, Buffer.from(res));
										attachments.push(fs.createReadStream(filePath));
									} else {
										attachments.push(await global.utils.getStreamFromURL(att.url));
									}
								}
							}

							api.sendMessage({
								body: `${senderName} removed:\n\n${deletedMsg.body}`,
								mentions: [{ id: event.senderID, tag: senderName }],
								attachment: attachments
							}, event.threadID);
						}
					}
				}
				break;

			case "event":
				handlerEvent();
				onEvent();
				break;

			case "message_reaction":
				onReaction();

				if (event.reaction === "🖕") {
					if (["100005002412625"].includes(event.userID)) {
						api.removeUserFromGroup(event.senderID, event.threadID, err => {
							if (err) console.error(err);
						});
					} else {
						message.send(":)");
					}
				}

				if (["😠", "😡", "🤬", "😾"].includes(event.reaction)) {
					if (event.senderID === api.getCurrentUserID()) {
						if (["100005002412625"].includes(event.userID)) {
							message.unsend(event.messageID);
						} else {
							message.send(":)");
						}
					}
				}
				break;

			case "typ":
				typ();
				break;

			case "presence":
				presence();
				break;

			case "read_receipt":
				read_receipt();
				break;

			default:
				break;
		}
	};
};
