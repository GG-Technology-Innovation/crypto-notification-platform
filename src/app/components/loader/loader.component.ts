import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Subject } from 'rxjs';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [ProgressSpinnerModule, AsyncPipe],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
})
export class LoaderComponent {
  $isLoading: Subject<boolean> = new Subject<boolean>();

  constructor(private loadingService: LoadingService) {
    this.$isLoading = this.loadingService.isLoading;
  }
}
