import { Component, OnInit } from '@angular/core';
import { Environment } from 'src/app/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  environment: Environment;

  constructor() {
    this.environment = new Environment();
  }

  ngOnInit(): void {
  }

}
