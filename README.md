# MOCO Inverse Calendar

This tool generates an inverse calendar from your [MOCO subscription](https://www.mocoapp.com/blog/219-lassen-sie-sich-die-planung-in-ihrem-persoenlichen-google-kalender-oder-ical-anzeigen) to which you can subscribe using iCal,
Google Calendar or any other tool supporting the ics format.

This calendar will contain all days where you're not out of office.

## URL Structure

A subscription URL generally looks like this:

```
https://moco-inverse.netlify.com/ics?url=<your moco ics url>&name=<event title>&start=9&end=17
```

The following parameters are available:

- `url`: The URL of your MOCO iCal subscription
- `name` (optional): The title that the generated events will have; default: MOCO
- `start` & `end` (optional): Start and end times. If not provided, the events will be marked as all-day