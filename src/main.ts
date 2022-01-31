import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder().setTitle("Dallor Monitoring").setDescription("....").build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/", app, document)
  await app.listen(3000);
}
bootstrap();
