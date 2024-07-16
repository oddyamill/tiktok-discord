import {
  APIPingInteraction,
  InteractionResponseType,
  InteractionType,
} from 'discord-api-types/v10'
import { getInteraction } from '@oddyamill/discord-workers'
import { Interaction } from './interaction'
import { Env } from './env'
import { getTranslator } from './localization'
import { command } from './command'

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const interaction = await getInteraction(request, env) as
      | Interaction
      | APIPingInteraction

    if (interaction === undefined) {
      return new Response('Unauthorized', { status: 401 })
    }

    if (interaction.type === InteractionType.Ping) {
      return Response.json({ type: InteractionResponseType.Pong })
    }

    if (interaction.type !== InteractionType.ApplicationCommand) {
      return new Response('Bad Request', { status: 400 })
    }

    return command(
      interaction,
      getTranslator(interaction.locale),
      env,
      ctx
    )
  },
} satisfies ExportedHandler<Env>
