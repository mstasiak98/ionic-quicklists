import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {CommonModule} from "@angular/common";
import {IonicModule, IonList} from "@ionic/angular";
import {ChecklistItem} from "../../../shared/models/checklist-item";

@Component({
  selector: 'app-checklist-item-list',
  template: `
    <ion-list lines="none">
      <ion-item-sliding
        *ngFor="let item of checklistItems; trackBy: trackByFn"
      >
        <ion-item color="success">
          <ion-checkbox (ionChange)="toggleItem(item.id)" slot="end" [checked]="item.checked">{{item.title}}</ion-checkbox>
        </ion-item>
        <ion-item-options>
          <ion-item-option color="light" (click)="edit.emit(item); closeItems()">
            <ion-icon name="pencil-outline" slot="icon-only"></ion-icon>
          </ion-item-option>
          <ion-item-option color="danger" (click)="delete.emit(item.id)">
            <ion-icon name="trash" slot="icon-only"></ion-icon>
          </ion-item-option>
        </ion-item-options>
      </ion-item-sliding>
      <ion-card *ngIf="checklistItems.length === 0">
        <ion-card-header>
          <h2>Add an item</h2>
        </ion-card-header>
        <ion-card-content>
          <p>Click the add button to add your first item to this quicklist</p>
        </ion-card-content>
      </ion-card>
    </ion-list>
  `,
  styles: [
    `
      ion-checkbox {
        width: 100%;
      }

      ion-label {
        font-weight: bold;
        margin: 20px;
        white-space: normal;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChecklistItemListComponent implements OnInit{
  @ViewChild(IonList) checklistItemList!: IonList;

  @Input() checklistItems!: ChecklistItem[];
  @Output() toggle = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<ChecklistItem>()

  trackByFn(index: number, item: ChecklistItem) {
    return item.id;
  }

  toggleItem(itemId: string) {
    this.toggle.emit(itemId);
  }

  ngOnInit() { }

  async closeItems() {
    await this.checklistItemList.closeSlidingItems();
  }

}


@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [ChecklistItemListComponent],
  exports: [ChecklistItemListComponent]
})
export class ChecklistItemListComponentModule {}
