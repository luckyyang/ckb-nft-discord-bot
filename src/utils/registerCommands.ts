import { Guild } from "discord.js";
import * as dotenv from "dotenv";

dotenv.config();

console.log('BOT_MANAGER_ROLE: ', process.env.BOT_MANAGER_ROLE)
export const registerCommands = async (guild: Guild) => {
  // Check if an existing lunar commander role exists in the server
  const existingManagerRole = guild.roles.cache.find(
    (role) => role.name === process.env.BOT_MANAGER_ROLE
  );

  // If no such role exists, create it
  const managerRole = existingManagerRole
    ? existingManagerRole
    : await guild.roles.create({
        name: process.env.BOT_MANAGER_ROLE,
        color: "BLUE",
        reason: "Managing the guild assistant.",
      });

  // now update the permissions to allow for BOT_MANAGER_ROLE to use specific commands
  const permissions = [
    {
      id: managerRole.id,
      type: "ROLE" as const,
      permission: true,
    },
  ];

  const registeredCommands = await guild.commands.fetch();

  // get the configured command
  const configureCommand = registeredCommands.find((command) => {
    return command.name == "guild-setup";
  });

  // add command permission
  await configureCommand!.permissions.add({ permissions });
};
