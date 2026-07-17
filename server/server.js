import 'dotenv/config';
import app from './src/app.js';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║   🍽️  Restaurant AR Menu API          ║
║   🚀 Running on port ${PORT}              ║
║   📊 ENV: ${process.env.NODE_ENV || 'development'}              ║
╚════════════════════════════════════════╝
    `);
  });
};

startServer().catch(console.error);

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  process.exit(1);
});
