import express from 'express';
const router = express.Router();
const Mask = require('../models/mask');

router.get('/', async (req, res) => {
  try {
    const test = req.query.textQuery;
    const masks = await Mask.find(test ? { name: test } : {});
    res.status(200).send(masks);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const mask = await Mask.findById(req.params.id);
    res.status(200).send(mask);
  } catch (err) {
    res.status(500).send(err);
  }
});


router.post('/', async (req, res) => {
  try {
    const mask = new Mask({
      name: req.body.name,
      brand: req.body.brand,
      amount: req.body.amount,
      type: req.body.type,
      price: req.body.price,
    });
    await mask.save();
    res.status(200).send(mask);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedMask = await Mask.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(updatedMask);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Mask.findByIdAndDelete(req.params.id);
    res.status(200).send();
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
