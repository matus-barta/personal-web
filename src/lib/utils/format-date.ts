type DateStyle = Intl.DateTimeFormatOptions['dateStyle'];

// British English by default: English words, with the day before the month - 5 Apr 2023
export function formatDate(date: string, dateStyle: DateStyle = 'medium', locales = 'en-GB') {
	// Safari is mad about dashes in the date
	const dateToFormat = new Date(date.replaceAll('-', '/'));
	const dateFormatter = new Intl.DateTimeFormat(locales, { dateStyle });
	return dateFormatter.format(dateToFormat);
}
