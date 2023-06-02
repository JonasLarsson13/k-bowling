import mongoose from "mongoose";

const connectDB = async () => {
  const mongoURL =
    "mongodb+srv://examinationbowlingjl23:fyZ9XbFR4cCYdvZY@bowling.przcxr0.mongodb.net/Bowling?retryWrites=true&w=majority";
  try {
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connection Success 👍");
  } catch (error) {
    console.log("MongoDB Connection Failed 💥");
    process.exit(1);
  }
};

export default connectDB;
