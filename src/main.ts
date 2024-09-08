import { createApp } from 'vue'
import { VueFire, VueFireAuth } from 'vuefire'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faPlay,
  faCode,
  faTerminal,
  faList,
  faFloppyDisk,
  faBook,
  faFlaskVial,
  faGear,
  faPlus,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons'
import { faLightbulb, faClock } from '@fortawesome/free-regular-svg-icons'

import firebasePlugin, { firebaseApp } from './plugins/firebase'
import './style.css'
import App from './App.vue'
import router from './router'

import IconButton from './components/ui/IconButton.vue'
library.add({ faPlay, faLightbulb, faClock, faCode, faTerminal, faList, faFloppyDisk, faBook, faFlaskVial, faGear, faPlus, faPenToSquare })

createApp(App)
  .use(VueFire, {
    firebaseApp,
    modules: [VueFireAuth()],
  })
  .use(firebasePlugin)
  .component('fa-icon', FontAwesomeIcon)
  .component('icon-button', IconButton)
  .use(router)
  .mount('#app')
