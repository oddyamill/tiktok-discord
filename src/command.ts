import {
  ComponentType,
  InteractionResponseType,
  MessageFlags,
  RESTPatchAPIInteractionOriginalResponseJSONBody,
} from 'discord-api-types/v10'
import { respond, editResponse } from '@oddyamill/discord-workers'
import { Translator } from './localization'
import { Env } from './env'
import { Interaction } from './interaction'
import {
  getTikTok,
  makeAuthorComponent,
  makeComponent,
  makeMessageURL,
  resolveArguments,
  resolveId,
  resolveMedia,
} from './utils'

export const command = async (interaction: Interaction, t: Translator, env: Env, ctx: ExecutionContext): Promise<Response> => {
  const { text, message } = resolveArguments(interaction)
  const id = await resolveId(text)

  if (id === undefined) {
    return respond(InteractionResponseType.ChannelMessageWithSource, {
      content: t('no_tiktok'),
      flags: MessageFlags.Ephemeral,
    })
  }

  ctx.waitUntil(
    (async () => {
      const [data, response, error] = await getTikTok(id)

      if (error !== null) {
        return editResponse(interaction, { content: t(error) })
      }

      const media = await resolveMedia(data, response, env)

      if (media === null) {
        return editResponse(interaction, { content: t('video_not_supported') })
      }

      const { format, stream } = media

      if (!stream.ok) {
        return editResponse(interaction, { content: t('tiktok_blocked') })
      }

      const body = new FormData(),
        payload: RESTPatchAPIInteractionOriginalResponseJSONBody = {
          components: [
            {
              type: ComponentType.ActionRow,
              components: [
                makeComponent(t('open_in_tiktok'), response.url),
                await makeAuthorComponent(data.author, interaction, env, ctx),
              ],
            },
          ],
        }

      if (message !== undefined) {
        payload
          .components![0]
          .components.push(makeComponent(t('message'), makeMessageURL(message, interaction.guild_id)))
      }

      body.append('file[0]', await stream.blob(), `tiktok.${format}`)
      body.append('payload_json', JSON.stringify(payload))

      await editResponse(interaction, body)
    })()
  )

  return respond(
    InteractionResponseType.DeferredChannelMessageWithSource,
    undefined
  )
}
