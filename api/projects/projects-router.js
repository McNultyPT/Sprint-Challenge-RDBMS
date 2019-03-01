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

router.get('/:id', (req, res) => {
    const id = req.params.id;

    db('projects')
        .where({ id })
        .then(project => {
            if (project.length > 0) {
                res.status(200).json(project);
            } else {
                res.status(404).json({ errorMessage: 'There is no project with that ID.' });
            }
        })
        .catch(() => {
            res.status(500).json({ error: 'The project could not be retrieved.' });
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

router.delete('/:id', (req, res) => {
    const id = req.params.id;

    db('projects')
        .where({ id })
        .del()
        .then(count => {
            if (count > 0) {
                res.status(204).end();
            } else {
                res.status(404).json({ errorMessage: 'There is not a project with that ID.' });
            }
        })
        .catch(() => {
            res.status(500).json({ error: 'There was an error deleting the project.' });
        });
});

router.put('/:id', (req, res) => {
    const projectInfo = req.body;
    const id = req.params.id;

    db('projects')
        .where({ id })
        .update(projectInfo)
        .then(count => {
            if (count > 0) {
                db('projects')
                    .where({ id })
                    .then(project => {
                        res.status(200).json(project);
                    });
            } else {
                res.status(404).json({ errorMessage: 'There is not project with that ID.' });
            }
        })
        .catch(() => {
            res.status(500).json({ error: 'There was an error updating the project.' });
        });
});

module.exports = router;