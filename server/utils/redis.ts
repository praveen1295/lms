// import {Redis} from 'ioredis';
// require('dotenv').config();

// const redisClient = () => {
//     if(process.env.REDIS_URL){
//         console.log(`Redis connected`);
//         return process.env.REDIS_URL;
//     }
//     throw new Error('Redis connection failed');
// };

// export const redis = new Redis(redisClient());


import Redis from 'ioredis';
require('dotenv').config();

const redisClient = () => {
    if (process.env.REDIS_URL) {
        console.log(`Redis connected`);
        return process.env.REDIS_URL;
    }
    throw new Error('Redis connection failed');
};

// Initialize Redis with the URL or options
export const redis = new Redis(redisClient(), {
    // Optional configurations for handling retries, timeouts, etc.
    maxRetriesPerRequest: 50, // Increase as needed
    reconnectOnError: (err) => {
        console.log('Redis reconnecting due to error:', err.message);
        return true; // Attempt to reconnect on any error
    }
});
