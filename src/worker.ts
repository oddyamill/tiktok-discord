import { Env, setEnvironment } from './environment'
import { runFetch } from './routes/fetch'
import { runSchedule } from './routes/schedule'

export default {
  fetch(request, env, ctx): Promise<Response> {
    setEnvironment(env)
    return runFetch(request, ctx)
  },
  scheduled(_, env, ctx): Promise<void> {
    setEnvironment(env)
    return runSchedule(ctx)
  },
} satisfies ExportedHandler<Env>
