import {Client, FetchedThreads, GuildMember, TextChannel} from "discord.js";
import {verification} from "../../config.json";
import {userMention} from "@discordjs/builders";

export default async (client: Client, member: GuildMember): Promise<void> => {
    try {
        const verificationChannel = await client.channels.fetch(verification.channelId) as TextChannel;

        const verificationThreads: FetchedThreads = await verificationChannel.threads.fetchActive();

        const previousVerificationThread = verificationThreads.threads.find((thread) => thread.name === `verify-${member.user.id}`);

        if (previousVerificationThread === undefined) {
            const thread = await verificationChannel.threads.create({
                name: `verify-${member.user.id}`,
                autoArchiveDuration: 60,
            });

            // Automatically delete "thread started" messages since we'll be creating a *lot* of those
            // Unfortunately has the side effect of creating ghost unread dots
            const threadMessage = await verificationChannel.messages.fetch(thread.id);
            await threadMessage.delete();

            await thread.send({
                content: `Welcome to the WoF Fanon Wiki verification process, ${userMention(member.user.id)}>! Click the link below to get started and then send your Fandom username in this thread.
https://community.fandom.com/wiki/Special:VerifyUser?c=+&user=${encodeURIComponent(member.user.username)}&tag=${member.user.discriminator}`,
            });
        } else {
            await previousVerificationThread.send({
                content: `Welcome back to the WoF Fanon Wiki verification process, ${userMention(member.user.id)}! Click the link below to get started and then send your Fandom username in this thread.
https://community.fandom.com/wiki/Special:VerifyUser?c=+&user=${encodeURIComponent(member.user.username)}&tag=${member.user.discriminator}`,
            });
        }
    } catch (e) {
        console.error(e);
    }
};
