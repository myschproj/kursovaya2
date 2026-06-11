import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import elevatorRoutes from './routes/elevatorRoutes.js';
import floorRoutes from './routes/floorRoutes.js';
import callRoutes from './routes/callRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import dispatchRuleRoutes from './routes/dispatchRuleRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { elevatorStatusNotifier } from './observers/elevatorStatusNotifier.js';
import { EventLogObserver } from './observers/eventLogObserver.js';

const app = express();
elevatorStatusNotifier.subscribe(new EventLogObserver());

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'elevator-control-api' }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/elevators', elevatorRoutes);
app.use('/api/floors', floorRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dispatch-rules', dispatchRuleRoutes);
app.use(errorHandler);

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Elevator Control API started on port ${port}`);
});
