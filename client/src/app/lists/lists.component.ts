import { Component, OnInit } from '@angular/core';
import { LikesService } from '../_services/likes.service';
import { Member } from '../_models/member';
import { Pagination } from '../_models/pagination';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  members: Member[];
  predicate: string = 'liked';
  pageNumber = 1;
  pageSize = 5;
  pagination: Pagination;
  pageNumbers: number[];

  constructor(private likesService: LikesService) {

  }
  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.likesService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
      this.setPageNumbers();
    });
  };

  pageChanged(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.loadLikes();
  }

  setPageNumbers() {
    this.pageNumbers = [];
    for (let i = 1; i <= this.pagination.totalPages; i++) {
      this.pageNumbers.push(i);
    }
  }
}
