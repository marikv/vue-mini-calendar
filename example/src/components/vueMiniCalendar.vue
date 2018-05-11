<template>
  <div class="vue-mini-calendar__layout">
    <div   v-show="show === 'input' && calendarIsOpened" @click="closeCalendar()" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; background: none;"></div>
    <input v-show="show !== 'calendar'" @focus="showCalendar()" class="vue-mini-calendar__input" :value="inputValue"/>
    <component :is="dpComponent"
        :day-key="displayKey"
        v-model="dateSelection"
        :component-config="config"
        :calendarIsOpened="calendarIsOpened"
        @drag="dragSelection = $event">
    </component>
  </div>
</template>


<script>
import Vue from 'vue'

const _modes = ['single', 'multiple', 'range']
const _show = ['calendar', 'input', 'inline']
const _displayKeyOptions = [
  { id: 'label', value: 'label', label: 'Label' },
  { id: 'number', value: 'day', label: 'Day' },
  { id: 'weekday', value: 'weekday', label: 'Weekday' },
  { id: 'week', value: 'week', label: 'Week' },
  { id: 'month', value: 'month', label: 'Month' },
  { id: 'year', value: 'year', label: 'Year' },
  { id: 'beforeMonth', value: 'beforeMonth', label: 'Before Month' },
  { id: 'afterMonth', value: 'afterMonth', label: 'After Month' },
  { id: 'inMonth', value: 'inMonth', label: 'In Month' },
  { id: 'isToday', value: 'isToday', label: 'Is Today' },
  { id: 'isFirstDay', value: 'isFirstDay', label: 'Is First Day' },
  { id: 'isLastDay', value: 'isLastDay', label: 'Is Last Day' }
]
const _today = new Date()
const _todayComps = {
  year: _today.getFullYear(),
  month: _today.getMonth() + 1,
  day: _today.getDate()
}
const calendar = Vue.component('calendar', {
  template: `<div class="vue-mini-calendar__wrapper" v-show="calendarIsOpened" :class="{ 'vue-mini-calendar__wrapper_absolute': show === 'input' }">
  <div class="vue-mini-calendar">
    <div class="vue-mini-calendar__header">
      <a class="vue-mini-calendar__arrow" @click="movePreviousYear">&laquo;</a>
      <a class="vue-mini-calendar__arrow" @click="movePreviousMonth">&lsaquo;</a>
      <span class="vue-mini-calendar__title" @click="moveThisMonth">{{ header.label }}</span>
      <a class="vue-mini-calendar__arrow" @click="moveNextMonth">&rsaquo;</a>
      <a class="vue-mini-calendar__arrow" @click="moveNextYear">&raquo;</a>
    </div>
    <div class="vue-mini-calendar__weekdays">
      <div class="vue-mini-calendar__weekday" v-for="weekday in weekdays">{{ weekday.label_3 }}</div>
    </div>
    <div class="vue-mini-calendar__week" v-for="week in weeks">
      <div
        class="vue-mini-calendar__day"
        :class="{ 'vue-mini-calendar__today': day.isToday, 'vue-mini-calendar__not-in-month': !day.inMonth, 'vue-mini-calendar__selected': day.isSelected && !day.dragActive, 'vue-mini-calendar__dragged': day.isDragged }"
        v-for="day in week"
        @click="clickDay(day)"
        :day="day.day"
        :month="day.month"
        :year="day.year"
        @mouseenter="$emit('enterDay', day)"
        @mouseleave="$emit('leaveDay', day)">
        {{ day[dayKey] }}
      </div>
    </div>
  </div>
</div>`,

  data () {
    return {
      month: _todayComps.month,
      year: _todayComps.year,
      today: new Date(),
      daysInMonths: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    }
  },
  props: {
    calendarIsOpened: { type: Boolean },
    componentConfig: { type: Object },
    dayKey: { type: String, default: 'label' }
  },
  computed: {
    show () {
      return this.componentConfig && typeof this.componentConfig.show !== 'undefined' ? this.componentConfig.show : _show[0]
    },
    mode () {
      return this.componentConfig && typeof this.componentConfig.mode !== 'undefined' ? this.componentConfig.mode : _modes[0]
    },
    monthIndex () {
      return this.month - 1
    },
    todayComps () {
      return {
        year: this.today.getFullYear(),
        month: this.today.getMonth() + 1,
        day: this.today.getDate()
      }
    },
    isLeapYear () {
      return (this.year % 4 === 0 && this.year % 100 !== 0) || this.year % 400 === 0
    },
    previousMonthComps () {
      if (this.month === 1) {
        return {
          days: this.daysInMonths[11],
          month: 12,
          year: this.year - 1
        }
      }
      return {
        days: (this.month === 3 && this.isLeapYear) ? 29 : this.daysInMonths[this.month - 2],
        month: this.month - 1,
        year: this.year
      }
    },
    nextMonthComps () {
      if (this.month === 12) {
        return {
          days: this.daysInMonths[0],
          month: 1,
          year: this.year + 1
        }
      }
      return {
        days: (this.month === 2 && this.isLeapYear) ? 29 : this.daysInMonths[this.month],
        month: this.month + 1,
        year: this.year
      }
    },
    months () {
      const months = this.componentConfig && typeof this.componentConfig.months !== 'undefined' && this.componentConfig.months.length === 12
        ? this.componentConfig.months
        : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      return months.map((ml, i) => ({
        label: ml,
        label_1: ml.substring(0, 1),
        label_2: ml.substring(0, 2),
        label_3: ml.substring(0, 3),
        number: i + 1
      }))
    },
    weekdays () {
      const weekDays = [
        ...this.componentConfig && typeof this.componentConfig.weekDays !== 'undefined' && this.componentConfig.weekDays.length === 7
          ? this.componentConfig.weekDays
          : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      ]
      for (let i = 1; i <= 8 - this.firstDayOfWeek; i++) {
        weekDays.push(weekDays.shift())
      }
      return weekDays.map((wl, i) => ({
        label: wl,
        label_1: wl.substring(0, 1),
        label_2: wl.substring(0, 2),
        label_3: wl.substring(0, 3),
        number: i + 1
      }))
    },
    header () {
      const month = this.months[this.monthIndex]
      return {
        month: month,
        year: this.year.toString(),
        shortYear: this.year.toString().substring(2, 4),
        label: month.label + ' ' + this.year
      }
    },
    firstDayOfWeek () {
      return this.componentConfig && typeof this.componentConfig.firstDayOfWeek !== 'undefined' ? this.componentConfig.firstDayOfWeek : 1
    },
    firstWeekdayInMonth () {
      let r = new Date(this.year, this.monthIndex, 1).getDay() + this.firstDayOfWeek
      if (r > 7) {
        r = r - 7
      }
      return r
    },
    daysInMonth () {
      if (this.month === 2 && this.isLeapYear) return 29
      return this.daysInMonths[this.monthIndex]
    },
    weeks () {
      const weeks = []
      let previousMonth = true
      let thisMonth = false
      let nextMonth = false
      let day = this.previousMonthComps.days - this.firstWeekdayInMonth + 2
      let month = this.previousMonthComps.month
      let year = this.previousMonthComps.year
      for (let w = 1; w <= 6 && !nextMonth; w++) {
        const week = []
        for (let d = 1; d <= 7; d++) {
          if (previousMonth && d >= this.firstWeekdayInMonth) {
            day = 1
            month = this.month
            year = this.year
            previousMonth = false
            thisMonth = true
          }
          const dayInfo = {
            label: (day && thisMonth) ? day.toString() : '',
            day,
            weekday: d,
            week: w,
            month,
            year,
            date: new Date(year, month - 1, day),
            beforeMonth: previousMonth,
            afterMonth: nextMonth,
            inMonth: thisMonth,
            isToday: day === this.todayComps.day && month === this.todayComps.month && year === this.todayComps.year,
            isFirstDay: thisMonth && day === 1,
            isLastDay: thisMonth && day === this.daysInMonth
          }
          this.$emit('configureDay', dayInfo)
          week.push(dayInfo)
          if (thisMonth && day >= this.daysInMonth) {
            thisMonth = false
            nextMonth = true
            day = 1
            month = this.nextMonthComps.month
            year = this.nextMonthComps.year
          } else {
            day++
          }
        }
        weeks.push(week)
      }
      return weeks
    }
  },
  methods: {
    clickDay (day) {
      this.$emit('selectDay', day)
    },
    moveThisMonth () {
      this.month = this.todayComps.month
      this.year = this.todayComps.year
    },
    moveNextMonth () {
      const { month, year } = this.nextMonthComps
      this.month = month
      this.year = year
    },
    movePreviousMonth () {
      const { month, year } = this.previousMonthComps
      this.month = month
      this.year = year
    },
    moveNextYear () {
      this.year++
    },
    movePreviousYear () {
      this.year--
    }
  }
})
Vue.component('single-date-picker', {
  created () {
    this.$on('configureDay', this.configureDay)
    this.$on('selectDay', this.selectDay)
  },
  extends: calendar,
  props: {
    value: Date
  },
  computed: {
    hasValue () {
      return this.value && typeof this.value.getTime === 'function'
    },
    valueTime () {
      return this.hasValue ? this.value.getTime() : null
    }
  },
  methods: {
    configureDay (day) {
      day.isSelected = day.date.getTime() === this.valueTime
    },
    selectDay (day) {
      this.$emit('input', day.isSelected ? null : day.date)
    }
  }
})
Vue.component('multiple-date-picker', {
  created () {
    this.$on('configureDay', this.configureDay)
    this.$on('selectDay', this.selectDay)
  },
  extends: calendar,
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }}
  },
  computed: {
    hasValues () {
      return Array.isArray(this.value) && this.value.length > 0
    },
    valueTimes () {
      if (!this.hasValues) return []
      return this.value.map(v => v.getTime())
    }
  },
  methods: {
    configureDay (day) {
      day.isSelected = this.dayIsSelected(day)
    },
    dayIsSelected (day) {
      if (!this.hasValues) return false
      const t = day.date.getTime()
      return !!this.valueTimes.find(vt => vt === t)
    },
    selectDay (day) {
      if (!day.isSelected) {
        this.$emit('input', this.hasValues ? [...this.value, day.date] : [day.date])
      } else {
        this.$emit('input', this.value.filter(v => v.getTime() !== day.date.getTime()))
      }
    }
  }
})
Vue.component('date-range-picker', {
  created () {
    this.$on('configureDay', this.configureDay)
    this.$on('selectDay', this.selectDay)
    this.$on('enterDay', this.enterDay)
  },
  extends: calendar,
  data () {
    return {
      dragRange: null
    }
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    valueIsValid () {
      return this.value && this.value.start && this.value.end
    },
    normalizedValue () {
      return this.normalizeRange(this.value)
    },
    normalizedDragRange () {
      return this.normalizeRange(this.dragRange)
    }
  },
  watch: {
    normalizedDragRange (val) {
      this.$emit('drag', val ? { start: val.start, end: val.end } : null)
    }
  },
  methods: {
    configureDay (day) {
      const dateTime = day.date.getTime()
      const valueRange = this.normalizedValue
      const dragRange = this.normalizedDragRange
      day.isSelected = valueRange && dateTime >= valueRange.startTime && dateTime <= valueRange.endTime
      day.startsSelection = valueRange && dateTime === valueRange.startTime
      day.endsSelection = valueRange && dateTime === valueRange.endTime
      day.dragActive = dragRange // Just to let day know drag is happening somewhere
      day.isDragged = dragRange && dateTime >= dragRange.startTime && dateTime <= dragRange.endTime
      day.startsDrag = dragRange && dateTime === dragRange.startTime
      day.endsDrag = dragRange && dateTime === dragRange.endTime
    },
    selectDay (day) {
      // Start new drag selection if not dragging
      if (!this.dragRange) {
        this.dragRange = {
          start: day.date,
          end: day.date
        }
        // Complete drag selection
      } else {
        const { start, end } = this.normalizedDragRange
        // Clear drag selection
        this.dragRange = null
        // Signal new value selected on drag complete
        this.$emit('input', { start, end })
      }
    },
    enterDay (day) {
      if (!this.dragRange) return
      // Update drag selection
      this.dragRange = {
        start: this.dragRange.start,
        end: day.date
      }
    },
    normalizeRange (range) {
      if (!range) return null
      const { start, end } = range
      const startTime = start.getTime()
      const endTime = end.getTime()
      const isNormal = start < end
      return {
        start: isNormal ? start : end,
        startTime: isNormal ? startTime : endTime,
        end: isNormal ? end : start,
        endTime: isNormal ? endTime : startTime
      }
    }
  }
})
export default {
  props: ['config'],
  data () {
    return {
      displayKeyOptions: _displayKeyOptions,
      displayKey: _displayKeyOptions[1].value,
      dateSelection: null,
      dragSelection: null,
      calendarIsOpened: false
    }
  },
  computed: {
    mode () {
      return this.config && this.config.mode ? this.config.mode : _modes[0]
    },
    format () {
      return this.config && this.config.format ? this.config.format : 'MM/dd/yyyy'
    },
    rangeSeparator () {
      return this.config && this.config.rangeSeparator ? this.config.rangeSeparator : ' — '
    },
    multipleSeparator () {
      return this.config && this.config.multipleSeparator ? this.config.multipleSeparator : ', '
    },
    firstDayOfWeek () {
      return this.config && this.config.firstDayOfWeek ? this.config.firstDayOfWeek : 1
    },
    show () {
      return this.config && this.config.show ? this.config.show : _show[0]
    },
    dpComponent () {
      switch (this.mode) {
        case _modes[0]:
          return 'single-date-picker'
        case _modes[1]:
          return 'multiple-date-picker'
        case _modes[2]:
          return 'date-range-picker'
        default:
          return ''
      }
    },
    dateSelectionLabel () {
      return JSON.stringify(this.dateSelection, null, '\t')
    },
    inputValue () {
      let dates
      if (typeof this.dateSelection === 'object' && this.dateSelection && this.dateSelection.start && this.dateSelection.end) {
        dates = `${this.dateFormat(this.dateSelection.start, this.format)}${this.rangeSeparator}${this.dateFormat(this.dateSelection.end, this.format)}`
      } else if (Array.isArray(this.dateSelection)) {
        dates = this.dateSelection.map(d => this.dateFormat(d, this.format)).join(this.multipleSeparator)
      } else {
        dates = this.dateFormat(this.dateSelection, this.format)
      }
      return dates
    }
  },
  methods: {
    closeCalendar() {
      this.calendarIsOpened = false
    },
    showCalendar () {
      this.calendarIsOpened = true
    },
    stringToDate (_date, _format) {
      const _delimiter = this.format.split('M').join('').split('y').join('').split('d').join('').substring(0, 1)
      const formatLowerCase = _format.toLowerCase()
      const formatItems = formatLowerCase.split(_delimiter)
      const dateItems = _date.split(_delimiter)
      const monthIndex = formatItems.indexOf('mm')
      const dayIndex = formatItems.indexOf('dd')
      const yearIndex = formatItems.indexOf('yyyy')
      let month = parseInt(dateItems[monthIndex])
      month -= 1
      return new Date(dateItems[yearIndex], month, dateItems[dayIndex])
    },
    dateFormat (dateObj, format) {
      const date = dateObj
      if (typeof date !== 'object' || date === null || typeof date.getMonth === 'undefined') {
        return ''
      }
      const month = date.getMonth() + 1
      const year = date.getFullYear()
      if (!format) {
        format = 'MM/dd/yyyy'
      }
      format = format.replace('MM', month.toString().padStart(2, '0'))
      if (format.indexOf('yyyy') > -1) {
        format = format.replace('yyyy', year.toString())
      } else if (format.indexOf('yy') > -1) {
        format = format.replace('yy', year.toString().substr(2, 2))
      }
      format = format.replace('dd', date.getDate().toString().padStart(2, '0'))
      let hours = date.getHours()
      if (format.indexOf('t') > -1) {
        if (hours > 11) {
          format = format.replace('t', 'pm')
        } else {
          format = format.replace('t', 'am')
        }
      }
      if (format.indexOf('HH') > -1) {
        format = format.replace('HH', hours.toString().padStart(2, '0'))
      }
      if (format.indexOf('hh') > -1) {
        if (hours > 12) {
          hours -= 12
        }
        if (hours === 0) {
          hours = 12
        }
        format = format.replace('hh', hours.toString().padStart(2, '0'))
      }
      if (format.indexOf('mm') > -1) {
        format = format.replace('mm', date.getMinutes().toString().padStart(2, '0'))
      }
      if (format.indexOf('ss') > -1) {
        format = format.replace('ss', date.getSeconds().toString().padStart(2, '0'))
      }
      return format
    }
  },
  watch: {
    mode () {
      this.dateSelection = null
      this.calendarIsOpened = this.show !== _show[1] // 'input'
    },
    show () {
      this.dateSelection = null
      this.calendarIsOpened = this.show !== _show[1] // 'input'
    },
    inputValue (v) {
      this.calendarIsOpened = this.show !== _show[1]
      this.$emit('input', v)
    }
  },
  mounted () {
    this.calendarIsOpened = this.show !== _show[1] // 'input'

    const model = this.$vnode.data.model && this.$vnode.data.model.value ? this.$vnode.data.model.value : ''

    this.dateSelection = false;
    if (this.mode === _modes[0]) {
      let d;
      if (model && typeof model.getMonth === 'function') {
        d = model;
      } else if (model && typeof model === 'string' && model.length) {
        d = new Date(this.stringToDate(model, this.format));
      }
      this.dateSelection = d;
    } else if (this.mode === _modes[1]) {
      if (model && typeof model === 'string' && model.length) {
        const models = model.split(this.multipleSeparator)
        this.dateSelection = []
        for (let i = 0; i < models.length; i += 1) {
          const stringToDate2 = this.stringToDate(models[i], this.format)
          this.dateSelection.push(new Date(stringToDate2))
        }
      }
    } else if (this.mode === _modes[2]) {
      if (model && typeof model === 'string' && model.length && model.indexOf(this.rangeSeparator) > -1) {
        const models = model.split(this.rangeSeparator)
        const stringToDate2 = this.stringToDate(models[0], this.format)
        const stringToDate3 = this.stringToDate(models[1], this.format)
        this.dateSelection = {}
        this.dateSelection.start = new Date(stringToDate2)
        this.dateSelection.end = new Date(stringToDate3)
      }
    }
  }
}

