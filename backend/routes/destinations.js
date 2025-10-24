const express = require('express');
const { authenticateUser } = require('../middleware/auth');
const { validateDestination, validateId } = require('../middleware/validation');
const supabase = require('../config/supabase');
const { deleteObject } = require('../config/aws');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateUser);

// GET /api/destinations - Get all destinations for the authenticated user
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

// GET /api/destinations/:id - Get a specific destination
router.get('/:id', validateId, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Destination not found' });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching destination:', error);
    res.status(500).json({ error: 'Failed to fetch destination' });
  }
});

// POST /api/destinations - Create a new destination
router.post('/', validateDestination, async (req, res) => {
  try {
    const { name, country, notes, visited = false, category, region, image_urls = [] } = req.body;

    const { data, error } = await supabase
      .from('destinations')
      .insert({
        user_id: req.user.id,
        name,
        country,
        notes,
        visited,
        category,
        region,
        image_urls
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating destination:', error);
    res.status(500).json({ error: 'Failed to create destination' });
  }
});

// PUT /api/destinations/:id - Update a destination
router.put('/:id', validateId, validateDestination, async (req, res) => {
  try {
    const { name, country, notes, visited, category, region, image_urls } = req.body;

    // First, get the current destination to check ownership and get old image URLs
    const { data: currentDestination, error: fetchError } = await supabase
      .from('destinations')
      .select('image_urls')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Destination not found' });
      }
      throw fetchError;
    }

    // Update the destination
    const { data, error } = await supabase
      .from('destinations')
      .update({
        name,
        country,
        notes,
        visited,
        category,
        region,
        image_urls: image_urls || currentDestination.image_urls
      })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Error updating destination:', error);
    res.status(500).json({ error: 'Failed to update destination' });
  }
});

// DELETE /api/destinations/:id - Delete a destination
router.delete('/:id', validateId, async (req, res) => {
  try {
    // First, get the destination to check ownership and get image URLs
    const { data: destination, error: fetchError } = await supabase
      .from('destinations')
      .select('image_urls')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Destination not found' });
      }
      throw fetchError;
    }

    // Delete images from S3
    if (destination.image_urls && destination.image_urls.length > 0) {
      const deletePromises = destination.image_urls.map(url => {
        const key = url.split('/').pop();
        return deleteObject(key).catch(err => {
          console.error('Error deleting image from S3:', err);
          // Don't fail the entire operation if image deletion fails
        });
      });
      await Promise.all(deletePromises);
    }

    // Delete the destination from database
    const { error } = await supabase
      .from('destinations')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) {
      throw error;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting destination:', error);
    res.status(500).json({ error: 'Failed to delete destination' });
  }
});

// GET /api/destinations/search - Search destinations
router.get('/search', async (req, res) => {
  try {
    const { q, region, category, visited } = req.query;
    let query = supabase
      .from('destinations')
      .select('*')
      .eq('user_id', req.user.id);

    if (q) {
      query = query.or(`name.ilike.%${q}%,country.ilike.%${q}%,notes.ilike.%${q}%`);
    }

    if (region) {
      query = query.eq('region', region);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (visited !== undefined) {
      query = query.eq('visited', visited === 'true');
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Error searching destinations:', error);
    res.status(500).json({ error: 'Failed to search destinations' });
  }
});

module.exports = router;
