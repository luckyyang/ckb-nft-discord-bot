import {
  UDTRule,
  GuildRule,
  NFTRule,
  SimpleRule,
} from "../shared/firestoreTypes";

export const isNFTRule = (simpleRule: SimpleRule) => {
  return "nftAddress" in simpleRule;
};

export const isUDTRule = (simpleRule: SimpleRule) => {
  return "udtRule" in simpleRule;
};

export const guildRuleToSimpleRule = (guildRule: GuildRule): SimpleRule => {
  if (Object.keys(guildRule.nft).length > 0) {
    // build the single NFT rule
    const nftAddresses = Object.keys(guildRule.nft);
    if (nftAddresses.length !== 1) throw new Error("Malformed GuildRule");
    const nftAddress = nftAddresses[0];
    const rule: NFTRule = {
      nftAddress,
      tokenIds: guildRule.nft[nftAddress].tokenIds,
      quantity: guildRule.nft[nftAddress].quantity,
      roleName: guildRule.roleName,
    };
    return rule;
  } else if (Object.keys(guildRule.udt).length > 0) {
    // build the single udt rule
    const udtAddresses = Object.keys(guildRule.udt);
    if (udtAddresses.length !== 1) throw new Error("Malformed GuildRule");
    const udtAddress = udtAddresses[0];
    const rule: UDTRule = {
      udtAddress: udtAddress,
      quantity: guildRule.udt[udtAddress].quantity,
      roleName: guildRule.roleName,
    };
    return rule;
  } else {
    throw new Error("Malformed GuildRule");
  }
};
