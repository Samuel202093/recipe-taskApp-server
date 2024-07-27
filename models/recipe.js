import mongoose from 'mongoose'


const recipeSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    ingredients:{
        type: String,
        required: true
    }, 
    instructions:{
        type: String,
        required: true
    },
    imageUrl:{
        type: String,
    }
    
}, {timestamps: true})

const Recipe = mongoose.model('recipe', recipeSchema)

export default Recipe