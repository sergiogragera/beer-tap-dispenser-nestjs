import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Beer tap dispenser')
    .setDescription(
      `This API manages the flow of a tap beer dispenser mechanism to help those bars that allow their clients 
  to serve themselves beer. Every time a client opens the tap, this API starts counting how many liters come out of the 
  tap until is closed. \n\nAfter that, the bartender could know how much their customers have spent drinking beer! 🍻`,
    )
    .setVersion('1.0.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
