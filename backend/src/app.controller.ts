import { Body, Controller, Get, Post } from '@nestjs/common';
import { FirebaseService } from './firebase/firebase.service';

@Controller()
export class AppController {
  constructor(private firebase: FirebaseService) {}

  @Get()
  ok() {
    return { ok: true };
  }

  @Post('subscribe')
  subscribe(@Body('token') token: string) {
    return this.firebase.subscribe(token);
  }
}
