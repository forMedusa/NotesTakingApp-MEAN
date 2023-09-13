import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ApiServiceService } from '../api-service.service';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(private service:ApiServiceService,
    private cookies:CookieService) {}
  ngOnInit(): void {
    this.getNotes()
  }
  @ViewChild('addNotesModal') addNotesModal!: ElementRef;
  @ViewChild('updateNotesModal') updateNotesModal!: ElementRef;
  @ViewChild('deleteNotesModal') deleteNotesModal!: ElementRef;

  notes={
    username: '',
    title:'',
    body:''
  }

  editNotes={
    _id:'',
    title:'',
    body:''
  }
  updatedNotes={
    _id:'',
    title:'',
    body:''
  };
  
  tempNotes={
    title:'',
    body:''
  }
  notesData:any;
  
  postNoteAdd(){
    if(this.notes.title.length >= 8 && this.notes.body.length >= 20){
    return true;
  }
  return false;
  }

  updateNoteAdd(){
    if(this.editNotes.title == this.updatedNotes.title && this.editNotes.body == this.updatedNotes.body){
      return false;
    }
    return true;
  }

  postNote(){
    console.log(this.notes)
    this.service.postNotes(this.notes).subscribe(res => {
      console.log("Result", res)
      this.getNotes()
      this.addNotesModal.nativeElement.click();
    })
  }

  getNotes(){
    this.notes.username = this.cookies.get('username');
    console.log(this.notes.username)
    this.service.getUserPosts(this.notes.username).subscribe(res => {
      //console.log(res)
      this.notesData = res.noteData
      //console.log(this.notesData)
    })
  }

  getEditData(id:string,title:string,body:string,index:number){
   //console.log(this.notesData[index])
   this.updatedNotes.title = this.notesData[index].title;
   this.updatedNotes.body = this.notesData[index].body;
   this.updatedNotes._id = this.notesData[index]._id;
    this.editNotes._id = id;
    this.editNotes.title = title;
    this.editNotes.body = body;
    console.log(this.editNotes)
    console.log(this.updatedNotes)
  }

  updateNotes(){
    this.service.updateNote(this.editNotes).subscribe(res => {
      console.log("Result",res)
      alert("Note Updated Successfully");
      this.getNotes()
      this.updateNotesModal.nativeElement.click();
    }) 
   }

   deleteNote(){
    this.service.deleteNote(this.editNotes._id).subscribe(res => {
      console.log('Result', res)
      alert("Note Delete Successfully");
      this.getNotes()
      this.deleteNotesModal.nativeElement.click();
    })
   }
}
