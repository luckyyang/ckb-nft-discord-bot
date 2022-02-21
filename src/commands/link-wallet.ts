import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import jwt from "jsonwebtoken";
import { generateSignMessageURL } from "@nervina-labs/flashsigner"
import * as dotenv from "dotenv";

dotenv.config();

const DISCORD_VERIFICATION_SECRET = process.env.DISCORD_VERIFICATION_SECRET;
console.log("DISCORD_VERIFICATION_SECRET: ", process.env.DISCORD_VERIFICATION_SECRET)

export default {
  data: new SlashCommandBuilder()
    .setName("link-wallet")
    .setDescription("Links a wallet to your discord account."),
  execute: async (
    interaction: CommandInteraction
  ) => {
    // verify the interaction is valid

    const token = jwt.sign(
      { userID: interaction.user.id },
      DISCORD_VERIFICATION_SECRET,
      { expiresIn: "1h" }
    );
    const successsuccessUrl = "http://localhost:3000/"
    const url = generateSignMessageURL(successsuccessUrl, { message: token });

        await interaction.reply({
      content: `Greetings from the Rostra Guild Assistant! Please click [here](${url}) to link your terra wallet with your discord account.`,
      ephemeral: true,
    });
  },
};