</script>

<style>

  .vue-mini-calendar__layout * {
    box-sizing: border-box;
  }
  .vue-mini-calendar {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 305px;
    background: white;
    padding: 5px;
  }
  .vue-mini-calendar__wrapper_absolute {
    position: absolute;
    -webkit-box-shadow: 0px 10px 17px -6px rgba(0,0,0,0.18);
    -moz-box-shadow: 0px 10px 17px -6px rgba(0,0,0,0.18);
    box-shadow: 0px 10px 17px -6px rgba(0,0,0,0.18);
    border-radius: 2px;
  }

  .vue-mini-calendar__layout {
    width: 305px;
  }
  .vue-mini-calendar__input {
    height: 30px;
    border-radius: 2px;
    border: 1px solid rgba(200,200,200,0.77);
    width: 100%;
    padding: 0 10px
  }
  .vue-mini-calendar__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    padding: 0.1rem 0;
    border-width: 1px;
    border-style: solid;
    border-color: #f6f6f6;
    background: #11998e;
    background: -webkit-linear-gradient(to right, #38ef7d, #11998e);
    background: linear-gradient(to right, #38ef7d, #11998e);
    border-radius: 4px;
  }
  .vue-mini-calendar__header .vue-mini-calendar__arrow {
    cursor: pointer;
    padding: 0 0.4em 0.2em 0.4em;
    font-size: 1.8rem;
    font-weight: 500;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    flex-grow: 0;
  }
  .vue-mini-calendar__header .vue-mini-calendar__arrow:hover {
    color: rgba(220, 220, 220, 0.71);
  }
  .vue-mini-calendar__header .vue-mini-calendar__title {
    cursor: pointer;
    flex-grow: 1;
    font-size: 1.2rem;
    text-align: center;
  }
  .vue-mini-calendar__header .vue-mini-calendar__title:hover {
    color: #dcdcdc;
  }
  .vue-mini-calendar__weekdays {
    display: flex;
  }
  .vue-mini-calendar__weekday {
    width: 14.2857%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.1rem;
    color: #999999;
    border-width: 1px;
    border-style: solid;
    border-color: #fcfcfc;
    background-color: #fcfcfc;
    cursor: default;
  }
  .vue-mini-calendar__week {
    display: flex;
  }
  .vue-mini-calendar__day {
    width: 14.2857%;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #3a3a3a;
    background-color: white;
    border: solid 1px white;
    cursor: pointer;
    border-radius: 4px;
  }
  .vue-mini-calendar__today {
    font-weight: bold;
    text-decoration: underline;
  }
  .vue-mini-calendar__not-in-month {
    color: #cacaca;
    background-color: #fafafa;
  }
  .vue-mini-calendar__selected {
    color: #fafafa;
    background-color: #e91e63;
  }
  .vue-mini-calendar__dragged {
    color: #fafafa;
    background-color: #e91e63;
  }
</style>
