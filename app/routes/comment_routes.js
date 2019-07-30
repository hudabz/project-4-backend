const express = require('express') 
const passport = require('passport')
const Comment = require('../models/Comment_model') 
const User = require('../models/user')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const requireToken = passport.authenticate('bearer', { session: false }) 
const router = express.Router() 


router.get('/posts/:post_id/comments',requireToken, (req, res, next) => {
    Comment.find({'post':req.params.post_id}) 
    .then(comments => { 
        res.status(200).json({comments: comments})
    }) 
    .catch(next) 
}) 

router.get('/comments/:id',requireToken, (req, res, next) => {
    Comment.findById(req.params.id) 
    .then(handle404)
    .then(comment => {
        requireOwnership(req, comment) 
        res.status(200).json({comment: comment.toObject()})
    })
    .catch(next) 
}) 

router.post('/comments',requireToken, (req, res, next) => {
    req.body.comment.owner =  req.user.id
    
    Comment.create(req.body.comment) 
    .then(comment => {
        res.status(201).json({ comment: comment.toObject()})
    })
    .catch(next) 
 }) 
 
 router.put('/comments/:id', requireToken,(req, res, next) => {
    delete req.body.comment.owner
    Comment.findById(req.params.id)
    .then(handle404)
    .then( (comment) => {
      requireOwnership(req, comment)
      return comment.update(req.body.comment)
    })
    .then( () => res.sendStatus(200))
    .catch(next)
  })

  router.delete('/comments/:id', requireToken,(req, res, next) => {
    Comment.findById(req.params.id)
    .then(handle404)
    .then( (comment) => {
      requireOwnership(req, comment)
      comment.remove()
    })
    .then( () => {
      res.sendStatus(204)
    })
    .catch(next)
  })
 module.exports = router 