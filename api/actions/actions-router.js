const router = require('express').Router();
const knex = require('knex');

const knexConfig = require('../../knexfile.js');

const db = knex(knexConfig.development);

router.get('/', (req, res) => {
    db('actions')
        .then(actions => {
            res.status(200).json(actions);
        })
        .catch(() => {
            res.status(500).json({ error: 'The actions could not be retrieved.' });
        });
});

router.post('/', (req, res) => {
    const actionInfo = req.body;

    if(!actionInfo.description || ! actionInfo.project_id)
        return res.status(400).json({ errorMessage: 'Please provide a description and project ID for the action.' });

    db('actions')
        .insert(actionInfo)
        .then(ids => {
            const [id] = ids;

        db('actions')
            .where({ id })
            .then(action => {
                res.status(201).json(action);
            });
        })
        .catch(() => {
            res.status(500).json({ error: 'There was an error while adding the action.' });
        });
});

module.exports = router;