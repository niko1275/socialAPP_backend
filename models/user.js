import mongoose from "mongoose";
import bcrypt from 'bcrypt';


const userSchema = mongoose.Schema({
  name: { type: String, required:  true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});


userSchema.pre('save',async function(next ){
  if(!this.isModified('password')){
      next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password,salt);

});

userSchema.methods.comprobarPasword = async function(passwordFormulario){
  return await bcrypt.compare(passwordFormulario,this.password);
};


export default mongoose.model("User", userSchema);
