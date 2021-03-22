var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ingSchema = new Schema({
    quantity: String,
    name: String,
    type: String
}),
stepSchema = new Schema({
    step: String
}),
timeSchema = new Schema({
    timer: Number
}),
recipeSchema = new Schema( {
	name: {
        type: String,
        required: true
    },
    ingredients: [ingSchema],
    steps: [stepSchema],
    timers: [timeSchema],
    imageURL: String,
    originalURL: String
}),
Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;