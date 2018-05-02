<template>
  <div id="app">

      <h1>DEMO</h1>
    <div class="center">
        <div style="vertical-align: top;">
          <vueMiniCalendar v-model="dateModel" :config="config"/>
        </div>
        <div class="sidebar">
            <h4>Mode</h4>
            <div class="option" v-for="option in selectModeOptions">
                <input type="radio" :id="option.id" :value="option.value" v-model="config.mode" />
                <label :for="option.id">{{ option.label }}</label>
            </div>
            <h4>Show</h4>
            <div class="option" v-for="option in showOptions">
                <input type="radio" :id="option.id" :value="option.id" v-model="config.show" />
                <label :for="option.id">{{ option.label }}</label>
            </div>
            <h4>Value</h4>
            <div v-if="dateModel">
                {{ dateModel }}
            </div>
            <div v-else>
                None
            </div>
        </div>
    </div>

      <hr>

      <h1>Usage</h1>
  </div>
</template>

<script>
import vueMiniCalendar from './components/vueMiniCalendar'

export default {
  name: 'App',
  components: {
    vueMiniCalendar
  },
  data () {
    return {
      dateModel: new Date(), // '23.04.2018' or '05/23/2018' or new Date() ....
      mode: 'single',
      selectModeOptions: [
        { id: 'none', value: 'none', label: 'None' },
        { id: 'single', value: 'single', label: 'Single Date' },
        { id: 'multiple', value: 'multiple', label: 'Multiple Dates' },
        { id: 'range', value: 'range', label: 'Date Range' }
      ],
      showOptions: [
        { id: 'input', label: 'input' },
        { id: 'inline', label: 'inline' },
        { id: 'calendar', label: 'calendar' }
      ],
      config: {
        mode: 'single', // multiple, single, range, none
        rangeSeparator: ' — ',
        multipleSeparator: ', ',
        format: 'MM/dd/yyyy', // 'MM/dd/yyyy',
        firstDayOfWeek: 1, // 1 = Sunday ... 7 = Monday
        weekDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        show: 'calendar' // input, inline, calendar
      }
    }
  },
  computed: {
  }
}
</script>

<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
  .center {
    text-align: center;
    display: flex;
    align-items: baseline;
    justify-content: center;
  }
    .sidebar {
        width: 300px;
        min-width: 300px;
        max-width: 300px;
        text-align: left;
        padding-left: 30px;
        vertical-align: top;
    }
</style>
