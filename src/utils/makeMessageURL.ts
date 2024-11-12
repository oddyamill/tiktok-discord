import { APIMessage } from 'discord-api-types/v10'

export function makeMessageURL(message: APIMessage, guildId?: string): string {
  return `https://discord.com/channels/${guildId ?? '@me'}/${message.channel_id}/${message.id}`
}
