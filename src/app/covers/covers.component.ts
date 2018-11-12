import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoverService } from '../cover.service';
import { Cover } from '../entities/cover';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-covers',
  templateUrl: './covers.component.html',
  styleUrls: ['./covers.component.css']
})
export class CoversComponent implements OnInit {

  fileToUpload: File = null;
  showUpload = false;

  constructor(
    private coverService: CoverService,
    private sanitizer: DomSanitizer
  ) { }

  selectedCover: Cover;

  cover: Cover = null;

  covers: Cover[];

  onSelect(cover: Cover): void {
    this.selectedCover = cover;
  }

  getCovers(): void {
    this.coverService.getCovers().subscribe(
      covers => {
        this.covers = covers;
      },
      error => console.log(error)
    );
  }

  getBackground(id) {
    return this.sanitizer.bypassSecurityTrustStyle(`url('http://localhost:3000/cover/${id}')`);
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.uploadFileToActivity();
  }

  uploadFileToActivity() {
    this.coverService.postFile(this.fileToUpload).subscribe(data => {
      this.getCovers();
    }, error => {
      console.log(error);
    });
  }

  ngOnInit() {
    this.getCovers();
  }

}
