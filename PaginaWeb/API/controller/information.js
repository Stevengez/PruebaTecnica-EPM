const { queryInfoByDateRange } = require('../repository');

const getByDateRange = async (req, res) => {
    const { start, end } = req.query;

    try {
        const result = await queryInfoByDateRange(start, end);
        res.status(200).send(result);
    }catch(e){
        res.status(500).send({ error: e });
    }
}

module.exports = {getByDateRange};