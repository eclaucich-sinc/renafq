const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');

const pacienteSchema = mongoose.Schema({

  creado: {
    type: Date,
    default: Date.now
  },

  creadoPor: {
    type: String,
    default: null,
  }

},
{ strict: false })


//Hashing the password before saving to db.
// userSchema.pre('save', async function(next){
//   if(!this.isModified('password')){
//     next();
//   };
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// //Signing the JWT token with the _id of user.
// userSchema.methods.getSignedJwtToken = function(){
//   return jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES});
// };

// //Comparing the entered password with hashed password
// userSchema.methods.verifyPassword = async function(enteredPassword){
//   return await bcrypt.compare(enteredPassword, this.password);
// };


module.exports = mongoose.model('Paciente', pacienteSchema);
