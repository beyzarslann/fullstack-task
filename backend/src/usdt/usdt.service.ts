import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class UsdtService {
  constructor(
    private config: ConfigService,
    private firebase: FirebaseService,
  ) {
    this.listen();
  }

  listen() {
    const wsUrl = this.config.get<string>('WS_RPC_URL');
    if (!wsUrl) {
      console.log('WS_RPC_URL yok ❌');
      return;
    }

    const provider = new ethers.WebSocketProvider(wsUrl);

    const usdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
    const abi = [
      'event Transfer(address indexed from, address indexed to, uint256 value)',
    ];

    const contract = new ethers.Contract(usdtAddress, abi, provider);

    console.log('USDT dinleniyor ✅');

    contract.on('Transfer', async (from, to, value, event) => {
      try {
        const amount = Number(ethers.formatUnits(value, 6));
        if (amount < 100000) return;

        console.log('BIG TRANSFER:', amount, from, to);

        await this.firebase.sendAlert({
          from: String(from),
          to: String(to),
          amount: String(amount),
          txHash: String(event.transactionHash),
        });
      } catch (err) {
        console.log('Hata:', err);
      }
    });
  }
}
