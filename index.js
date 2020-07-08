const Discord = require("discord.js");
require("dotenv").config();
const { prefix, token } = require("./config.json");
const client = new Discord.Client();
const createCaptcha = require("./captcha");
const fs = require("fs").promises;

//CURRENTLY RUNNING:
//Heroku App:
//PREFIX: !

client.once("ready", async () => {
  //
  //CLIENT ON READY
  //
  console.log("Authentication Active.");
});

const welcomeEmbed = new Discord.MessageEmbed()
  .setAuthor("Authentication Bot")
  .setTitle("Welcome To Our Server!")
  .setColor(0xfffe03)
  .setThumbnail("")
  .setDescription(
    "Ready to get started? To begin, let's briefly cover what's in the server."
  )
  .addFields(
    {
      name: "**Our Server Information Channels**",
      value:
        "**START BY GOING TO OUR START HERE CHANNEL**!\n It's a helpful map to see what each of our channels are about!",
    },
    {
      name: "**Feature 1**",
      value: "Feature Description",
    },
    {
      name: "**Feature 2**",
      value: "Feature Description",
    },
    {
      name: "**Feature 3**",
      value: "Feature Description",
    },
    {
      name: "**Do You Need Help?**",
      value: "Feel free to DM the mods!",
    }
  );

const firstEmbed = new Discord.MessageEmbed()
  .setAuthor("Authentication Bot")
  .setTitle("Welcome To Our Server!")
  .setColor(0xfffe03)
  .setDescription(
    "To be verified and gain access to our server, simply respond with the **exact text** of the box below. **You have 9 minutes** to respond correctly"
  );

const passEmbed = new Discord.MessageEmbed()
  .setAuthor("Authentication Bot")
  .setTitle("You Have Passed Verification!")
  .setColor(0xfffe03)
  .setDescription(
    "You now have access to the whole server! If this is your first time joining, stay here for a moment! **I'm sending you our official welcome message!**"
  );

const incorrectEmbed = new Discord.MessageEmbed()
  .setAuthor("Authentication Bot")
  .setTitle("Your Entry Was Incorrect!")
  .setColor(0xfffe03)
  .setDescription(
    "Please try again! You can make attempts until your time's up!"
  );

const kickEmbed = new Discord.MessageEmbed()
  .setAuthor("Authentication Bot")
  .setTitle("Security Verification Check Failed!")
  .setColor(0xfffe03)
  .setDescription(
    "You have been removed from the server to ensure the security of our community\n**Please note:** you have not been banned & can rejoin to reattempt the check.**"
  );

//
//CLIENT ON MESSAGE
//

client.on("message", async (message) => {
  async function sleep(ms) {
    console.log(`Sleep Engaged For ` + ms);
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  if (
    message.author.bot &&
    message.content.startsWith("Check your private messages")
  ) {
    try {
      await message.delete({ timeout: 90000 });
      console.log(`Deleted Welcome Message`);
    } catch (error) {
      console.log(`ERROR IN DELETE MESSAGE!`);
    }
  }
});

//
//CLIENT ON MEMBER ADD
//

client.on("guildMemberAdd", async (member) => {
  const logChannel = member.guild.channels.cache.find(
    (ch) => ch.name === "LOG CHANNEL NAME HERE"
  );
  const welChannel = member.guild.channels.cache.find(
    (ch) => ch.name === "WELCOME CHANNEL NAME HERE"
  );
  const newChannel = member.guild.channels.cache.find(
    (ch) => ch.name === "UNVERIFIED CHANNEL NAME HERE"
  );
  async function timeout(ms) {
    console.log(`Timeout Engaged For ` + ms);
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  if (member.roles.cache.some((role) => role.name === "NON FREE ROLE NAME")) {
    welChannel.send(`Welcome back To our server, ${member}!`);
  } else if (
    member.roles.cache.some((role) => role.name === "NON FREE ROLE NAME")
  ) {
    welChannel.send(`Welcome back To our server, ${member}!`);
  } else {
    let unverifiedRole = "UNVERIFIED ROLE ID HERE";
    await member.roles.add(unverifiedRole);
    await newChannel.send(
      `Check your private messages, ${member}! Welcome to our server!`
    );
    await member.send(firstEmbed);
    const captcha = await createCaptcha();
    try {
      const msg = await member.send(" \n", {
        files: [
          {
            attachment: `${__dirname}/captchas/${captcha}.png`,
            name: `${captcha}.png`,
          },
        ],
      });
      try {
        const filter = (m) => {
          if (m.author.bot) return;
          if (m.author.id === member.id && m.content === captcha) {
            return true;
          } else {
            m.channel.send(incorrectEmbed);
            return false;
          }
        };
        const response = await msg.channel.awaitMessages(filter, {
          max: 1,
          time: 180000,
          errors: ["time"],
        });
        if (response) {
          await member.send(passEmbed);
          let unverifiedRole = "UNVERIFIED ROLE ID HERE";
          await member.roles.remove(unverifiedRole);
          let freeRole = "FREE ROLE ID HERE";
          await member.roles.add(freeRole);
          await logChannel.send(`Adding Member Role: ${freeRole} to ${member}`);
          await timeout(10000);
          await member.send(welcomeEmbed);
          await timeout(60000);
          await welChannel.send(
            `${member}, welcome to our Discord! Be sure to introduce yourself to the server!`
          );
          await fs
            .unlink(`${__dirname}/captchas/${captcha}.png`)
            .catch((err) => console.log(err));
        }
      } catch (err) {
        await member.send(kickEmbed);
        await logChannel.send(`Kicking Member: ${member}!`);
        let unverifiedRole = "UNVERIFIED ROLE ID HERE";
        await member.roles.remove(unverifiedRole);
        await member.kick();
        console.log(`Kicked ${member.displayName}`);
        await fs
          .unlink(`${__dirname}/captchas/${captcha}.png`)
          .catch((err) => console.log(err));
      }
    } catch (err) {
      console.log(err);
    }
  }
});

//
//CLIENT ON MEMBER REMOVE
//

client.on("guildMemberRemove", async (member) => {
  const fetchedLogs = await member.guild.fetchAuditLogs({
    limit: 1,
    type: "MEMBER_KICK",
  });
  const kickLog = fetchedLogs.entries.first();
  if (!kickLog)
    return console.log(
      `${member.user.tag} left the guild, most likely of their own will.`
    );
  const { executor, target } = kickLog;
  if (target.id === member.id) {
    console.log(`${member.user.tag} left the guild; kicked by ${executor.tag}`);
  } else {
    console.log(
      `${member.user.tag} left the guild, audit log fetch was inconclusive.`
    );
  }
});
client.login(token);
