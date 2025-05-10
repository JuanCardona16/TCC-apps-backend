import app from '../core/app.ts';
import { PORT } from '@/config/env/env';

app.listen(3001, '0.0.0.0', () => {
  console.log(`Server listening on ${PORT} -> http://localhost:${PORT}`);
  console.log('Control + C por stopping the servive');
});
