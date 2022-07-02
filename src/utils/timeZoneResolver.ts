import {Location} from "./location";
const {find}  = require('geo-tz')

export const timeZoneResolver = async (location: Location) => {
    let result = find(location.latitude, location.longitude)
    return getOffset(result) / 60;
}

const getOffset = (timeZone = 'UTC', date = new Date()) => {
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
    return (tzDate.getTime() - utcDate.getTime()) / 6e4;
}