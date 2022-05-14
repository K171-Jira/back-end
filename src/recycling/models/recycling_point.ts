import { Schema, model } from 'mongoose';

interface IRecyclingPoint {
  lat: number;
  lng: number;
  address: string;
  maxCapacity: number;
  filledCapacity: number;
}

const RecyclingPointSchema = new Schema<IRecyclingPoint>(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true },
    maxCapacity: { type: Number, default: 1500 },
    filledCapacity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const RecyclingPoint = model('RecyclingPoint', RecyclingPointSchema);

export default RecyclingPoint;
