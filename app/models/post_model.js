const mongoose = require('mongoose') 

const postSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true
    }, 
    description:{
        type: String, 
        required: true 
    },
    // imageUrl: {
    //     type: String, 
    //     required: true
    // },
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    }, 
//    comments:[{type:mongoose.Schema.Types.ObjectId,ref:'Comment'}] 
}, {   
    timestamps: true 
})  

const Post = mongoose.model('Post', postSchema) 

module.exports = Post 