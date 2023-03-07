const { Schema, model, models } = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: [true, "Email required"], unique: true },
  password: { type: String, required: [true, "Password required"] },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  podcastsList: [{ type: Schema.Types.ObjectId, ref: "PodcastInfo" }],
});

UserSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.set("toJSON", {
  transform: (document, returnObject) => {
    (returnObject.id = returnObject._id),
      delete returnObject.password,
      delete returnObject._id,
      delete returnObject.__v;
  },
});

module.exports = models.User || model("User", UserSchema);
