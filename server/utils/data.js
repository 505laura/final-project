const names = [
    'Aaron',
    'Abbas',
    'Smith',
    'Jones',
    'Ze',
    'Zechariah',
    'Zen',
    'Zenith',
    'Zeph',
    'Zhi',
    'Zi',
    'Zion',
    'Courtney',
    'Gillian',
    'Clark',
    'Jared',
    'Grace',
    'Kelsey',
    'Alex',
    'Mark',
    'Sarah',
    'Nathaniel',
    'Parker',
];

// Get a random item given an array
const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Gets a random full name
const getRandomName = () => `${getRandomArrItem(names)} ${getRandomArrItem(names)}  ${getRandomArrItem(names)}  ${getRandomArrItem(names)}`;

const getRandomUser = () => {
    const name = getRandomName();
    return {
        username: name,
        email: `${name.replace(/ /g, '_').toLowerCase()}@gmail.com`,
        password: 'iAmAStrong!!Password9875',
    };
};

// Export the functions for use in seed.js
module.exports = {getRandomUser, getRandomArrItem};
