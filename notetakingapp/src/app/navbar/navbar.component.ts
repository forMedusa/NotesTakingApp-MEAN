import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiServiceService } from '../api-service.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit  {
  constructor(private service: ApiServiceService,
    private cookies: CookieService,
    private router: Router) {}
  ngOnInit(){
    this.islogIn()
  }
  @ViewChild('signupModal') signupModal!: ElementRef;
  @ViewChild('loginModal') loginModal!: ElementRef;
  @ViewChild('password') passwordInput:any;
  users = new FormGroup({
    username: new FormControl("",[
      Validators.pattern("^[a-zA-Z0-9_-]+$"),
      Validators.required
    ]),
    password: new FormControl("", [
      Validators.minLength(8),
      Validators.pattern("^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?!.*\s).{8,}$"),
      Validators.required,
    ])
  });
  user={
    username: '',
    email: '',
    password: ''
  }
  cpass:any

  isloggedIn:any;
  usernameBlurred=false;
  passwordBlurred=false;
  confirmpass=false;
  validateUsername() {
    this.usernameBlurred = true;
  }
  validatePass(){
      this.passwordBlurred = true;
  }
  validatefields(){
    if(this.user.password == this.cpass && this.user.username.length >= 5){
      return this.usernameBlurred && this.passwordBlurred;
    }
    return false;
  }

  validateFieldsLogin(){
    const strongPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?!.*\s).{8,}$/;
    if(strongPasswordRegex.test(this.user.password) && this.user.username.length >= 5){
    return this.usernameBlurred && this.passwordBlurred;
    }
  return false;
  }

  signup(){
    if(this.user.password == this.cpass){
    this.service.postUsers(this.user).subscribe(res => {
      console.log('Result', res);
      console.log(res._message)
      if(res._message == "User validation failed"){
        alert("Ivalid details")
      } else {
    console.log('Result', res);
    console.log(this.user.username)
    this.cookies.set('loggedin', 'true');
    this.cookies.set('username', this.user.username);
    const cookieloginValue = this.cookies.get('loggedin');
    this.isloggedIn = cookieloginValue === 'true'
    this.signupModal.nativeElement.click();
    this.router.navigateByUrl('/dashboard');
      }
  })
  }
  else{
    alert("Password and Confirm Password doesn't match.")
  }
  }

  login(){
    //console.log("chala")
    this.service.getUserPosts(this.user.username).subscribe(res => {
      if(res.message == "User Details Fetched!"){
      if(res.userData.password == this.user.password){
        console.log("result", res);
        this.cookies.set('loggedin', 'true');
        this.cookies.set('username', this.user.username);
        const cookieloginValue = this.cookies.get('loggedin');
        this.isloggedIn = cookieloginValue === 'true'
        this.loginModal.nativeElement.click();
        this.router.navigateByUrl('/dashboard');
      }else{
        alert("Wrong Password");
      }
    }
      else if(res.message == "User not found!"){
        alert("User not found!");
      }
    })
  }

  logout(){
    this.cookies.delete('loggedin');
    this.cookies.delete('username');
    this.isloggedIn = false;
    this.user.email = '';
    this.user.password = '';
    this.user.username = '';
    this.router.navigateByUrl('/');
  }

  islogIn(){
    const cookieloginValue = this.cookies.get('loggedin');
    this.isloggedIn = cookieloginValue === 'true'
  }
}
