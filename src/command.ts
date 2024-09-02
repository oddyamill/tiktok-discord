// TODO: refactoring

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
} from './utils'

export const command = async (interaction: Interaction, t: Translator, env: Env, ctx: ExecutionContext): Promise<Response> => {
  const { text, message } = resolveArguments(interaction)
  const id = await resolveId(text)

  if (!id) {
    return respond(InteractionResponseType.ChannelMessageWithSource, {
      content: t('no_tiktok'),
      flags: MessageFlags.Ephemeral,
    })
  }

  ctx.waitUntil(
    (async () => {
      const data = await getTikTok(id, env)

      if (!data) {
        return editResponse(interaction, {
          content: t('video_not_loading'),
        })
      }

      const { format, author, stream, url } = data

      if (!stream) {
        return editResponse(interaction, {
          content: t('video_not_supported'),
        })
      }

      if (!stream.ok) {
        return editResponse(interaction, {
          content: t('tiktok_blocked'),
        })
      }

      const body = new FormData(),
        payload: RESTPatchAPIInteractionOriginalResponseJSONBody = {
          components: [
            {
              type: ComponentType.ActionRow,
              components: [
                makeComponent(t('open_in_tiktok'), url),
                await makeAuthorComponent(author.nickname, author.id, author.uniqueId, author.avatarThumb, interaction, env, ctx),
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
