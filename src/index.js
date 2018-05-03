//var vueMiniCalendar = require('./vueMiniCalendar')
//module.exports = vueMiniCalendar

import vueMiniCalendar from './vueMiniCalendar';

export default {
    install (Vue) {
        Vue.component('vueMiniCalendar', vueMiniCalendar);
    }
}

export { vueMiniCalendar }