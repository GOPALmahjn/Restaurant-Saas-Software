import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  price: Number,
  customizations: [{ name: String, option: String, price: Number }],
});

const cartSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tableNumber: Number,
    items: [cartItemSchema],
    couponCode: String,
    couponDiscount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

cartSchema.index({ sessionId: 1, restaurantId: 1 });

export default mongoose.model('Cart', cartSchema);
