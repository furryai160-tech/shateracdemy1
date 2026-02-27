import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. السماح للفرونت إند إنه يكلم الباك إند (عشان مشكلة CORS)
  app.enableCors({
    origin: '*',
  });

  // 2. السطر ده هو السر! لازم ياخد البورت من Railway ويشتغل على 0.0.0.0
  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
