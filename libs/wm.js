import * as platform from './platform'
import { versionName as version } from '../manifest'
let env = 'pro'
switch (process.env.NODE_ENV) {
  case 'development':
    env = 'dev'
    break
  case 'production':
    env = 'pro'
    break
}

export default {
  ...platform,
  version,
  env,
  defaultImg: '/static/default.jpg',
}
