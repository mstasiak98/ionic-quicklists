import {Component, OnInit} from '@angular/core';
import {ChecklistService} from "./shared/data-access/checklist.service";
import {ChecklistItemService} from "./checklist/data-access/checklist-item.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private checklistService: ChecklistService,
    private checklistItemService: ChecklistItemService
  ) {}

  ngOnInit() {
    this.checklistService.load();
    this.checklistItemService.load();
  }

}
