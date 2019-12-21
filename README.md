# Discord Yearly Subs

This discord.js bot can help you to manage yearly subscriptions in your Discord server.

## Features
- Adds {yearlyRole} to users with a specific role
- Removes {yearlyRole} from all users at the end of the year
- Stats API at http://localhost:3000

## Quick start
- Clone the repository
- Install dependencies with `npm install` or `yarn install`
- Set up token, guild and roles in your config.js
- Run it with `npm start`

## Configuration
```js
module.exports = {
  
  // check changes every X seconds
  intervalCheck: 60,
  
  // discord bot token
  discordBotToken: '',
  
  // discord server id
  discordGuildId: '',
  
  // discord roles configuration
  discordRoles: {
    // id of the role that triggers yearly subscription
    trigger: '',
    
    // id of the role that grants yearly subscription
    yearlySub: ``
  }
  
}
```

#### Get your bot's token
- If you don't have a Discord bot:
  - Go to https://discordapp.com/developers/applications/
  - Click on **New Application** and create one
  - Switch to *Bot* tab and click on **Add Bot**
- Copy your token and put it into `discordBotToken` in your config.js

#### Get your guild's id
- In order to do this, you need *Developer Mode* enabled:
  - Open your Discord settings
  - Click on *Appearance*
  - Enable *Developer Mode*
- Right click on your Discord server, then **Copy ID**
- Put your guild's id into `discordGuildId` in your config.js

## Patreon integration
You can use this bot in combination with Patreon to automatically manage yearly subscriptions in your Discord server.

Just setup a Patreon tier that drops a specific role to new patrons and this bot will do the rest, allowing your users to stay in the server until the next year. Obviously, you will have to set some Discord permissions for these roles.
