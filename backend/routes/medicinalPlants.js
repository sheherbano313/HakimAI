const express = require('express');
const router = express.Router();
const JSONDatabase = require('../utils/database');
const auth = require('../middleware/auth');

// Load JSON dataset
const plantsDB = new JSONDatabase('medicinal_plants.json');

// GET /api/medicinal-plants - Get all plants
router.get('/', (req, res) => {
  try {
    const plants = plantsDB.read();
    res.json({
      success: true,
      count: plants.length,
      data: plants
    });
  } catch (error) {
    console.error('Error fetching plants:', error);
    res.status(500).json({ error: 'Failed to fetch medicinal plants' });
  }
});

// GET /api/medicinal-plants/search - Search plants by symptom or name
// IMPORTANT: This must come BEFORE the /:id route
router.get('/search', (req, res) => {
  try {
    const { symptom, name, scientificName } = req.query;
    
    if (!symptom && !name && !scientificName) {
      return res.status(400).json({ error: 'At least one search parameter is required' });
    }

    const plants = plantsDB.read();
    let results = plants;

    if (symptom) {
      results = results.filter(plant => 
        plant.Uses?.toLowerCase().includes(symptom.toLowerCase()) ||
        plant.Symptoms?.toLowerCase().includes(symptom.toLowerCase())
      );
    }

    if (name) {
      results = results.filter(plant => 
        plant['Local Name']?.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (scientificName) {
      results = results.filter(plant => 
        plant['Scientific Name']?.toLowerCase().includes(scientificName.toLowerCase())
      );
    }

    res.json({
      success: true,
      count: results.length,
      query: { symptom, name, scientificName },
      data: results
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// GET /api/medicinal-plants/:id - Get plant by ID
// This must come AFTER specific routes like /search
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const plant = plantsDB.findOne({ id });
    
    if (!plant) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    res.json({
      success: true,
      data: plant
    });
  } catch (error) {
    console.error('Error fetching plant:', error);
    res.status(500).json({ error: 'Failed to fetch plant' });
  }
});

// POST /api/medicinal-plants - Add new plant (Protected route)
router.post('/', auth, (req, res) => {
  try {
    const { 'Scientific Name': scientificName, 'Local Name': localName, Uses, Symptoms } = req.body;
    
    if (!scientificName || !localName) {
      return res.status(400).json({ error: 'Scientific name and local name are required' });
    }

    const newPlant = plantsDB.insert({
      'Scientific Name': scientificName,
      'Local Name': localName,
      Uses: Uses || '',
      Symptoms: Symptoms || '',
      addedBy: req.user.userId
    });

    res.status(201).json({
      success: true,
      message: 'Plant added successfully',
      data: newPlant
    });
  } catch (error) {
    console.error('Error adding plant:', error);
    res.status(500).json({ error: 'Failed to add plant' });
  }
});

// PUT /api/medicinal-plants/:id - Update plant (Protected route)
router.put('/:id', auth, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedPlant = plantsDB.update(id, updates);
    
    if (!updatedPlant) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    res.json({
      success: true,
      message: 'Plant updated successfully',
      data: updatedPlant
    });
  } catch (error) {
    console.error('Error updating plant:', error);
    res.status(500).json({ error: 'Failed to update plant' });
  }
});

// DELETE /api/medicinal-plants/:id - Delete plant (Protected route)
router.delete('/:id', auth, (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedPlant = plantsDB.delete(id);
    
    if (!deletedPlant) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    res.json({
      success: true,
      message: 'Plant deleted successfully',
      data: deletedPlant
    });
  } catch (error) {
    console.error('Error deleting plant:', error);
    res.status(500).json({ error: 'Failed to delete plant' });
  }
});

module.exports = router;
