const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();  // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;  // Use the PORT variable from .env or default to 5000

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB using the URI from the .env file
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(err));

// Recipe Schema
const recipeSchema = new mongoose.Schema({
  name: String,
  ingredients: String,
  category: String,
});

const Recipe = mongoose.model('Recipe', recipeSchema);

// Routes
app.post('/add-recipe', async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    await newRecipe.save();
    res.status(201).send(newRecipe);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/recipes', async (req, res) => {
  try {
    const category = req.query.category;
    const recipes = category
      ? await Recipe.find({ category })
      : await Recipe.find();
    res.status(200).send(recipes);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
