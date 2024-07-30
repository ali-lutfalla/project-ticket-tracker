const express = require('express');
const router = express.Router({mergeParams: true});

const User = require('../models/user.js');
const Project = require('../models/project.js');

const priorityOptions = ['Low','Normal','High','Critical'];
const statusOptions =['Open','In-progress','On-hold','Under-review','Resolved','Closed'];

router.get('/', async (req, res, next) => {
    console.log(req.params.projectId)
    try {
        const project = await Project.findOne({_id: req.params.projectId});
        res.render('tickets/index.ejs',{project: project});
    } catch (error) {
        console.log(error);
    }
});

router.get('/new', async (req, res, next) => {
    try {
        const project = await Project.findOne({_id: req.params.projectId});
        res.render('tickets/new.ejs',{project});
    } catch (error) {
        console.log(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const project = await Project.findOne({_id: req.params.projectId});
        project.tickets.push(req.body);
        await project.save();
        res.redirect(`/users/${req.session.user._id}/projects/${req.params.projectId}/tickets`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.get('/:ticketId', async (req, res, next ) => {
    try {
        const project = await Project.findOne({_id: req.params.projectId});
        const currentTicket = project.tickets.id(req.params.ticketId);
        res.render('tickets/show.ejs',{project,currentTicket});
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.delete('/:ticketId', async (req, res, next) => {
    try {
        const project = await Project.findOne({_id: req.params.projectId});
        if (project.owner.equals(req.session.user._id)) {
            const ticket = project.tickets.id(req.params.ticketId);
            ticket.deleteOne();
            await project.save();
            res.redirect(`/users/${req.session.user._id}/projects/${req.params.projectId}/tickets`);
        } else {
            res.redirect(`/users/${req.session.user._id}/projects/${req.params.projectId}/tickets`);
        }
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.get('/:ticketId/edit', async (req, res, next ) => {
    try {
        const project = await Project.findOne({_id: req.params.projectId});
        if (project.owner.equals(req.session.user._id)){
            const ticket = project.tickets.id(req.params.ticketId);
            res.render('tickets/edit.ejs',{ticket, statusOptions,priorityOptions,project});
        } else {
            res.redirect(`/users/${user._id}/projects/${project._id}/tickets/`);
        }
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.put('/:ticketId', async (req, res, next ) => {
    try {
        const project = await Project.findOne({_id: req.params.projectId});
        if (project.owner.equals(req.session.user._id)) {
            const ticket = project.tickets.id(req.params.ticketId);
            ticket.set(req.body);
            await project.save();
            res.redirect(`/users/${user._id}/projects/${project._id}/tickets/${ticket._id}`);
        } else {
            res.redirect(`/users/${user._id}/projects/${project._id}/tickets/`);
        }
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

module.exports = router;