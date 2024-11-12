import assert from 'node:assert'
import { env } from 'node:process'
import {
  type APIApplication,
  type RESTPutAPIApplicationCommandsJSONBody,
  type RESTPutAPIApplicationCommandsResult,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ApplicationIntegrationType,
  InteractionContextType,
  Locale,
  Routes,
} from 'discord-api-types/v10'
import { type BotEnv, requestWithAuth } from '@oddyamill/discord-workers'

assert(env.DISCORD_TOKEN, 'DISCORD_TOKEN is required')

const application = await requestWithAuth<APIApplication>(
  env as unknown as BotEnv,
  Routes.currentApplication(),
)
console.log(`DISCORD_PUBLIC_KEY=${application.verify_key}`)

const contexts: InteractionContextType[] = [
  InteractionContextType.Guild,
  InteractionContextType.BotDM,
  InteractionContextType.PrivateChannel,
]

const integration_types: ApplicationIntegrationType[] = [
  ApplicationIntegrationType.GuildInstall,
  ApplicationIntegrationType.UserInstall,
]

const commands: RESTPutAPIApplicationCommandsJSONBody = [
  {
    name: 'tiktok',
    type: ApplicationCommandType.ChatInput,
    description: 'Send TikTok video to channel',
    description_localizations: {
      [Locale.Russian]: 'Отправить видео TikTok в канал',
      [Locale.Ukrainian]: 'Надіслати відео TikTok у канал',
    },
    options: [
      {
        name: 'url',
        type: ApplicationCommandOptionType.String,
        required: true,
        description: 'Link to video (or identifier)',
        description_localizations: {
          [Locale.Russian]: 'Ссылка на видео (или идентификатор)',
          [Locale.Ukrainian]: 'Посилання на відео (або ідентифікатор)',
        },
      },
      {
        name: 'spoiler',
        type: ApplicationCommandOptionType.Boolean,
        required: false,
        description: 'Mark video as spoiler',
        description_localizations: {
          [Locale.Russian]: 'Отметить видео как спойлер',
          [Locale.Ukrainian]: 'Позначити відео як спойлер',
        },
      },
    ],
    contexts,
    integration_types,
  },
  {
    name: 'TikTok',
    type: ApplicationCommandType.Message,
    contexts,
    integration_types,
  },
]

const newCommands = await requestWithAuth<RESTPutAPIApplicationCommandsResult>(
  env as unknown as BotEnv,
  Routes.applicationCommands(application.id),
  {
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    body: JSON.stringify(commands),
  },
)

for (const command of newCommands) {
  delete command.options
  delete command.contexts
  delete command.integration_types
  console.table(command)
}
