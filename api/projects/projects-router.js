const router = require('express').Router();
const knex = require('knex');

const knexConfig = require('../../knexfile.js');

const db = knex(knexConfig.development);

router.post('/', (req, res) => {
    const projectInfo = req.body;

    if(!projectInfo.name || !projectInfo.description)
        return res.status(400).json({ errorMessage: 'Please provide a name and description for the project.' });

    db('projects')
        .insert(projectInfo)
        .then(ids => {
            const [id] = ids;

        db('projects')
            .where({ id })
            .then(project => {
                res.status(201).json(project);
            });
        })
        .catch(() => {
            res.status(500).json({ error: 'There was an error while adding the project.' });
        });
});

module.exports = router;