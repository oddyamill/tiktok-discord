import { env, exit } from 'node:process'
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ApplicationIntegrationType,
  InteractionContextType,
  Locale,
} from 'discord-api-types/v10'

if (env['DISCORD_BOT_TOKEN'] === undefined) {
  console.log('you need to set DISCORD_BOT_TOKEN')
  exit(1)
}

let request = await fetch('https://discord.com/api/v10/applications/@me', {
  headers: {
    Authorization: env['DISCORD_BOT_TOKEN'],
  },
})

const application = await request.json()

console.log(`DISCORD_PUBLIC_KEY=${application.verify_key}`)

if (application.interactions_endpoint_url === null) {
  console.log('you need to set interactions_endpoint_url')
}

const contexts = [
  InteractionContextType.Guild,
  InteractionContextType.BotDM,
  InteractionContextType.PrivateChannel,
]

const integration_types = [
  ApplicationIntegrationType.GuildInstall,
  ApplicationIntegrationType.UserInstall,
]

request = await fetch(
  `https://discord.com/api/v10/applications/${application.id}/commands`,
  {
    headers: {
      Authorization: env['DISCORD_BOT_TOKEN'],
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([
      {
        name: 'tiktok',
        type: ApplicationCommandType.ChatInput,
        description: 'Download TikTok video to channel',
        description_localizations: {
          [Locale.Russian]: 'Загрузка TikTok видео в канал',
          [Locale.Ukrainian]: 'Завантаження TikTok відео в канал',
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
    ]),
    method: 'PUT',
  }
)

console.log(await request.json())
