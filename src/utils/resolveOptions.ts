import {
  APIApplicationCommandInteractionDataBooleanOption,
  APIApplicationCommandInteractionDataStringOption,
  APIMessage,
  ApplicationCommandType,
} from 'discord-api-types/v10'
import { Interaction } from '../interaction'

interface Options {
  text: string
  spoiler: boolean
  message?: APIMessage
}

export function resolveOptions(interaction: Interaction): Options {
  switch (interaction.data.type) {
    case ApplicationCommandType.ChatInput:
      return {
        text: (
          interaction.data.options!.find(
            (o) => o.name === 'url',
          ) as APIApplicationCommandInteractionDataStringOption
        ).value,
        spoiler: (
          interaction.data.options!.find((o) => o.name === 'spoiler') as
            | APIApplicationCommandInteractionDataBooleanOption
            | undefined
        )?.value ?? false,
      }

    case ApplicationCommandType.Message:
      const message = interaction.data.resolved
        ?.messages[interaction.data.target_id]

      return {
        text: JSON.stringify([message.content, message.embeds]),
        spoiler: false,
        message,
      }
  }
}
