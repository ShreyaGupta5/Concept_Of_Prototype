import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/database.js';
import { ensureDefaultServices } from './seed/bootstrapServices.js';
const port = process.env.PORT || 5000;
await connectDatabase();
await ensureDefaultServices();
app.listen(port, '0.0.0.0', () => process.stdout.write(`CampusFlow running on port ${port}\n`));
