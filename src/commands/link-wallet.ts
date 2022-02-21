import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import jwt from "jsonwebtoken";
import { generateSignMessageURL } from "@nervina-labs/flashsigner"
import * as dotenv from "dotenv";

dotenv.config();

const DISCORD_VERIFICATION_SECRET = process.env.DISCORD_VERIFICATION_SECRET || "";
console.log("DISCORD_VERIFICATION_SECRET: ", process.env.DISCORD_VERIFICATION_SECRET)
@Discord()
export abstract class LinkWallet {
  @Slash("link-wallet")
  async addNFTRule(
    interaction: CommandInteraction
  ): Promise<void> {
    const token = jwt.sign(
      { userID: interaction.user.id },
      DISCORD_VERIFICATION_SECRET,
      { expiresIn: "1h" }
    );
    const successURL = "http://localhost:3000/"
    const url = generateSignMessageURL(successURL, { message: token });

    await interaction.reply({
      content: `Greetings from the Rostra Guild Assistant! Please click [here](${url}) to link your terra wallet with your discord account.`,
      ephemeral: true,
    });
  }
};
