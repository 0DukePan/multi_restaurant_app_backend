import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true
    },
    banner : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    },

},
{
    timestamps : true
})

const Category = mongoose.model('Category' , CategorySchema)

export default Category