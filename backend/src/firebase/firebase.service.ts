import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  constructor() {
    if (!admin.apps.length) {
      const serviceAccount = require('../../serviceAccountKey.json');

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      console.log('Firebase hazır ✅');
    }
  }

  async subscribe(token: string) {
    await admin.messaging().subscribeToTopic(token, 'usdt');
    console.log('Abone oldu ✅');
    return { ok: true };
  }

  async sendAlert(data: {
    from: string;
    to: string;
    amount: string;
    txHash: string;
  }) {
    const body = `Amount: ${data.amount} | from: ${data.from} | to: ${data.to} | tx: ${data.txHash}`;

    await admin.messaging().send({
      topic: 'usdt',
      notification: {
        title: 'BIG TRANSFER 🚨',
        body,
      },
      // data key'leri kısa olsun: f,t,a,h
      data: {
        f: String(data.from),
        t: String(data.to),
        a: String(data.amount),
        h: String(data.txHash),
      },
    });

    console.log('Bildirim gitti ✅');
    return true;
  }
}
