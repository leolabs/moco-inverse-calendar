import * as ical from 'ical';
import * as icalToolkit from 'ical-toolkit';
import moment from 'moment';

const error = (msg, code = 400) => ({
    statusCode: code,
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({error: msg})
});

export function handler(event, context, callback) {
    if(!event.queryStringParameters.url) {
        callback(null, error('Missing iCal URL Parameter: url'));
        return;
    }

    const params = event.queryStringParameters;
    const url = event.queryStringParameters.url;

    ical.fromURL(url, {}, (err, data) => {
        if(err) {
            callback(null, error(err));
            return;
        }

        const dates = Object.values(data);
        const blockedDates = dates.map(date => moment(date.start).format('YYYY-MM-DD'));
        const builder = icalToolkit.createIcsFileBuilder();

        builder.calname = 'MOCO Presence';
        builder.throwError = true;

        if(dates.length > 0) {
            for(const d = moment(dates[0].start);
                d.isBefore(moment(dates[dates.length - 1].start), 'day');
                d.add(1, 'days')
            ) {
                if(blockedDates.indexOf(d.format('YYYY-MM-DD')) > -1) {
                    continue;
                }

                if(params.excludeWeekends && d.isoWeekday() > 5) {
                    continue;
                }

                builder.events.push({
                    summary: params.name || 'MOCO',
                    start: d.clone().set({hour: params.start || 0}).toDate(),
                    end: d.clone().set({hour: params.end || 0}).toDate(),
                    allDay: !params.start || !params.end,
                    transp: 'OPAQUE'
                });
            }
        }

        console.log(builder.events);

        const body = builder.toString();

        callback(null, {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/calendar'
            },
            body: body
        })
    });
}