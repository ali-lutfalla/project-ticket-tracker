const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Project = require('../models/project.js');

router.get('/', async (req, res, next) => {
    try {
        const project = await Project.findOne({_id: req.params.projectId});
        res.render('tickets/index.ejs');
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;