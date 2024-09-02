import {
  APIButtonComponentWithURL,
  APIMessageComponentEmoji,
  ButtonStyle,
  ComponentType,
} from 'discord-api-types/v10'

export const makeComponent = (label: string, url: string, emoji?: APIMessageComponentEmoji): APIButtonComponentWithURL => {
  return {
    type: ComponentType.Button,
    style: ButtonStyle.Link,
    label,
    url,
    emoji,
  }
}
