import { getInteraction, respond } from '@oddyamill/discord-workers'
import { environments } from '../environment'
import { Interaction } from '../interaction'
import {
  APIPingInteraction,
  InteractionResponseType,
  InteractionType,
} from 'discord-api-types/v10'
import { runCommand } from './command'

export async function runFetch(request: Request, ctx: ExecutionContext): Promise<Response> {
  const interaction = (await getInteraction(request, environments())) as
    | Interaction
    | APIPingInteraction
    | undefined

  if (interaction === undefined) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (interaction.type === InteractionType.Ping) {
    return respond(InteractionResponseType.Pong, undefined)
  }

  ctx.waitUntil(runCommand(interaction))
  return new Response(null, { status: 202 })
}
