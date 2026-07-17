import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    price: { type: Number, required: true, min: 0 },
    discountedPrice: { type: Number },
    images: [{ type: String }],
    thumbnail: { type: String },
    model3d: {
      glb: { type: String },
      usdz: { type: String },
      poster: { type: String },
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    type: { type: String, enum: ['veg', 'non-veg', 'vegan', 'egg'], default: 'veg' },
    spiceLevel: { type: String, enum: ['mild', 'medium', 'hot', 'extra-hot'], default: 'mild' },
    prepTime: { type: Number, default: 15, comment: 'in minutes' },
    calories: { type: Number },
    servingSize: { type: String },
    ingredients: [{ type: String }],
    allergens: [{ type: String }],
    nutritionFacts: {
      protein: Number,
      carbs: Number,
      fat: Number,
      fiber: Number,
      sugar: Number,
      sodium: Number,
    },
    tags: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isRecommended: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    arViews: { type: Number, default: 0 },
    customizations: [
      {
        name: String,
        options: [{ name: String, price: Number }],
        required: Boolean,
      },
    ],
  },
  { timestamps: true }
);

menuItemSchema.index({ restaurantId: 1, category: 1, isAvailable: 1 });
menuItemSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.model('MenuItem', menuItemSchema);
