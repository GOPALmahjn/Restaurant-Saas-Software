import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true },
    description: { type: String },
    image: { type: String },
    icon: { type: String },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    color: { type: String, default: '#FF6B35' },
  },
  { timestamps: true }
);

categorySchema.index({ restaurantId: 1, slug: 1 }, { unique: true });

export default mongoose.model('Category', categorySchema);
