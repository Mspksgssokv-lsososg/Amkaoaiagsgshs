const { GoatWrapper } = require("fca-liane-utils");
module.exports = {

config: {

name: "spy",

version: "1.0.0",

role: 0,

author: "SK-SIDDIK-KHAN",

Description: "Get user information and profile photo",

category: "information",

countDown: 10,

},

   onStart: async function ({ event, message, usersData, api, args, getLang }) {
    let avt;
    const uid1 = event.senderID;
    const uid2 = Object.keys(event.mentions)[0];
    let uid;

    if (args[0]) {
      // Check if the argument is a numeric UID
      if (/^\d+$/.test(args[0])) {
        uid = args[0];
      } else {
        // Check if the argument is a profile link
        const match = args[0].match(/profile\.php\?id=(\d+)/);
        if (match) {
          uid = match[1];
        }
      }
    }

    if (!uid) {
      // If no UID was extracted from the argument, use the default logic
      uid = event.type === "message_reply" ? event.messageReply.senderID : uid2 || uid1;
    }

    api.getUserInfo(uid, async (err, userInfo) => {
      if (err) {
        return message.reply("Failed to retrieve user information.");
      }

      const avatarUrl = await usersData.getAvatarUrl(uid);

      // Gender mapping
      let genderText;
      switch (userInfo[uid].gender) {
        case 1:
          genderText = "𝙶𝚒𝚛𝚕";
          break;
        case 2:
          genderText = "Boy";
          break;
        default:
          genderText = "𝙶𝚊𝚢";
      }

      // Construct and send the user's information with avatar
      const money = (await usersData.get(uid)).money;

const allUser = await usersData.getAll(), rank = allUser.slice().sort((a, b) => b.exp - a.exp).findIndex(user => user.userID === uid) + 1, moneyRank = allUser.slice().sort((a, b) => b.money - a.money).findIndex(user => user.userID === uid) + 1;

const position = userInfo[uid].type;
      const userInformation = `

⊙────[ 𝐔𝐒𝐄𝐑 𝐈𝐍𝐅𝐎 ]────⊙

├‣ 𝙽𝚊𝚖𝚎: ${userInfo[uid].name}

├‣ 𝙶𝚎𝚗𝚍𝚎𝚛: ${genderText}

├‣ 𝚄𝙸𝙳: ${uid}

├‣ 𝚄𝚜𝚎𝚛𝚗𝚊𝚖𝚎: ${userInfo[uid].vanity ? userInfo[uid].vanity : "𝙽𝚘𝚗𝚎"}

├‣ 𝙿𝚛𝚘𝚏𝚒𝚕𝚎 𝚄𝚁𝙻: ${userInfo[uid].profileUrl}

├‣ 𝙱𝚒𝚛𝚝𝚑𝚍𝚊𝚢: ${userInfo[uid].isBirthday !== false ? userInfo[uid].isBirthday : "𝙿𝚛𝚒𝚟𝚊𝚝𝚎"}

├‣ 𝙽𝚒𝚌𝚔𝙽𝚊𝚖𝚎: ${userInfo[uid].alternateName || "𝙽𝚘𝚗𝚎"}

├‣ 𝙼𝚘𝚗𝚎𝚢: $${formatMoney(money)}

├‣ 𝚁𝚊𝚗𝚔: #${rank}/${allUser.length}

├‣ 𝙼𝚘𝚗𝚎𝚢 𝚁𝚊𝚗𝚔: #${moneyRank}/${allUser.length}

╰‣ 𝚃𝙷𝙰𝙽𝙺𝚂 𝙵𝙾𝚁 𝚄𝚂𝙸𝙽𝙶 𝚂𝙺 𝙱𝙾𝚃`;

      message.reply({
        body: userInformation,
        attachment: await global.utils.getStreamFromURL(avatarUrl)
      });
    });
  }
}
function formatMoney(num) {

const units = ["", "K", "M", "B", "T", "Q", "Qi", "Sx", "Sp", "Oc", "N", "D"];

let unit = 0;

while (num >= 1000 && ++unit < units.length) num /= 1000;

return num.toFixed(1).replace(/\.0$/, "") + units[unit];

}
const wrapper = new GoatWrapper(module.exports); wrapper.applyNoPrefix({ allowPrefix: true });
