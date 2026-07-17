import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    date: { type: Date, required: true },
    revenue: { type: Number, default: 0 },
    orderCount: { type: Number, default: 0 },
    customerCount: { type: Number, default: 0 },
    averageOrderValue: { type: Number, default: 0 },
    arViewCount: { type: Number, default: 0 },
    menuViewCount: { type: Number, default: 0 },
    topItems: [
      {
        menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
        name: String,
        count: Number,
        revenue: Number,
      },
    ],
    categoryBreakdown: [
      {
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
        name: String,
        count: Number,
        revenue: Number,
      },
    ],
  },
  { timestamps: true }
);

analyticsSchema.index({ restaurantId: 1, date: 1 }, { unique: true });

export default mongoose.model('Analytics', analyticsSchema);
