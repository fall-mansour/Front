import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Objet } from '../ajout-ventes/pubobjets/objet';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
;


@Component({
  
  selector: 'app-publication',
  imports: [],
  templateUrl: './publication.component.html',
  styleUrl: './publication.component.scss'

})
export class PublicationComponent {

  constructor(private router:Router){}

  goaide(){
    this.router.navigate(['/pubaides'])}
  

  govente(){
    this.router.navigate(['/pubventes'])}

    goacceuil(){
    this.router.navigate(['/'])}
  
  }

  




 


  



