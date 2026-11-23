import { createApp } from './app.mjs';
import { createHttpServer } from './http.mjs';

const port = Number(process.env.PORT ?? 3000);
const app = createApp({ plans: [] });
createHttpServer(app).listen(port, () => console.log(`AI Travel Planner API listening on ${port}`));
