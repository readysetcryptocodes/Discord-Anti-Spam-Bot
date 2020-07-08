# Discord-Anti-Spam-Bot

CAPTCHA Bot For Preventing Spam On Your Discord Server

Normally, discord spam bots can message anyone in your server. This bot prevents that.

It combines two crucial security features to make it impossible for most spam bots to spam your server and your users.

1. Discord's level 4 Security, which prevents new users from messaging anyone and any channel on the server for their first 10 minutes
2. A CAPTCHA check that kicks the new member if they can't solve it within 9 minutes.

Thus, most bots can't figure it out and are safetly removed.

Some users also have issues figuring out what to do, so it may be worthwhile to add some QOL improvements to our code to ensure your users know what to do.

### Features

1. New users to your server are
2. To get access, new users are tasked with solving a simple CAPTCHA
3. Once they complete the challenge, they are given a free role.
4. Built for cloud based hosting like Heroku to ensure 24/7 uptime. Requires 12-13MB of mem usage.
5. Async to ensure bot can process other tasks

### Checklist to turn on:

- Need an Unverified Role (which is not able to see any channels except the "are you human?" channel)
- Need an "Are You Human?" channel which informs new members to check their DMs
- Need a free role to assign members once they pass the check
- Must set server security to at least level 4 (the second highest security level)
- Must not be using any auto-role bots.
- However, if you have multiple roles, I suggest using Carl.gg to have sticky roles for users rejoining. Must blacklist the free and unverified role.
- Add bot token to .env file and config.json file
- You need somewhere to host 24/7. This bot was built for Heroku.

### Support or Contact

Having trouble with the bot? Join our server at https://discord.gg/UGZr4jR we’ll help you sort it out.
