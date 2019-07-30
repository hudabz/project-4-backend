const express = require('express') 
const passport = require('passport')
const Post = require('../models/post_model') 
const User = require('../models/user')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const requireToken = passport.authenticate('bearer', { session: false }) 
const router = express.Router() 
const faker = require('faker');


router.get('/posts',requireToken, (req, res, next) => {
  Post.find({'owner':req.user.id})
    // .populate('posts')
    .then(posts => {
      
        res.status(200).json({posts: posts})
    }) 
    .catch(next) 
}) 

/// all posts
router.get('/posts/all',requireToken, (req, res, next) => {
  Post.find()
    // .populate('posts')
    .then(posts => {
      
        res.status(200).json({posts: posts})
    }) 
    .catch(next) 
}) 

router.get('/posts/:id',requireToken, (req, res, next) => {
    Post.findById(req.params.id) 
    .then(handle404)
    .then(post => {
        // requireOwnership(req, post) 
        res.status(200).json({post: post.toObject()})
    })
    .catch(next) 
}) 

router.post('/posts',requireToken, (req, res, next) => {
    req.body.post.owner =  req.user.id
    let  randomName = faker.name.findName()
    Post.create(req.body.post) 
    .then(post => {
        res.status(201).json({ post: post.toObject()})
    }) 
    .catch(next) 
 }) 
 
 router.put('/posts/:id', requireToken,(req, res, next) => {
    delete req.body.post.owner
    Post.findById(req.params.id) 
    .then(handle404)
    .then( (post) => {
      requireOwnership(req, post)
      return post.update(req.body.post)
    })
    .then( () => res.sendStatus(200))
    .catch(next)
  })

  router.delete('/posts/:id', requireToken,(req, res, next) => {
    Post.findById(req.params.id)
    .then(handle404)
    .then( (post) => {
      requireOwnership(req, post)
      post.remove()
    })
    .then( () => {
      res.sendStatus(204)
    })
    .catch(next)
  }) 
 module.exports = router