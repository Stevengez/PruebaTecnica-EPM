const { getByDateRange } = require('../controller/information');
const router = require('express').Router();

module.exports = () => {
    router.get('/', (_, res) => res.send('OK'));
    router.get('/date-range', getByDateRange);
    return router;
}