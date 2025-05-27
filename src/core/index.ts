import { PORT } from '@/config/env/env';
import app from './app';

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server listening on ${PORT} -> http://localhost:${PORT}`);
  console.log('Control + C por stopping the servive');
});
