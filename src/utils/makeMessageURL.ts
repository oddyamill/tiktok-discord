import { APIMessage } from 'discord-api-types/v10'

export const makeMessageURL = (message: APIMessage, guildId?: string): string => {
	return `https://discord.com/channels/${guildId ?? '@me'}/${message.channel_id}/${message.id}`
}
