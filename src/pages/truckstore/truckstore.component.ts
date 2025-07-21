import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-truckstore',
  templateUrl: './truckstore.component.html',
  styleUrls: ['./truckstore.component.css']
})
export class TruckStoreComponent implements OnInit {

  constructor(private translationService: TranslationService) { }

  ngOnInit(): void {
  }

}
