const millisecondsPerDay = 86400000;

function asDate(value) {
    if (value == null || value === '') return undefined;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
}

function imagePath(value) {
    if (typeof value !== 'string' || !value.trim()) return '';
    const image = value.trim();
    if (/^(?:assets\/)?images\//.test(image)) return '/' + image.replace(/^assets\//, '');
    return /^[^/:]+$/.test(image) ? '/images/' + image : image;
}

function tripBackfill(trip) {
    const fields = {};
    if (trip.destination == null && typeof trip.resort === 'string' && trip.resort.trim()) {
        fields.destination = trip.resort.trim();
    }
    if (trip.price == null && typeof trip.perPerson === 'string' &&
        /^\d+(?:,\d{3})*(?:\.\d{1,2})?$/.test(trip.perPerson.trim())) {
        fields.price = Number(trip.perPerson.replace(/,/g, ''));
    }
    const image = imagePath(trip.image);
    if ((!trip.images || trip.images.length === 0) && image) {
        fields.images = [image];
    }
    const start = asDate(trip.startDate ?? trip.start);
    if (trip.startDate == null && start) fields.startDate = start;
    const nights = typeof trip.length === 'string' && trip.length.match(/^\s*(\d+)\s+nights?\b/i);
    if (trip.endDate == null && start && nights) {
        const end = asDate(start.getTime() + Number(nights[1]) * millisecondsPerDay);
        if (end) fields.endDate = end;
    }
    return fields;
}

function tripView(trip) {
    const result = { ...trip, ...tripBackfill(trip) };
    result.images = (result.images || []).map(imagePath).filter(Boolean);
    const start = asDate(result.startDate);
    const end = asDate(result.endDate);
    result.duration = start && end && end >= start
        ? Math.ceil((end - start) / millisecondsPerDay)
        : undefined;
    return result;
}

module.exports = { tripBackfill, tripView };
