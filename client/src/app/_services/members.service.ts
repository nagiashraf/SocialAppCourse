import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { map, of } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { getPaginatedResult, setPaginationQueryStringParams } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  userParams: UserParams = new UserParams();

  constructor(private http: HttpClient) { }

  resetUserParams() {
    this.userParams = new UserParams();
    return this.userParams;
  }

  getMembers(userParams: UserParams) {
    let response = this.memberCache.get(Object.values(userParams).join('-'));
    if (response) {
      return of(response);
    }

    let params = setPaginationQueryStringParams(userParams.pageNumber, userParams.pageSize);
    params = params.set('minAge', userParams.minAge);
    params = params.set('maxAge', userParams.maxAge);
    if (userParams.gender) {
      params = params.set('gender', userParams.gender);
    }
    params = params.set('orderBy', userParams.orderBy);

    return getPaginatedResult<Member[]>(this.baseUrl + 'users', params, this.http)
      .pipe(map(paginatedResult => {
        this.memberCache.set(Object.values(userParams).join('-'), paginatedResult);
        return paginatedResult;
      }));
  }

  getMember(username: string) {
    const member =  [...this.memberCache.values()]
      .flatMap((paginatedResult: PaginatedResult<Member[]>) => paginatedResult.result)
      .find((member: Member) => member.username === username);
    if (member) {
      return of (member);
    }
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(memberToUpdate: Member) {
    return this.http.put(this.baseUrl + 'users', memberToUpdate).pipe(
      map(() => {
        const indexOfMemberToUpdate = this.members.indexOf(memberToUpdate);
        this.members[indexOfMemberToUpdate] = memberToUpdate;
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {} );
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId );
  }
}