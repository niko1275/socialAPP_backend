import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    title: String,
    message: String,
    creator: String,
    tags: [String],
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
    },
    selectedFile: {
        public_id:String,
        secure_url:String
    },
    likes: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
          },
        },
      ],
      comments: [],
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

var PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;
