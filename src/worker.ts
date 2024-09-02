import {
  APIPingInteraction,
  InteractionResponseType,
  InteractionType,
} from 'discord-api-types/v10'
import { deleteApplicationEmoji, getApplicationEmojis, getInteraction, respond } from '@oddyamill/discord-workers'
import { Interaction } from './interaction'
import { Env } from './env'
import { getTranslator } from './localization'
import { command } from './command'
import { deleteComponentEmojiFromCache } from './utils'

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const interaction = (await getInteraction(request, env)) as
      | Interaction
      | APIPingInteraction

    if (interaction === undefined) {
      return new Response('Unauthorized', { status: 401 })
    }

    if (interaction.type === InteractionType.Ping) {
      return respond(InteractionResponseType.Pong, undefined)
    }

    return command(interaction, getTranslator(interaction.locale), env, ctx)
  },
  async scheduled(_, env, ctx): Promise<void> {
    const { items: emojis } = await getApplicationEmojis(env, env.DISCORD_APPLICATION_ID)

    if (emojis.length === 0) {
      return
    }

    const promises = []

    for (const emoji of emojis) {
      promises.push(
        deleteApplicationEmoji(env, env.DISCORD_APPLICATION_ID, emoji.id!),
        deleteComponentEmojiFromCache(env, emoji.name!)
      )
    }

    ctx.waitUntil(Promise.allSettled(promises))
  },
} satisfies ExportedHandler<Env>
