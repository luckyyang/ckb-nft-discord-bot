import type { CommandInteraction, GuildMember, Role, User } from "discord.js";
import { Discord, Slash, SlashChoice, SlashGroup, SlashOption } from "discordx";
import db from "../database";

export type GuildRule = {
  version: string;
  nft: {
    [nftAddress: string]: {
      tokenIds?: string[];
      quantity: number;
    };
  };
  udt: {  // user defined token
    [udtAddress: string]: {
      quantity: number;
    };
  };
  nativeToken: {
    [address: string]: {
      quantity: number;
    };
  };
  roleName: string;
};

export interface GuildConfig {
  rules: GuildRule[];
}


@Discord()
@SlashGroup({ name: "guild-setup" })
export abstract class Group {
  @Slash("add-nft-rule")
  @SlashGroup({ name: "guild-setup" })
  async addNFTRule(
    @SlashOption("nft-address", {
      description: "The contract address against which to check for nft ownership for this rule."
    }) nftAddress: string,
    @SlashOption("quantity", {
      description: "The quantity of matching nfts that a user must hold in order to meet the rule."
    }) quantity: number,
    @SlashOption("token-ids", {
      description: "A list of token ids that the rule is restricted to.",
      type: "STRING",
    }) tokenIds: string[],
    @SlashOption("role", {
      description: "The role to give to users which meet this rule.",
      type: "MENTIONABLE"
    }) role: Role,
    interaction: CommandInteraction
  ): Promise<void> {
    // configure the server settings
    // const nftAddress = interaction.options.getString("nft-address");
    // const role = interaction.options.getRole("role");
    const rawQuantity = interaction.options.getNumber("quantity");
    const rawTokenIds = interaction.options.getString("token-ids");

    // verify that nftAddress and role are defined
    if (!nftAddress || !role) {
      await interaction.reply({
        content: "Could not get nftAddress or role",
        ephemeral: true,
      });
      return;
    }

    // verify that we can parse tokenIds
    // let tokenIds;
    try {
      tokenIds = rawTokenIds ? JSON.parse(rawTokenIds) : undefined;
      // check that the tokenIds is properly formatted
      if (
        tokenIds &&
        !(
          Array.isArray(tokenIds) &&
          tokenIds.every((tokenId) => typeof tokenId == "string")
        )
      ) {
        throw new Error("Token ids are not an array of strings");
      }
    } catch {
      await interaction.reply({
        content:
          'Could not parse token ids, please pass token ids in the following format: ["1", "2", "4"]',
        ephemeral: true,
      });
      return;
    }

    // const quantity = rawQuantity ? rawQuantity : 1;

    // check if the bot role is above the verified role
    const botRole = interaction?.guild?.roles.cache.find(
      (role) => role.name == "Rostra guild contributor"
    )!;

    if (role?.position > botRole.position) {
      await interaction.reply({
        content: `Please update the role hierarchy with 'Rostra Guild Assistant' above of ${role.name} and try again.`,
        ephemeral: true,
      });
      return;
    }

    const newRule: GuildRule = {
      version: "1.0",
      nft: {
        [nftAddress]: {
          // only include tokenIds if defined
          ...(tokenIds && { tokenIds }),
          quantity,
        },
      },
      udt: {},  // user defined token
      nativeToken: {},
      roleName: role.name,
    };

    const guildConfigDoc = await db
      .collection("guildConfigs")
      .doc(interaction.guildId)
      .get();

    const guildConfig: GuildConfig = guildConfigDoc.exists
      ? (guildConfigDoc.data() as GuildConfig)
      : { rules: [] };

    guildConfig.rules.push(newRule);

    // update the db
    await db
      .collection("guildConfigs")
      .doc(interaction.guildId)
      .set(guildConfig);

    // reply
    await interaction.reply({
      content: "Rule added successfully!",
      ephemeral: true,
    });
  }
}
