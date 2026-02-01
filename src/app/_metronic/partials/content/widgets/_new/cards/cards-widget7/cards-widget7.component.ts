import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cards-widget7',
  templateUrl: './cards-widget7.component.html',
  styleUrls: ['./cards-widget7.component.scss'],
})
export class CardsWidget7Component implements OnInit {
  @Input() cssClass: string = '';
  @Input() stats: number = 0;
  @Input() description: string = '';

  constructor() {}

  ngOnInit(): void {
  }
}
