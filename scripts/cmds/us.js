const { GoatWrapper } = require("fca-liane-utils");
const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
  config: {
    name: "us",
    aliases: [],
    version: "1.0",
    author: "SK-SIDDIK-KHAN",
    countDown: 5,
    role: 0,
    category: "love"
  },

  onStart: async function ({ message, event }) {
    const targetID = event.type === "message_reply" && event.messageReply?.senderID
      ? event.messageReply.senderID
      : Object.keys(event.mentions)[0];

    if (!targetID) {
      return message.reply("Please mention 1 person...");
    }

    const senderID = event.senderID;

    try {
      const imagePath = await bal(senderID, targetID);
      message.reply({
        body: "├─⊙𝐉𝐔𝐒𝐓 𝐘𝐎𝐔 𝐀𝐍𝐃 𝐌𝐄",
        attachment: fs.createReadStream(imagePath)
      }, () => fs.unlinkSync(imagePath)); 
    } catch (err) {
      console.error(err);
      message.reply("❌ Failed to generate image");
    }
  }
};

async function bal(one, two) {
  const avatarUrl1 = `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
  const avatarUrl2 = `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

  const [avone, avtwo] = await Promise.all([
    jimp.read(avatarUrl1),
    jimp.read(avatarUrl2)
  ]);

  avone.circle();
  avtwo.circle();

  const bgResponse = await axios.get(
    "https://drive.google.com/uc?export=download&id=1AJZNV21hzR9Hzo0WNhOOeHFRNtAVsm3p",
    { responseType: "arraybuffer" }
  );
  const bgBuffer = Buffer.from(bgResponse.data);
  const background = await jimp.read(bgBuffer);

  background
    .resize(466, 659)
    .composite(avone.resize(110, 110), 150, 76)
    .composite(avtwo.resize(100, 100), 245, 305);

  const outputPath = `tmp_${Date.now()}.png`;
  await background.writeAsync(outputPath);
  return outputPath;
}

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });