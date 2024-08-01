const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Project = require('../models/project.js');

router.get('/', async (req, res, next) => {
    try {
        const projects = await Project.find({ members: req.session.user._id }).populate('owner');
        res.render('projects/index.ejs',{projects: projects});
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.get('/new', async (req, res , next ) => {
    try {
        const users = await User.find({});
        res.render('projects/new.ejs',{users: users});
    } catch (error) {
        console.log(error);
    }
}); 

router.post('/', async (req, res, next ) => {
    try {
        const newProject = new Project(req.body);
        newProject.owner = req.session.user._id;
        const teamMembers = req.body.members;
        newProject.members = teamMembers
        if (!newProject.members.includes(req.session.user._id)){
            newProject.members.push(req.session.user._id);
        }
        await newProject.save();
        res.redirect(`/users/${req.session.user._id}/projects/${newProject._id}`);
    } catch (error) {
        console.log(error);
    }
});

router.get('/:projectID', async (req, res, next ) => {
    try {
        const currentProject = await Project.findOne({_id: req.params.projectID}).populate('members');
        res.render('projects/show.ejs',{currentProject: currentProject});
    } catch (error) {
        console.log(error);
    }
});

router.delete('/:projectId',async (req, res, next) => {
    try {
        const projectToDelete = await Project.findOne({_id: req.params.projectId});
        if (projectToDelete.members.includes(req.session.user._id)) {
            projectToDelete.members.pull(req.session.user._id);
            await projectToDelete.save();
        }

        if (projectToDelete.owner.equals(req.session.user._id)) {
         await Project.findByIdAndDelete(projectToDelete._id);
         res.redirect(`/users/${req.session.user._id}/projects`);
        } else {
            res.redirect(`/users/${req.session.user._id}/projects`);
        }

    } catch (error) {
        console.log(error);
    }
});

router.get('/:projectId/edit', async (req, res, next ) => {
    try {
        const projectToEdit = await Project.findOne({_id: req.params.projectId});
        console.log(projectToEdit.members);//delete later
        if (projectToEdit.members.includes(req.session.user._id)) {
            const users = await User.find({});
            res.render('projects/edit.ejs',{projectToEdit: projectToEdit, users: users});
        } else {
            res.redirect(`/users/${req.session.user._id}/projects`);
        }
    } catch (error) {
        console.log(error);
    }
});

router.put('/:projectId', async (req, res, next) => { //optimization for later lookup the values and change them 
    try {
        const projectToEdit = await Project.findOne({_id: req.params.projectId});
        console.log(projectToEdit);
        if (projectToEdit.owner.equals(req.session.user._id)) {
            if (!projectToEdit.members.includes(req.session.user._id)){
                projectToEdit.members.push(req.session.user._id);
            }
            projectToEdit.save();
            await Project.findByIdAndUpdate({_id: req.params.projectId},req.body);
            res.redirect(`/users/${req.session.user._id}/projects/${req.params.projectId}`);
        } else {
            res.redirect(`/users/${req.session.user._id}/projects`);
        }
        
    } catch (error) {
        console.log(error);
    }
});



module.exports = router;
