import { Guild } from "discord.js";
import * as dotenv from "dotenv";

dotenv.config();

console.log('process.env.BOT_MANAGER_ROLE: ', process.env.BOT_MANAGER_ROLE)
export const registerCommands = async (guild: Guild) => {
  // Check if an existing lunar commander role exists in the server
  const existingBotRole = guild.roles.cache.find(
    (role) => role.name === process.env.BOT_MANAGER_ROLE
  );

  // If no such role exists, create it
  const botRole = existingBotRole
    ? existingBotRole
    : await guild.roles.create({
        name: process.env.BOT_MANAGER_ROLE,
        color: "BLUE",
        reason: "Managing the guild assistant.",
      });

  console.log('botRole: ', botRole)
  // // get the list of new commands
  // const newCommands = commandFiles.map((file) => {
  //   const commandFilePath = path.resolve(__dirname, `../commands/${file}`);
  //   const command = require(commandFilePath).default;
  //   return command.data.toJSON();
  // });

  // // register the commands
  // const rest = new REST({ version: "9" }).setToken(token);

  // await rest.put(Routes.applicationGuildCommands(clientId, guild.id) as any, {
  //   body: newCommands,
  // });

  // console.log(`Successfully registered application commands for ${guild.name}`);

  // now update the permissions to allow for BOT_MANAGER_ROLE to configure the bot
  const permissions = [
    {
      id: botRole.id,
      type: "ROLE" as const,
      permission: true,
    },
  ];

  const registeredCommands = await guild.commands.fetch();

  // get the configured command
  const configureCommand = registeredCommands.find((command) => {
    return command.name == "guild-setup";
  });
  console.log('configureCommand: ', configureCommand)

  // add command permission
  await configureCommand!.permissions.add({ permissions });
};
