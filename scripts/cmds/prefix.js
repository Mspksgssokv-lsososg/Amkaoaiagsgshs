module.exports = {
  config: {
    name: "prefix",
    version: "1.2",
    author: "SK-SIDDIK-KHAN",
    countDown: 5,
    role: 0,
    category: "auto",
  },

  onStart: async function () {},

  onChat: async function ({ event, message, usersData }) {
    try {
      if (!event.body || event.body.toLowerCase() !== "prefix") return;

      const botPrefix = global.GoatBot?.config?.prefix || "No prefix set";

      const serverTime = new Date().toLocaleTimeString("en-BD", {
        timeZone: "Asia/Dhaka",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      });

      return message.reply({
        body:
`♡  ∩_∩
（„• ֊ •„)♡
╭─∪∪────────────⟡
│𝐏𝐑𝐄𝐅𝐈𝐗-𝐂𝐌𝐃-𝐈𝐍𝐅𝐎
├───────────────⟡
│🌍 𝐒𝐲𝐬𝐭𝐞𝐦 𝐏𝐫𝐞𝐟𝐢𝐱: ${botPrefix}
├───────────────⟡
│⏰ 𝐓𝐢𝐦𝐞: ${serverTime}
╰───────────────⟡`,
        attachment: await global.utils.getStreamFromURL("https://i.postimg.cc/FKpvnK68/launcher-icon.jpg")
      });

    } catch (error) {
      console.error("Prefix command error:", error);
    }
  }
};
