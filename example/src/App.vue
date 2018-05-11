<template>
  <div id="app">

      <h1>DEMO</h1>
    <div class="center">
        <div style="vertical-align: top;">
          <vueMiniCalendar v-model="dateModel" :config="config"/>
        </div>
        <div class="sidebar">
            <div style="width: 50%">
                <h4>Mode</h4>
                <div :key="option.id" class="option" v-for="option in selectModeOptions">
                    <input type="radio" :id="option.id" :value="option.value" v-model="config.mode" />
                    <label :for="option.id">{{ option.label }}</label>
                </div>
            </div>
            <div style="width: 50%">
                <h4>Show</h4>
                <div :key="option.id" class="option" v-for="option in showOptions">
                    <input type="radio" :id="option.id" :value="option.id" v-model="config.show" />
                    <label :for="option.id">{{ option.label }}</label>
                </div>
            </div>
            <div style="width: 50%">
                <h4>Format</h4>
                <div class="option" v-for="option in selectFormatOptions">
                    <input type="radio" :id="option" :value="option" v-model="config.format" />
                    <label :for="option">{{ option }}</label>
                </div>
            </div>
            <div style="width: 50%">

            </div>
            <div style="width: 100%">
                <h4>Value</h4>
                <div v-if="dateModel">
                    {{ dateModel }}
                </div>
                <div v-else>
                    None
                </div>
            </div>
        </div>
    </div>

      <hr>

      <h1>Usage</h1>
      <pre class="pre">
&lt;template&gt;
    &lt;div&gt;
        &lt;vueMiniCalendar v-model="date" :config="config"/&gt;
    &lt;/div&gt;
&lt;/template&gt;

&lt;script&gt;
    import vueMiniCalendar from 'vue-mini-calendar'

    export default {
      components: {
        vueMiniCalendar
      },
      data () {
        return {
          date: new Date(),
          config: {
            mode: '{{config.mode}}',
            rangeSeparator: ' — ',
            multipleSeparator: ', ',
            format: '{{config.format}}',
            firstDayOfWeek: 1,
            weekDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            show: '{{config.show}}'
          }
        }
      }
    }
&lt;/script&gt;
      </pre>
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
      dateModel: '24.06.2018 — 26.06.2018', // '23.04.2018' or '05/23/2018' or new Date() ....
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
      selectFormatOptions: ['MM/dd/yyyy', 'dd.MM.yyyy', 'yyyy-MM-dd' ],
      config: {
        mode: 'range', // multiple, single, range, none
        rangeSeparator: ' — ',
        multipleSeparator: ', ',
        format: 'dd.MM.yyyy', // 'MM/dd/yyyy',
        firstDayOfWeek: 1, // 1 = Sunday ... 7 = Monday
        weekDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        show: 'calendar' // input, inline, calendar
      }
    }
  },
  computed: {
    configMode() {
      return this.config.mode;
    },
    configShow() {
      return this.config.show;
    },
    configFormat() {
      return this.config.format;
    }
  },
  methods: {
    showPre() {
      document.getElementsByClassName('pre')[0].classList.remove('pre-view');
      setTimeout(() => {
        document.getElementsByClassName('pre')[0].classList.add('pre-view');
      }, 500);
    }
  },
  watch: {
    configMode() {
      this.showPre();
    },
    configShow() {
      this.showPre();
    },
    configFormat() {
      this.showPre();
    }
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
.pre {
    text-align: left;
    max-width: 600px;
    margin:auto;
    background: rgba(200,200,200,0.16);
    overflow: auto;
    padding: 10px 20px;
    border: 1px solid rgba(220,220,220,0.46);
    border-radius: 4px;
}
@keyframes pre-view {
    from {
        background-color: rgba(200,200,200,0.16);
        border: 1px solid rgba(220,220,220,0.46);
    }
    to {
        background-color: rgba(253, 32, 107, 0.16);
        border: 1px solid rgba(253, 32, 107, 0.49);
    }
}
.pre-view {
    background-color: rgba(200,200,200,0.16);
    border: 1px solid rgba(220,220,220,0.46);
    animation-name: pre-view;
    animation-duration: .5s;
    animation-iteration-count: 2;
    animation-direction: alternate;
    animation-timing-function: ease-in-out;
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
    display: flex;
    flex-wrap: wrap;
}
</style>
