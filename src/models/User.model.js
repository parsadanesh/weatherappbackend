import { Schema, model } from "mongoose";

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    savedLocations: {type:[String], default: []}
});

const User = model("UserDetail", userSchema);

export default User;
