import { Component, OnInit } from '@angular/core';
import { Collection } from '../entities/collection';
import { CollectionService } from '../collection.service';
import { Cover } from '../entities/cover';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit {

  selectedCollection: Collection;
  selectedCover: Cover;

  collection: Collection;

  collections: Collection[];

  constructor(private collectionService: CollectionService) { }

  onSelect(collection: Collection): void {
    this.selectedCollection = collection;
  }

  getCollections(): void {
    this.collectionService.getCollections().subscribe(
      collections => {
        this.collections = collections;
        console.log('Collection received: ' + JSON.stringify(this.collection));
      },
      error => console.log(error)
    );
  }

  onCoverSelect(data: string): void {
    // load it from the service
  }

  ngOnInit() {
    this.getCollections();
  }

}
