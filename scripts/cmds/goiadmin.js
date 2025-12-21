module.exports = {
  config: {
    name: "goiadmin",
    author: "SK-SIDDIK-KHAN",
    role: 0,
    shortDescription: "Responds when someone mentions the admin",
    longDescription: "Sends funny replies if someone mentions the admin while he's busy.",
    category: "awto",
    guide: "{pn}"
  },

  onChat: function({ api, event }) {
    const ownerID = "100005002412625;

    if (event.senderID !== ownerID) {
      const mentionedIDs = Object.keys(event.mentions || {});

      if (mentionedIDs.includes(ownerID)) {
        const messages = [
          "Don't Mention My Owner, Busy Right Now 💞",
          "আমার বস চিপায় বিজি আছে___🌝",
          "মেয়ে পটাতে গেছে___😁",
          "এমন ভাবে মেনশান না দিয়ে একটা জি এফ দাও__🙈",
          "এত ডাকিস কেন__😡\nআমার বস অনেক বিজি__☺️",
          "বস কই তুমি\nতোমারে এক বলদে খুঁজ করে__🤣"
        ];

        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        return api.sendMessage(randomMsg, event.threadID, event.messageID);
      }
    }
  },

  onStart: async function({}) {
  }
};
