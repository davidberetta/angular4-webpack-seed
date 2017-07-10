import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    welcome: string;

    constructor() {
    }

    ngOnInit(): void {
        this.welcome = "Hello World!";
    }

};