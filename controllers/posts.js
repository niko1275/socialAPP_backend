
import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';
import { uploadImage } from '../utils/uploadImages.js';
import fs from 'fs-extra'
import Comentario from '../models/Comentario.js';
import user from '../models/user.js';



const getPosts = async (req, res) => { 
    try {
        const postMessages = await PostMessage.find();
                
        res.status(200).json(postMessages);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getPost = async (req, res) => { 
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const createPost = async (req, res) => {
    const { title, message, creator, tags,userId } = req.body;
    console.log(userId)
    const newPostMessage = new PostMessage({ title, message, creator, tags,creatorId:userId })
    try {
        console.log(req.files)
        if (req.files?.selectedFile) {

            const result = await uploadImage(req.files.selectedFile.tempFilePath);
            newPostMessage.selectedFile ={ 
                public_id:result.public_id,
                secure_url:result.secure_url
            }

            fs.unlink(req.files.selectedFile.tempFilePath)
  
          } else {

          }

        await newPostMessage.save();
        res.json(newPostMessage );

    } catch (error) {
        console.log(error)
    
    }
}

const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    
    const updatedPost = { creator, title, message, tags, _id: id };
  
    if (req.files?.selectedFile) {

      const result = await uploadImage(req.files.selectedFile.tempFilePath);
      updatedPost.selectedFile ={ 
          public_id:result.public_id,
          secure_url:result.secure_url
      }
      fs.unlink(req.files.selectedFile.tempFilePath)
    }

    const updatepost = await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatepost);
}

const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await PostMessage.findOneAndDelete({ _id: id });

    res.json({ message: "Post deleted successfully." });
}

const likePost = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No post with id: ${id}`);
      }
    
      try {
        const post = await PostMessage.findById(id);
    
        if (!post) {
          return res.status(404).json({ message: 'Post not found' });
        }
 
        const userHasLiked = post.likes.some(like =>  like.userId.toString() === userId.toString());
        if (userHasLiked) {
            console.log("El usuario ya le dio 'like' al post.");
          } else {
            console.log("El usuario aún no le ha dado 'like' al post.");
          }
    
        const updatedPost = userHasLiked
          ? await PostMessage.findByIdAndUpdate(id, { $pull: { likes: { userId } } }, { new: true })
          : await PostMessage.findByIdAndUpdate(id, { $push: { likes: { userId } }, $inc: { likeCount: 1 } }, { new: true });
        res.json({ updatedPost });
      } catch (error) {
        console.error('Error al dar like al post:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
}


export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { text, userId } = req.body;
  
    const post = await PostMessage.findById(id);
    const usuario = await user.findById(userId);
  
    const newComment = {
        text,
        usuario: usuario._id, 
        name: usuario.name
      };

    post.comments.push(newComment);
  
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
  
    res.json(updatedPost);
  };


export {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    likePost,
    
}
