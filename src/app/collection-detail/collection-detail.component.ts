import { Component, OnInit, Input, Output } from '@angular/core';
import { Collection } from '../entities/collection';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CollectionService } from '../collection.service';
import { Cover } from '../entities/cover';
import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-collection-detail',
  templateUrl: './collection-detail.component.html',
  styleUrls: ['./collection-detail.component.css']
})
export class CollectionDetailComponent implements OnInit {

  @Input() collection: Collection;

  @Output() coverChanged: EventEmitter;

  constructor(private route: ActivatedRoute,
    private collectionService: CollectionService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getCollection();
  }

  getCollection(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.collectionService.getCollection(id).subscribe(collection => this.collection = collection);

    this.coverChanged.emit(this.collection.cover);
  }

}
