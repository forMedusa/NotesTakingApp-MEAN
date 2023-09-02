import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private http: HttpClient) { }

  postuserUrl = 'http://localhost:4000/users';

  postnotesUrl = 'http://localhost:4000/notes';

  getUserPostsUrl = 'http://localhost:4000/users/';

  putNoteUrl = 'http://localhost:4000/notes/';

  postUsers(data:any):Observable<any> {
    console.log(data);
    return this.http.post(this.postuserUrl,data);
  }

  postNotes(data:any):Observable<any> {
    console.log(data);
    return this.http.post(this.postnotesUrl,data);
  }

  getUserPosts(name:any):Observable<any> {
    return this.http.get(this.getUserPostsUrl+name)
  }

  updateNote(data:any):Observable<any>{
    return this.http.put(this.putNoteUrl+data._id,data)
  }

  deleteNote(id:any):Observable<any>{
    return this.http.delete(this.putNoteUrl+id);
  }
}
