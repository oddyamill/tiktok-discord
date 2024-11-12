import {
  ComponentType,
  InteractionResponseType,
  MessageFlags,
  RESTPatchAPIInteractionOriginalResponseJSONBody,
} from 'discord-api-types/v10'
import {
  editResponse as _editResponse,
  sendResponse,
} from '@oddyamill/discord-workers'
import { getTranslator, TranslatorKey } from '../localization'
import { Interaction } from '../interaction'
import {
  getTikTok,
  makeAuthorComponent,
  makeComponent,
  makeMessageURL,
  resolveId,
  resolveMedia,
  resolveOptions,
} from '../utils'

export async function runCommand(interaction: Interaction): Promise<void> {
  const { text, message, spoiler } = resolveOptions(interaction)
  const t = getTranslator(interaction.locale)
  const id = await resolveId(text)

  if (id === undefined) {
    await sendResponse(
      interaction,
      InteractionResponseType.ChannelMessageWithSource,
      {
        content: t('no_tiktok'),
        flags: MessageFlags.Ephemeral,
      },
    )
    return
  }

  const promise = sendResponse(
    interaction,
    InteractionResponseType.DeferredChannelMessageWithSource,
    undefined,
  )

  const editResponse = async (body: FormData | TranslatorKey): Promise<void> => {
    await promise
    await _editResponse(interaction, body instanceof FormData ? body : { content: t(body) })
  }

  const [data, response, error] = await getTikTok(id)

  if (error !== null) {
    return editResponse(error)
  }

  const media = await resolveMedia(data, response, interaction)

  if (media === null) {
    return editResponse('video_not_supported')
  }

  const { format, stream } = media

  if (!stream.ok) {
    return editResponse('tiktok_blocked')
  }

  const body = new FormData(),
    payload: RESTPatchAPIInteractionOriginalResponseJSONBody = {
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            makeComponent(t('open_in_tiktok'), response.url),
            await makeAuthorComponent(data.author, interaction),
          ],
        },
      ],
    }

  if (message !== undefined) {
    payload
      .components![0]
      .components.push(
        makeComponent(
          t('message'),
          makeMessageURL(message, interaction.guild_id),
        ),
      )
  }

  body.append(
    'file[0]',
    await stream.blob(),
    (spoiler ? 'SPOILER_' : '') + 'tiktok.' + format,
  )
  body.append('payload_json', JSON.stringify(payload))

  await editResponse(body)
}
