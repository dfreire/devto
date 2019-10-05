const ONE_MILE_IN_KILOMETERS = 1.609344;

const milesToKilometers = miles => miles * ONE_MILE_IN_KILOMETERS;

const kilometersToMiles = kilometers => kilometers / ONE_MILE_IN_KILOMETERS;

module.exports = { milesToKilometers, kilometersToMiles };
