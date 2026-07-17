import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: String,
  price: Number,
  quantity: { type: Number, required: true, min: 1 },
  image: String,
  customizations: [{ name: String, option: String, price: Number }],
  subtotal: Number,
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    customer: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: String,
    },
    tableNumber: { type: Number },
    items: [orderItemSchema],
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: { type: String, enum: ['cash', 'upi', 'card', 'online'], default: 'cash' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    couponCode: String,
    couponDiscount: { type: Number, default: 0 },
    subtotal: { type: Number, required: true },
    taxAmount: { type: Number, default: 0 },
    deliveryCharges: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    specialInstructions: String,
    estimatedPrepTime: { type: Number, default: 20 },
    timeline: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String,
      },
    ],
  },
  { timestamps: true }
);

orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = 'ORD' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

export default mongoose.model('Order', orderSchema);
