const comps = import.meta.globEager('./**/*.vue');
export default function (app) {
  Object.entries(comps).forEach(([path, val]) => {
    const name = path.split('/').pop().split('.vue')[0];
    app.component(name, val.default);
  });
}