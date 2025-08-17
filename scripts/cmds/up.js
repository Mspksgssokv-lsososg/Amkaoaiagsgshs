const { GoatWrapper } = require("fca-liane-utils");
const os = require('os');
const process = require('process');
const { formatDuration, intervalToDuration } = require('date-fns');

const botStartTime = Date.now();

const imageUrl = "https://graph.facebook.com/100000667148369/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";

module.exports = {
  config: {
    name: "up",
    author: "SK-SIDDIK-KHAN",
    description: "Get system and bot uptime information",
    category: "utility",
    usages: "{pn}",
    usePrefix: false,
    role: 0,
  },

  onStart: async ({ api, message, usersData, threadsData }) => {
    const currentTime = Date.now();
    const botUptime = Math.floor((currentTime - botStartTime) / 1000);
 
    const formatUptime = (seconds) => {
      const uptime = formatDuration(intervalToDuration({ start: 0, end: seconds * 1000 }));
      return uptime;
    };
 
    const totalUsers = (await usersData.getAll()).length;
    const totalThreads = (await threadsData.getAll()).length;
 
    const uptimeMessage = `
╭───〔 ⏳ 𝐔𝐩𝐭𝐢𝐦𝐞 〕

├🟢 𝐒𝐭𝐚𝐭𝐮𝐬: 𝐎𝐧𝐥𝐢𝐧𝐞 ✅

├⏰ 𝐔𝐩𝐭𝐢𝐦𝐞: ${formatUptime(botUptime)}

├👥 𝐓𝐨𝐭𝐚𝐥 𝐔𝐬𝐞𝐫𝐬: ${totalUsers}

╰📁𝐓𝐨𝐭𝐚𝐥 𝐓𝐡𝐫𝐞𝐚𝐝𝐬: ${totalThreads}`;

    await message.reply({
      body: uptimeMessage,
      attachment: await global.utils.getStreamFromURL(imageUrl)
    });
  }
};
const wrapper = new GoatWrapper(module.exports); wrapper.applyNoPrefix({ allowPrefix: true });
