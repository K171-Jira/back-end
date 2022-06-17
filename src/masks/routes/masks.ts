import express from 'express';
const router = express.Router();
const Mask = require('../models/mask');
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const name = req.query.textQuery;
    const brand = req.query.brand;
    const amount = req.query.amount;
    const priceFloor = req.query.priceFloor;
    const priceCeiling = req.query.priceCeiling;
    const type = req.query.type;

    const masks = await Mask.find({
      $and: [
        priceFloor ? { price: { $gte: priceFloor } } : {},
        priceCeiling ? { price: { $lte: priceCeiling } } : {},
        amount ? { amount: { $gte: amount } } : {},
        name ? { name: { $regex: name, $options: 'i' } } : {},
        brand ? { brand: { $regex: brand, $options: 'i' } } : {},
        type ? { type: { $regex: type, $options: 'i' } } : {},
      ],
    });

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

router.post('/', upload.single('maskImage'), async (req, res) => {
  try {
    const mask = new Mask({
      name: req.body.name,
      brand: req.body.brand,
      amount: req.body.amount,
      type: req.body.type,
      price: req.body.price,
      imageUrl: req.file?.path ?? '',
    });
    await mask.save();
    res.status(200).send(mask);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put('/:id', upload.single('maskImage'), async (req, res) => {
  try {
    if (req.file?.path) {
      req.body.imageUrl = req.file.path;
    }
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
