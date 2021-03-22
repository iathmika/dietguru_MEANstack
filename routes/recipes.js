var express = require('express');
var router = express.Router();
var Recipe = require('../models/recipe');
var mongoose = require('mongoose');

router.get('/', async (req, res)=>{
    try{
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch(err)
        {
            res.json({message: err});
        }
});

router.post('/', async (req, res)=>{
    const recipe = new Recipe({
        name: req.body.name,
        ingredients: req.body.ingredients,
        steps: req.body.steps,
        timers: req.body.timers,
        imageURL: req.body.imageURL,
        originalURL: req.body.originalURL
    });

    try{
        const savedRecipe = await recipe.save();
        res.json(savedRecipe);
    } catch(err)
        {
            res.json({message: err});
        }
});

router.get('/:recipeId', async (req, res)=>{
    console.log(req.params.recipeId);
    try{
        const recipe = await Recipe.findById(req.params.recipeId);
        res.json(recipe);
    } catch(err)
        {
            res.json({message: err});
        }
});

router.delete('/:recipeId', async (req, res)=>{
    console.log(req.params.recipeId);
    try{
        const removedRecipe = await Recipe.remove({"_id": req.params.recipeId});
        res.json(removedRecipe);
    } catch(err)
        {
            res.json({message: err});
        }
});

router.patch('/:recipeId', async (req, res)=>{
    console.log(req.params.recipeId);
    try{
        const updatedRecipe = await Recipe.updateOne(
            {"_id": req.params.recipeId},
            { $set: {name: req.body.name, imageURL: req.body.imageURL, originalURL: req.body.originalURL}}
        );
        res.json(updatedRecipe);
    } catch(err)
        {
            res.json({message: err});
        }
});

module.exports = router;