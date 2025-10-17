import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  isConnected = true;
  console.log("✅ MongoDB connected");
};

// 2. Define schema & model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: {type: String, required: true, unique: true},
  payment_status: {type: String, required: false, unique: false, default: 'basic'}},
  {versionKey : false}
);

const User = mongoose.model("User", userSchema, "drone_credentials_collection");

export const registerUser = async(username, email, password) => {
    try{
        const user = new User({username, password, email, payment_status:"basic"});
        await user.save();
        return "Registration Successful!";
    } catch (err) {
        return "Error while registering";
    }
}
// 4. Get password for given username

export const login = async (username, password) => {
    try{
    const user = await User.findOne({ username });
    if(!user){
        throw new Error("NonExistentUser");
    }
    return password === user.password;
    } catch (err) {
        return false;
    }
}

export const printAllUsers = async () => {
  const users = await User.find({});
  console.log(users);
};




