import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    user: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, required: true },
      avatar: String,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 500 },
    images: [{ type: String }],
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true },
    helpful: { type: Number, default: 0 },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  },
  { timestamps: true }
);

reviewSchema.index({ menuItem: 1, restaurantId: 1 });

export default mongoose.model('Review', reviewSchema);
