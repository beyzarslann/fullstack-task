import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { FirebaseService } from './firebase/firebase.service';
import { UsdtService } from './usdt/usdt.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [FirebaseService, UsdtService],
})
export class AppModule {}
