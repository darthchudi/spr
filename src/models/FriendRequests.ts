import Mongoose, {model, Schema, Document} from "mongoose";

export interface IFriendRequest{
  sender: string;
  reciever: string;
  status: string;
}

export interface FriendRequestDocument extends IFriendRequest, Document{}

const FriendRequestSchema = new Schema({
  sender: String,
  reciever: String,
  status: String
});

export default model<FriendRequestDocument>("FriendRequests", FriendRequestSchema)