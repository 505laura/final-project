const dateFormatter = (val) => (val === null ? null : new Date(val).toISOString());

module.exports = {dateFormatter};
