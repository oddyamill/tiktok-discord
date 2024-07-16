import {
  APIButtonComponentWithURL,
  ButtonStyle,
  ComponentType,
} from 'discord-api-types/v10'

export const makeComponent = (label: string, url: string): APIButtonComponentWithURL => {
  return {
    type: ComponentType.Button,
    style: ButtonStyle.Link,
    label,
    url,
  }
}
