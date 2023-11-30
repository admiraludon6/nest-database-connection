import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from 'app.module';

async function bootstrap() {

    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const SERVER_ADDRESS = process.env.SERVER_ADDRESS || "127.0.0.1";
    const SERVER_PORT = process.env.SERVER_PORT || 3000;

    /**
     * Static view
     */
    // app.useStaticAssets(join(__dirname, '..', 'public'));
    // app.useStaticAssets(join(__dirname, '..', 'documentation'));
    // app.setViewEngine('html');
    
    /**
     * Enable CORS
     */
    app.enableCors();

    /**
     * Disable Logging
     */
    if (process.env.ENABLE_LOGGING !== "true") {
        app.useLogger(false); 
    }

    /**
     * Swagger
     */
    if (process.env.SWAGGER_ENABLED === "true") {
        const config = new DocumentBuilder()
            .setTitle(process.env.SWAGGER_TITLE)
            .setDescription(process.env.SWAGGER_DESCRIPTION)
            .setVersion(process.env.SWAGGER_VERSION)
            .addSecurity('oauth2', { type: 'http', scheme: 'bearer'})
            .build();

        const document = SwaggerModule.createDocument(app, config);
        const context = process.env.SERVER_CONTEXT ? (process.env.SERVER_CONTEXT + '/swagger') : 'swagger';
        SwaggerModule.setup(context, app, document);
        Logger.log(`[MainApplication] Swagger configured on http://localhost:3000/${context}`, "MainApplication");
    }
    
    await app.listen(SERVER_PORT, SERVER_ADDRESS, () => {
        Logger.log(`NestJS app is running on http://${SERVER_ADDRESS}:${SERVER_PORT}`, "MainApplication");
    });
}
bootstrap();