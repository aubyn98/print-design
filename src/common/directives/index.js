export default function (app) {
  const plugins = import.meta.globEager('./*/index.(ts|js)')
  Object.values(plugins).forEach(val => val.default(app))
}
