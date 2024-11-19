import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import your custom CSS if needed

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [category, setCategory] = useState('');
  const [filter, setFilter] = useState('');

  // Fetch recipes from the backend, with filtering if a category is selected
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/recipes${filter ? `?category=${filter}` : ''}`
        );
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };
    fetchRecipes();
  }, [filter]);

  // Function to add a new recipe
  const addRecipe = async () => {
    try {
      const newRecipe = { name, ingredients, category };
      await axios.post('http://localhost:5000/add-recipe', newRecipe);
      setName('');
      setIngredients('');
      setCategory('');
      setFilter(''); // Reset filter to show all recipes
      // Fetch updated recipes
      const response = await axios.get('http://localhost:5000/recipes');
      setRecipes(response.data);
    } catch (error) {
      console.error('Error adding recipe:', error);
    }
  };

  return (
    <div className="app-container">
      <h1>Recipe Book</h1>
      <div className="form-container">
        <input
          type="text"
          placeholder="Recipe Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          <option value="Dessert">Dessert</option>
          <option value="Main Course">Main Course</option>
        </select>
        <button onClick={addRecipe}>Add Recipe</button>
      </div>

      <h2>Filter by Category</h2>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="">All</option>
        <option value="Dessert">Dessert</option>
        <option value="Main Course">Main Course</option>
      </select>

      <h2>Recipes</h2>
      <ul className="recipe-list">
        {recipes.map((recipe) => (
          <li key={recipe._id} className="recipe-item">
            <h3>{recipe.name}</h3>
            <p>{recipe.ingredients}</p>
            <p><strong>Category:</strong> {recipe.category}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
