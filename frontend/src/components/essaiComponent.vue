// Définition d'un nouveau composant appelé `button-counter`
Vue.component('button-counter', { data: function () { return { count: 0 } },
template: '
<button v-on:click="count++">Vous m\'avez cliqué {{ count }} fois.</button>
' })
