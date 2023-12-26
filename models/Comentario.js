import mongoose from 'mongoose';

const commentSchema = mongoose.Schema({
  text: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

export default mongoose.model('comentarios',commentSchema)