import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS for mobile access
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0'); // Listen on all network interfaces
}
bootstrap();
