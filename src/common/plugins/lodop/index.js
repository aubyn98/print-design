import CheckPrintControl from './check-print-control.vue'
export * from './lib/LodopFuncs'
export * as LodopTools from './lib'
export default function (app) {
  app.component(CheckPrintControl.name, CheckPrintControl)
}
