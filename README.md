# vue-mini-calendar
![alt text](https://github.com/marikv/vue-mini-calendar/blob/master/example/static/vue-mini-calendar.png)
## License

[MIT](LICENSE)

## Installation and Usage

Install the component using npm:
```
npm i --save vue-mini-calendar
```

In your application, you'll need to:
* import the component
```
import VueMiniCalendar from 'vue-mini-calendar'
```
and just use it
```
<vue-mini-calendar></vue-mini-calendar>
```

For more configuration:
```
<template>
	<div>
		<vue-mini-calendar v-model="date" :config="config"></vue-mini-calendar>
	</div>
</template>

<script>
	import vueMiniCalendar from 'vue-mini-calendar';

	export default {
		components: {
			vueMiniCalendar,
		},
		data() {
			return {
				date: new Date(),
				config: {
					mode: 'single', // multiple, single, range, none
					rangeSeparator: ' — ',
					multipleSeparator: ', ',
					format: 'MM/dd/yyyy',
					firstDayOfWeek: 1, // 1 = Sunday ... 7 = Monday
					weekDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
					months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
					show: 'calendar', // input, inline, calendar
				}
			};
		}
	};
</script>
```
			