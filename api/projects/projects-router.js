const router = require('express').Router();
const knex = require('knex');

const knexConfig = require('../../knexfile.js');

const db = knex(knexConfig.development);

router.get('/', (req, res) => {
    db('projects')
        .then(projects => {
            res.status(200).json(projects);
        })
        .catch(() => {
            res.status(500).json({ error: 'The projects could not be retrieved.' });
        });
});

router.get('/:id/actions', (req, res) => {
    const id = req.params.id;

    db('projects')
        .where({ id })
        .first()
        .then(project => {
            db('actions')
                .where({ project_id: id })
                .then(actions => {
                    project.actions = actions;
                    res.status(200).json(project)
                });
        })
        .catch(() => {
            res.status(500).json({ error: 'The project and its actions could not be retrieved.' });
        });
});

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