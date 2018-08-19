import Mongoose from "mongoose";

export interface IFriendRequest{
  sender: string;
  reciever: string;
  status: string;
}

export interface FriendRequestDocument extends IFriendRequest, Mongoose.Document{}

const FriendRequestSchema = new Mongoose.Schema({
  sender: Mongoose.Schema.Types.ObjectId,
  reciever: Mongoose.Schema.Types.ObjectId,
  status: {
    type: Boolean,
    default: false
  }
});

export default Mongoose.model<FriendRequestDocument>("FriendRequests", FriendRequestSchema)