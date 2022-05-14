import express from 'express';
import RecyclingPoint from '../models/recycling_point';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const recyclingPoints = await RecyclingPoint.find();
    res.status(200).send(recyclingPoints);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const recyclingPoint = new RecyclingPoint({
      address: req.body.address,
      lng: req.body.lng,
      lat: req.body.lat,
    });

    if (req.body.filledCapacity) recyclingPoint.filledCapacity = req.body.filledCapacity;
    if (req.body.maxCapacity) recyclingPoint.maxCapacity = req.body.maxCapacity;
    await recyclingPoint.save();
    res.status(200).send(recyclingPoint);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await RecyclingPoint.findByIdAndDelete(req.params.id);
    res.status(200).send();
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
