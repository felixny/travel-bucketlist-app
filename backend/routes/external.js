const express = require('express');
const axios = require('axios');

const router = express.Router();

// GET /api/external/unsplash/:query - Get images from Unsplash
router.get('/unsplash/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1, per_page = 10 } = req.query;

    if (!process.env.UNSPLASH_ACCESS_KEY) {
      return res.status(500).json({ 
        error: 'Unsplash API key not configured' 
      });
    }

    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        page,
        per_page,
        orientation: 'landscape'
      },
      headers: {
        'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
      }
    });

    const images = response.data.results.map(photo => ({
      id: photo.id,
      url: photo.urls.regular,
      thumb: photo.urls.thumb,
      description: photo.description || photo.alt_description,
      photographer: photo.user.name,
      photographer_url: photo.user.links.html
    }));

    res.json({
      images,
      total: response.data.total,
      total_pages: response.data.total_pages
    });
  } catch (error) {
    console.error('Error fetching Unsplash images:', error);
    if (error.response?.status === 401) {
      res.status(500).json({ error: 'Invalid Unsplash API key' });
    } else if (error.response?.status === 403) {
      res.status(500).json({ error: 'Unsplash API rate limit exceeded' });
    } else {
      res.status(500).json({ error: 'Failed to fetch images from Unsplash' });
    }
  }
});

// GET /api/external/countries - Get all countries from REST Countries API
router.get('/countries', async (req, res) => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all');
    
    const countries = response.data.map(country => ({
      name: country.name.common,
      officialName: country.name.official,
      code: country.cca2,
      region: country.region,
      subregion: country.subregion,
      capital: country.capital?.[0],
      population: country.population,
      area: country.area,
      flag: country.flags?.png,
      flagEmoji: country.flag
    }));

    res.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ error: 'Failed to fetch countries data' });
  }
});

// GET /api/external/countries/:code - Get specific country by code
router.get('/countries/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    const response = await axios.get(`https://restcountries.com/v3.1/alpha/${code}`);
    
    if (response.data.length === 0) {
      return res.status(404).json({ error: 'Country not found' });
    }

    const country = response.data[0];
    const countryData = {
      name: country.name.common,
      officialName: country.name.official,
      code: country.cca2,
      region: country.region,
      subregion: country.subregion,
      capital: country.capital?.[0],
      population: country.population,
      area: country.area,
      flag: country.flags?.png,
      flagEmoji: country.flag,
      languages: country.languages ? Object.values(country.languages) : [],
      currencies: country.currencies ? Object.keys(country.currencies) : [],
      timezones: country.timezones || []
    };

    res.json(countryData);
  } catch (error) {
    console.error('Error fetching country:', error);
    if (error.response?.status === 404) {
      res.status(404).json({ error: 'Country not found' });
    } else {
      res.status(500).json({ error: 'Failed to fetch country data' });
    }
  }
});

// GET /api/external/regions - Get unique regions from countries
router.get('/regions', async (req, res) => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all');
    
    const regions = [...new Set(response.data.map(country => country.region))].filter(Boolean);
    
    res.json(regions.sort());
  } catch (error) {
    console.error('Error fetching regions:', error);
    res.status(500).json({ error: 'Failed to fetch regions data' });
  }
});

module.exports = router;
