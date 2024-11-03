import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type fundingRate = {
  symbol: string;
  markPrice: string;
  indexPrice: string;
  estimatedSettlePrice: string;
  lastFundingRate: string;
  interestRate: string;
  nextFundingTime: number;
  time: number;
};

export type symbols = {
  symbols: Array<{
    symbol: string;
  }>;
};

@Injectable({
  providedIn: 'root',
})
export class FundingRateService {
  constructor(private httpClient: HttpClient) {}

  getFundingRate(symbol: string) {
    return this.httpClient.get(
      `https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${symbol}`
    ) as Observable<fundingRate>;
  }

  getAllSymbols() {
    return this.httpClient.get(
      'https://fapi.binance.com/fapi/v1/exchangeInfo'
    ) as Observable<symbols>;
  }
}
