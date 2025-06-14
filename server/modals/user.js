import bcrypt from "bcryptjs"
import mongoose ,{Schema} from "mongoose"
 

const userSchema=new Schema({
    name:{
        type:String,required:true
    },
    title:{
        type:String,required:true
    },
    role:{
        type:String,required:true
    },
    email:{
        type:String,required:true,unique:true
    },
    password:{
        type:String,required:true
    },
    faceData: {
        type: [Number],
        default: null
      },
      useFaceLogin: {
        type: Boolean,
        default: false
      },
    teamMembers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isAdmin:{type:Boolean,required:true,default:false},
    task : [{type:Schema.Types.ObjectId,ref:"Task"}],
    isActive:{type:Boolean,required:true,default:true},

},{timestamps:true}
)
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next()
    }
    const salt= await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
})
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

userSchema.methods.matchFace = function(capturedFaceData) {
    if (!this.faceData || !capturedFaceData) return false;
    
    const calculateDistance = (a, b) => {
      return Math.sqrt(
        a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0)
      );
    };
    
    const distance = calculateDistance(this.faceData, capturedFaceData);
    
    const THRESHOLD = 0.5;
    
    return distance < THRESHOLD;
  };
const User=mongoose.model("User",userSchema)
export default User