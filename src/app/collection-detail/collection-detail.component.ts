import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Collection } from '../entities/collection';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CollectionService } from '../collection.service';
import { Cover } from '../entities/cover';
import { CoverService } from '../cover.service';

@Component({
  selector: 'app-collection-detail',
  templateUrl: './collection-detail.component.html',
  styleUrls: ['./collection-detail.component.css']
})
export class CollectionDetailComponent implements OnInit {

  @Input()
  collection: Collection;

  @Output()
  coverChanged: EventEmitter<number>;

  constructor(private route: ActivatedRoute,
    private collectionService: CollectionService,
    private location: Location,
    private coverService: CoverService,
  ) { }

  ngOnInit() {
    this.getCollection();
  }

  getCollection(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.collectionService.getCollection(id).subscribe(collection => this.collection = collection);
  }

  changeCover(): void {
    this.coverChanged.emit(this.collection.cover);
  }

}
