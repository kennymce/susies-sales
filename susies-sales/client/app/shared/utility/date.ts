/*
day:The representation of the day.
Possible values are "numeric", "2-digit".
weekday:The representation of the weekday.
Possible values are "narrow", "short", "long".
year:The representation of the year.
Possible values are "numeric", "2-digit".
month:The representation of the month.
Possible values are "numeric", "2-digit", "narrow", "short", "long".
hour:The representation of the hour.
Possible values are "numeric", "2-digit".
minute: The representation of the minute.
Possible values are "numeric", "2-digit".
second:The representation of the second.
Possible values are "numeric", 2-digit".
*/
export namespace DateUtility {
  var options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  };
  export function formatDate(date) {
    return date.toLocaleString("en-UK", options);
  }
}
