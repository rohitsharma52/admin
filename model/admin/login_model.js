const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');
const loginSchema=new mongoose.Schema({
          username:{
          type: String,
          required: true,
          },
          password: {
          type: String,
          required: true,
                },
          email: { type: String,
          required:true,
          unique: true,
         }
});
loginSchema.pre('save', async function(next) {
          if (this.isModified('password') || this.isNew) {
              const salt = await bcrypt.genSalt(10);
              this.password = await bcrypt.hash(this.password, salt);
          }
          next();
      });
loginSchema.methods.comparePassword = async function(candidatePassword) {
          return await bcrypt.compare(candidatePassword, this.password);
}; 
const Register = mongoose.model('Register', loginSchema);
module.exports=Register;   