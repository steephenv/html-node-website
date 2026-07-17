import { app } from './app';
import { config } from './config';
import { connectDb } from './db';

async function start() {
  await connectDb();
  app.listen(config.port, () => {
    console.log(`Feedback API listening on port ${config.port}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
