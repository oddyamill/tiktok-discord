import {
  APIApplicationCommandInteractionDataStringOption,
  ApplicationCommandType
} from 'discord-api-types/v10'
import { Interaction } from '../interaction'

export const resolveArguments = (interaction: Interaction) => {
  switch (interaction.data.type) {
    case ApplicationCommandType.ChatInput:
      return {
        text: (interaction.data.options![0] as APIApplicationCommandInteractionDataStringOption).value,
      }

    case ApplicationCommandType.Message:
      const message =
        interaction.data.resolved?.messages[interaction.data.target_id]

      return {
        message,
        text: JSON.stringify(message),
      }
  }
}
