import { Schema, model } from 'mongoose';

interface IRecyclingPoint {
  lat: number;
  lng: number;
  address: string;
  deviceId: string;
  maxCapacity: number;
  filledCapacity: number;
}

const RecyclingPointSchema = new Schema<IRecyclingPoint>(
  {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String },
    deviceId: { type: String },
    maxCapacity: { type: Number, default: 1500 },
    filledCapacity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const RecyclingPoint = model('RecyclingPoint', RecyclingPointSchema);

export default RecyclingPoint;
