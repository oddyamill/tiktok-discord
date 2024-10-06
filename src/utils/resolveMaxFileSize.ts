import { GuildFeature } from 'discord-api-types/v10'
import { Interaction } from '../interaction'

export const resolveMaxFileSize = (interaction: Interaction) => {
  const features = interaction.guild?.features ?? []

  switch (true) {
    case features?.includes(GuildFeature.AnimatedBanner):
      return 100 * 1024 * 1024

    // wtf??
    case features?.includes('SEVEN_DAY_THREAD_ARCHIVE' as GuildFeature):
      return 50 * 1024 * 1024

    default:
      return 25 * 1024 * 1024
  }
}
