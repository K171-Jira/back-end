import express from 'express';
import RecyclingPoint from '../models/recycling_point';
import bcrypt from 'bcrypt';
import User from '../../auth/models/user';
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

router.post('/online', async (req, res) => {
  try {
    const recyclingPoints = await RecyclingPoint.find();
    let foundPoint = null;

    for (const point of recyclingPoints) {
      if (point.deviceId && (await bcrypt.compare(req.body.deviceId, point.deviceId))) {
        foundPoint = point;
      }
    }

    console.log(foundPoint);
    if (!foundPoint) {
      const recyclingPoint = new RecyclingPoint({
        deviceId: await bcrypt.hash(req.body.deviceId, 10),
      });
      await recyclingPoint.save();
      res.status(200).send(recyclingPoint);
    } else {
      res.status(200).send();
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/recycle', async (req, res) => {
  try {
    const { userId, deviceId } = req.body;
    const recyclingPoints = await RecyclingPoint.find();
    let foundPoint = null;

    for (const point of recyclingPoints) {
      if (point.deviceId && (await bcrypt.compare(deviceId, point.deviceId))) {
        foundPoint = point;
      }
    }
    if (foundPoint) {
      const user = await User.findById(userId);
      user.balance += 10;
      await user.save();
      res.status(200).send(user);
    } else {
      res.status(404).send('no recycling point found by id');
    }
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
