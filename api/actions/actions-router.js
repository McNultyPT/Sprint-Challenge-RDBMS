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

router.get('/:id', (req, res) => {
    const id = req.params.id;

    db('actions')
        .where({ id })
        .then(action => {
            if (action.length > 0) {
                res.status(200).json(action);
            } else {
                res.status(404).json({ errorMessage: 'There is no action with that ID.' });
            }
        })
        .catch(() => {
            res.status(500).json({ error: 'The action could not be retrieved.' });
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

router.delete('/:id', (req, res) => {
    const id = req.params.id;

    db('actions')
        .where({ id })
        .del()
        .then(count => {
            if (count > 0) {
                res.status(204).end();
            } else {
                res.status(404).json({ errorMessage: 'There is not an action with that ID.' });
            }
        })
        .catch(() => {
            res.status(500).json({ error: 'There was an error deleting the action.' });
        });
});

router.put('/:id', (req, res) => {
    const actionInfo = req.body;
    const id = req.params.id;

    db('actions')
        .where({ id })
        .update(actionInfo)
        .then(count => {
            if (count > 0) {
                db('actions')
                    .where({ id })
                    .then(action => {
                        res.status(200).json(action);
                    });
            } else {
                res.status(404).json({ errorMessage: 'There is not an action with that ID.' });
            }
        })
        .catch(() => {
            res.status(500).json({ error: 'There was an error updating the action.' });
        });
});

module.exports = router;