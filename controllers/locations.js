const express = require('express');
const router = express.Router();

const Location = require('../models/location.js');

router.get('/', async (req, res) => {
  const locationsWithOwner = await Location.find({}).populate('owner');
  res.render('locations/index.ejs', {
    locations: locationsWithOwner,
  });
});

router.get('/new', async (req, res) => {
  res.render('locations/new.ejs');
});

router.get('/:locationId', async (req, res) => {
  const locationWithOwner = await Location.findById(req.params.locationId).populate('owner');
  res.render('locations/show.ejs', {
    location: locationWithOwner,
  });
});

router.get('/:locationId/edit', async (req, res) => {
  const currentLocation = await Location.findById(req.params.locationId)
  res.render('locations/edit.ejs', {
    location: currentLocation,
  });
});

router.post('/', async (req, res) => {
  req.body.owner = req.session.user._id;
  await Location.create(req.body);
  res.redirect('/locations');
});

router.delete('/:locationId', async (req, res) => {
  const location = await Location.findById(req.params.locationId)
  if (location.owner.equals(req.session.user._id)) {
    await location.deleteOne()
    res.redirect('/locations')
  } else {
    res.send("You don't have permission to do that.")
  }
})

router.put('/:locationId', async (req, res) => {
  const currentLocation = await Location.findById(req.params.locationId)
  if (currentLocation.owner.equals(req.session.user._id)) {
    await currentLocation.updateOne(req.body);
    res.redirect('/locations');
  } else {
    res.send("You don't have permission to do that.")
  }
});

module.exports = router;
