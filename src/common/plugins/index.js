import comps from 'comps'
import directives from '../directives'
export default function (app) {
  const plugins = import.meta.globEager('./*/*.js')
  Object.values(plugins).forEach(val => val.default(app))
  app.use(comps).use(directives)
}
