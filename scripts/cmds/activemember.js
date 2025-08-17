const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const request = require("request");

module.exports = {
  config: {
    name: "activemember",
    aliases: ["active", "topactive", "actives"],
    version: "1.2",
    author: "SK-SIDDIK-KHAN",
    countDown: 5,
    role: 0,
    shortDescription: "Top 15 active members",
    longDescription: "Displays top 15 users by number of messages sent in the current chat",
    category: "fun",
  },

  onStart: async function ({ api, event }) {
    const threadId = event.threadID;

    try {
      const threadInfo = await api.getThreadInfo(threadId);
      const participants = threadInfo.participantIDs;

      const messageCounts = {};
      participants.forEach(id => messageCounts[id] = 0);

      const messages = await api.getThreadHistory(threadId, 50000);

      for (const message of messages) {
        if (messageCounts[message.senderID] !== undefined) {
          messageCounts[message.senderID]++;
        }
      }

      const topUsers = Object.entries(messageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15);

      let output = `♡   ∩_∩\n（„• ֊ •„)♡\n╭─∪∪────────────⟡\n│ ✨ 𝗧𝗼𝗽 𝟭𝟱 𝗔𝗰𝘁𝗶𝘃𝗲 𝗠𝗲𝗺𝗯𝗲𝗿𝘀 ✨\n`;

      for (const [userId, count] of topUsers) {
        const userInfo = await api.getUserInfo(userId);
        const name = userInfo[userId]?.name || "Unknown User";
        output += `├───────────────⟡\n│${name}\n│Sent ${count} messages\n`;
      }

      output += `╰───────────────⟡`;

      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);

      const imagePath = path.join(cacheDir, "1.png");
      const imageUrl = threadInfo.imageSrc || "https://i.imgur.com/U7xN0xl.png";

      await new Promise((resolve, reject) => {
        request(imageUrl)
          .pipe(fs.createWriteStream(imagePath))
          .on("finish", resolve)
          .on("error", reject);
      });

      const message = {
        body: output,
        attachment: fs.createReadStream(imagePath)
      };

      await api.sendMessage(message, threadId);
    } catch (error) {
      console.error("Error in activemember:", error);
      api.sendMessage("❌ Failed to fetch active members", threadId);
    }
  }
};