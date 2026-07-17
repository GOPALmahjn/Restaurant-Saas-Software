import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    logo: { type: String },
    coverImage: { type: String },
    cuisine: [{ type: String }],
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    contact: {
      phone: String,
      email: String,
      website: String,
      whatsapp: String,
    },
    timing: [
      {
        day: String,
        open: String,
        close: String,
        isClosed: { type: Boolean, default: false },
      },
    ],
    tables: [
      {
        tableNumber: Number,
        qrCode: String,
        capacity: Number,
        isActive: { type: Boolean, default: true },
      },
    ],
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    features: {
      arEnabled: { type: Boolean, default: true },
      onlineOrdering: { type: Boolean, default: true },
      tableReservation: { type: Boolean, default: true },
    },
    social: {
      instagram: String,
      facebook: String,
      twitter: String,
    },
    theme: {
      primaryColor: { type: String, default: '#FF6B35' },
      accentColor: { type: String, default: '#F7C59F' },
    },
    gstin: String,
    taxRate: { type: Number, default: 5 },
    deliveryCharges: { type: Number, default: 0 },
    minimumOrder: { type: Number, default: 0 },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Restaurant', restaurantSchema);
