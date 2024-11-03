import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { interval, Subscription } from 'rxjs';
import { HeaderComponent } from '../../components/header/header.component';
import { FundingRateService } from '../../services/funding-rate.service';
import {
  notification,
  NotificationService,
} from '../../services/notification.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    HeaderComponent,
    ChipModule,
    ButtonModule,
    DialogModule,
    FloatLabelModule,
    InputTextModule,
    InputNumberModule,
    AutoCompleteModule,
    DatePipe,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  cardDialog = false;
  isEditing = false;
  currentEditId = 0;
  suggestions: Array<string> = [];
  symbolSuggestions: Array<string> = [];
  clockSubscription: Subscription | null = null;
  proximaAtualizacao: string = '';
  ultimaAtualizacao: Date | null = null;
  diferencaTempoAtualizacaoSegundos = 10;
  notificationSound = new Audio('assets/notification.mp3');

  formGroup = new FormGroup({
    symbol: new FormControl('', [Validators.required]),
    minFundingRate: new FormControl(0, [Validators.required]),
    maxFundingRate: new FormControl(0, [Validators.required]),
  });

  notifications: notification[] = [];

  constructor(
    private notificationService: NotificationService,
    private fundingRateService: FundingRateService
  ) {
    this.notifications = this.notificationService.notifications;
    this.fundingRateService.getAllSymbols().subscribe((symbols) => {
      this.symbolSuggestions = symbols.symbols.map((s) => s.symbol);
    });
  }

  ngOnInit(): void {
    this.fundingRateAtual();
    this.updateTime();
    this.clockSubscription = interval(1000).subscribe(() => {
      this.updateTime();
      this.podePegarFundingRateAtual();
    });
  }

  updateTime(): void {
    if (this.ultimaAtualizacao === null) {
      return;
    }

    const diferencaTempoAtualizacao =
      new Date().getTime() - this.ultimaAtualizacao.getTime();
    const diferencaTempoAtualizacaoSegundos = diferencaTempoAtualizacao / 1000;

    const tempoRestante =
      this.diferencaTempoAtualizacaoSegundos -
      diferencaTempoAtualizacaoSegundos;

    if (tempoRestante <= 0) {
      this.proximaAtualizacao = 'Atualizando...';
    } else {
      this.proximaAtualizacao = `Próxima atualização em ${tempoRestante.toFixed(
        0
      )} segundos`;
    }
  }

  search(event: AutoCompleteCompleteEvent) {
    this.suggestions = this.symbolSuggestions.filter((symbol) =>
      symbol.toLowerCase().includes(event.query.toLowerCase())
    );
  }

  showDialog() {
    this.isEditing = false;
    this.currentEditId = 0;
    this.cardDialog = true;
    this.formGroup.reset();
  }

  showDialogForEdit(id: number) {
    const notification = this.notifications.find((n) => n.id === id);
    this.currentEditId = id;

    if (!notification) {
      return;
    }

    this.formGroup.setValue({
      symbol: notification.symbol,
      minFundingRate: notification.minFundingRate,
      maxFundingRate: notification.maxFundingRate,
    });

    this.cardDialog = true;
    this.isEditing = true;
  }

  closeDialog() {
    this.currentEditId = 0;
    this.cardDialog = false;
    this.isEditing = false;
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }

    if (this.isEditing) {
      const n = this.notifications.find((n) => n.id === this.currentEditId);
      if (!n) {
        return;
      }
      this.notifications = this.notificationService.editNotification({
        ...n,
        id: this.currentEditId,
        symbol: this.formGroup.value.symbol!,
        minFundingRate: this.formGroup.value.minFundingRate!,
        maxFundingRate: this.formGroup.value.maxFundingRate!,
      });
    } else {
      this.notifications = this.notificationService.addNotification({
        id: this.notifications.length + 1,
        symbol: this.formGroup.value.symbol!,
        minFundingRate: this.formGroup.value.minFundingRate!,
        maxFundingRate: this.formGroup.value.maxFundingRate!,
        fundingRate: null,
        fundingRateLastUpdate: null,
        fundingRateStatus: null,
        bateu: false,
        interestRate: null,
      });
    }
    this.closeDialog();
  }

  excluirNotificacao() {
    this.notifications = this.notificationService.deleteNotification(
      this.currentEditId
    );
    this.closeDialog();
  }

  async fundingRateAtual() {
    this.ultimaAtualizacao = new Date();
    const uniqueSymbols = Array.from(
      new Set(this.notifications.map((notification) => notification.symbol))
    );

    for await (const symbol of uniqueSymbols) {
      this.fundingRateService
        .getFundingRate(symbol)
        .subscribe((fundingRate) => {
          this.notifications.forEach((notification) => {
            if (notification.symbol === symbol) {
              const newFundingRate = Number(fundingRate.lastFundingRate);
              notification.fundingRateStatus =
                notification.fundingRate === null
                  ? 'neutral'
                  : notification.fundingRate < newFundingRate
                  ? 'positive'
                  : notification.fundingRate > newFundingRate
                  ? 'positive'
                  : 'neutral';
              notification.fundingRate = newFundingRate;
              notification.interestRate = Number(fundingRate.interestRate);
              notification.fundingRateLastUpdate = new Date();
              this.notifications = this.notifications.map((n) => {
                return n.id === notification.id ? notification : n;
              });

              if (
                notification.fundingRate >= notification.minFundingRate &&
                notification.fundingRate <= notification.maxFundingRate
              ) {
                notification.bateu = true;
                this.playNotificationSound();
              } else {
                notification.bateu = false;
              }

              this.notificationService.editNotification(notification);
            }
          });
        });
    }
  }

  podePegarFundingRateAtual(): boolean | null {
    if (this.ultimaAtualizacao === null) {
      return null;
    }
    const diferencaTempoAtualizacao =
      new Date().getTime() - this.ultimaAtualizacao.getTime();
    const diferencaTempoAtualizacaoSegundos = diferencaTempoAtualizacao / 1000;
    if (
      diferencaTempoAtualizacaoSegundos >=
      this.diferencaTempoAtualizacaoSegundos
    ) {
      this.fundingRateAtual();
      return true;
    } else {
      return null;
    }
  }

  ngOnDestroy(): void {
    this.clockSubscription?.unsubscribe();
  }

  playNotificationSound(): void {
    this.notificationSound
      .play()
      .catch((error) => console.log('Erro ao reproduzir som:', error));
  }
}
