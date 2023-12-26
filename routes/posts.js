import express from 'express';
import { getPosts, getPost, createPost, updatePost, likePost, deletePost, commentPost } from '../controllers/posts.js';

const router = express.Router();

router.get('/', getPosts);
router.post('/', createPost);
router.get('/:id', getPost);
router.patch('/:id', updatePost);
router.delete('/:id', deletePost);
router.patch('/likePost/:id', likePost);
router.patch('/comment/:id',commentPost)

export default router;