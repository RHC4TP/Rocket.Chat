import mem from 'mem';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { getDateWithFormat, getDateCalendar, getDate } from '../../../../lib/rocketchat-dates';
import { getUserPreference, t } from '../../../utils';
import { settings } from '../../../settings';

let lastDay = t('yesterday');
let clockMode;
let sameDay;
const dayFormat = ['h:mm A', 'H:mm'];

Meteor.startup(() => Tracker.autorun(() => {
	clockMode = getUserPreference(Meteor.userId(), 'clockMode', false);
	sameDay = dayFormat[clockMode - 1] || settings.get('Message_TimeFormat');
	lastDay = t('yesterday');
}));

export const formatTime = (time) => {
	switch (clockMode) {
		case 1:
		case 2:
			return getDateWithFormat(getDate(time), sameDay);
		default:
			return getDateWithFormat(getDate(time), settings.get('Message_TimeFormat'));
	}
};

export const formatDateAndTime = (time) => {
	switch (clockMode) {
		case 1:
			return getDateWithFormat(getDate(time), 'MMMM D, Y h:mm A');
		case 2:
			return getDateWithFormat(getDate(time), 'MMMM D, Y H:mm');
		default:
			return getDateWithFormat(getDate(time), settings.get('Message_TimeAndDateFormat'));
	}
};

const sameElse = function(now) {
	const diff = Math.ceil(this.diff(now, 'years', true));
	return diff < 0 ? 'MMM D YYYY' : 'MMM D';
};

export const timeAgo = (date) => getDateCalendar(getDate(date), null, {
	lastDay: `[${ lastDay }]`,
	sameDay,
	lastWeek: 'dddd',
	sameElse,
});

export const formatDate = mem((time) => getDateWithFormat(getDate(time), settings.get('Message_DateFormat')), { maxAge: 5000 });
