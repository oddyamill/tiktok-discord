import { GuildFeature } from 'discord-api-types/v10'
import { Interaction } from '../interaction'

export function resolveMaxFileSize(interaction: Interaction): number {
  const features = interaction.guild?.features ?? []

  switch (true) {
    case features.includes(GuildFeature.AnimatedBanner):
      return 100 * 1024 * 1024

    case features.includes(GuildFeature.RoleIcons):
      return 50 * 1024 * 1024

    default:
      return 25 * 1024 * 1024
  }
}
