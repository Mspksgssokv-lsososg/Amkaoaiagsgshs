const fs = require("fs-extra");
const axios = require("axios");
const Jimp = require("jimp");

module.exports = {
  config: {
    name: "blur",
    version: "1.3",
    author: "SK-SIDDIK-KHAN",
    countDown: 5,
    role: 0,
    category: "image",
    usePrefix: false,
  },

  onStart: async function ({ event, api }) {
    const path = __dirname + `/cache/blur.png`;

    const targetID =
      Object.keys(event.mentions)[0] ||
      (event.messageReply?.senderID) ||
      event.senderID;

    try {
      const url = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const response = await axios.get(url, { responseType: "arraybuffer" });

      const image = await Jimp.read(response.data);
      image.blur(3);
      await image.writeAsync(path);

      api.sendMessage(
        {
          body: "",
          attachment: fs.createReadStream(path)
        },
        event.threadID,
        () => fs.unlinkSync(path),
        event.messageID
      );

    } catch (err) {
      console.error("❌ BLUR ERROR:", err);
      api.sendMessage("❌ Could not blur the image", event.threadID, event.messageID);
    }
  },
};