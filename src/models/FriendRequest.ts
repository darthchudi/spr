import Mongoose from 'mongoose';

export interface IFriendRequest {
  sender: string;
  reciever: string;
  accepted: string;
}

export interface FriendRequestDocument
  extends IFriendRequest,
    Mongoose.Document {}

const FriendRequestSchema = new Mongoose.Schema({
  sender: Mongoose.Schema.Types.ObjectId,
  reciever: Mongoose.Schema.Types.ObjectId,
  accepted: {
    type: Boolean,
    default: false,
  },
});

export default Mongoose.model<FriendRequestDocument>(
  'FriendRequests',
  FriendRequestSchema
);
