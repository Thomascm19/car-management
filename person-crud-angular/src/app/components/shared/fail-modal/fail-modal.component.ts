import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-fail-modal',
  templateUrl: './fail-modal.component.html',
  styleUrls: ['./fail-modal.component.css']
})
export class FailModalComponent implements OnInit {

  @Input() message: string | undefined;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
