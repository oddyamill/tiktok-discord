import {
  APIChatInputApplicationCommandInteraction,
  APIMessageApplicationCommandInteraction,
  APIPartialGuild,
} from 'discord-api-types/v10'

export type Interaction = { guild: APIPartialGuild | null } & (
  | APIChatInputApplicationCommandInteraction
  | APIMessageApplicationCommandInteraction
)
