import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-global-loader',
  templateUrl: './global-loader.component.html',
  styleUrls: ['./global-loader.component.scss'],
})
export class GlobalLoaderComponent implements OnInit {

  loading$!: Observable<boolean>;

  constructor(private loader: LoaderService) {}

  ngOnInit(): void {
    this.loading$ = this.loader.loading$;
  }
}
