import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { UserParams } from 'src/app/_models/userParams';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[];
  pagination: Pagination;
  pageNumbers: number[];
  userParams: UserParams = this.membersService.userParams;
  genderList = [{ value: null, display: 'Not Selected' }, { value: 'male', display: 'Males' }, { value: 'female', display: 'Females' }];
  
  constructor(private membersService: MembersService) { }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.membersService.getMembers(this.userParams).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
      this.setPageNumbers();
    })
  }

  setPageNumbers() {
    this.pageNumbers = [];
    for (let i = 1; i <= this.pagination.totalPages; i++) {
      this.pageNumbers.push(i);
    }
  }

  pageChanged(pageNumber: number) {
    this.userParams.pageNumber = pageNumber;
    this.loadMembers();
  }

  applyFilters() {
    this.userParams.pageNumber = 1;
    this.loadMembers();
  }

  resetFilters() {
    this.userParams = this.membersService.resetUserParams();
    this.loadMembers();
  }
}