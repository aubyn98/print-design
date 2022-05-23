import ElementPlus from 'element-plus'
import * as icons from '@element-plus/icons-vue'

export default function (app) {
  Object.values(icons).forEach(comp => app.component(comp.name, comp))
  app.use(ElementPlus, {
    size: 'small',
  })
}
