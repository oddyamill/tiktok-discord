import {
  APIChatInputApplicationCommandInteraction,
  APIMessageApplicationCommandInteraction,
} from 'discord-api-types/v10'

export type Interaction =
  | APIChatInputApplicationCommandInteraction
  | APIMessageApplicationCommandInteraction
