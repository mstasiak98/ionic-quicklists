import {ChangeDetectionStrategy, Component, EventEmitter, NgModule, OnInit, Output, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {IonContent, IonicModule, IonRouterOutlet} from "@ionic/angular";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {ChecklistService} from "../shared/data-access/checklist.service";
import {BehaviorSubject, combineLatest, filter, map, switchMap, tap} from "rxjs";
import {FormBuilder, Validators} from "@angular/forms";
import {FormModalComponentModule} from "../shared/ui/form-modal/form-modal.component";
import {ChecklistItemService} from "./data-access/checklist-item.service";
import {Checklist} from "../shared/models/checklist";
import {ChecklistItemListComponentModule} from "./ui/checklist-item-list/checklist-item-list";
import {ChecklistItem} from "../shared/models/checklist-item";

@Component({
  selector: 'app-checklist',
  template: `
    <ng-container
      *ngIf="vm$ | async as vm"
    >
      <ion-header class="ion-no-border">
        <ion-toolbar color="success">
          <ion-buttons slot="start">
            <ion-back-button color="light" defaultHref="/"></ion-back-button>
          </ion-buttons>
          <ion-title >
            {{ vm.checklist.title }}
          </ion-title>
          <ion-buttons slot="end">
            <ion-button (click)="resetChecklistItems(vm.checklist.id)">
              <ion-icon name="refresh" slot="icon-only"></ion-icon>
            </ion-button>
            <ion-button (click)="formModalIsOpen$.next(true)">
              <ion-icon name="add" slot="icon-only"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <app-checklist-item-list
          [checklistItems]="vm.items"
          (toggle)="toggleChecklistItem($event)"
          (delete)="deleteChecklistItem($event)"
          (edit)="openEditModal($event)"
        ></app-checklist-item-list>
        <ion-modal
          [isOpen]="vm.formModalIsOpen"
          [canDismiss]="true"
          [presentingElement]="routerOutlet.nativeEl"
          (ionModalDidDismiss)="formModalIsOpen$.next(false); checklistItemIdBeingEdited$.next(null)"
        >
            <ng-template>
              <app-form-modal
                [title]="vm.checklistItemIdBeingEdited ? 'Edit item' : 'Create item'"
                [formGroup]="checklistItemForm"
                (save)="
                    vm.checklistItemIdBeingEdited
                    ? editChecklistItem(vm.checklistItemIdBeingEdited)
                    : addChecklistItem(vm.checklist.id)
                "
              ></app-form-modal>
            </ng-template>
        </ion-modal>
      </ion-content>
    </ng-container>
  `,
  styles: [
    `
      ion-header {
        background-color: var(--ion-color-primary);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChecklistComponent  implements OnInit {
  @ViewChild(IonContent) ionContent!: IonContent;

  checklistAndItems$ = this.route.paramMap.pipe(
    switchMap((params) =>
      combineLatest([
        this.checklistService.getChecklistById(params.get('id') as string)
          .pipe(filter((checklist): checklist is Checklist => !!checklist)),
        this.checklistItemService.getItemsByChecklistId(
          params.get('id') as string
        ).pipe(
            tap(() => {
              setTimeout(() => this.ionContent.scrollToBottom(200), 0)
            })
          )
      ])
    )
  );
  formModalIsOpen$ = new BehaviorSubject<boolean>(false);
  checklistItemIdBeingEdited$ = new BehaviorSubject<string | null>(null);

  vm$ = combineLatest([
    this.checklistAndItems$, this.formModalIsOpen$, this.checklistItemIdBeingEdited$
  ]).pipe(
    map(([[checklist, items], formModalIsOpen, checklistItemIdBeingEdited]) => ({
      checklist,
      items,
      formModalIsOpen,
      checklistItemIdBeingEdited
    }))
  );

  checklistItemForm = this.fb.nonNullable.group({
    title: ['', Validators.required]
  })

  constructor(
    private route: ActivatedRoute,
    private checklistService: ChecklistService,
    private checklistItemService: ChecklistItemService,
    private fb: FormBuilder,
    public routerOutlet: IonRouterOutlet
  ) { }

  ngOnInit() {}

  openEditModal(checklistItem: ChecklistItem) {
    this.checklistItemForm.patchValue({
      title: checklistItem.title,
    });
    this.checklistItemIdBeingEdited$.next(checklistItem.id);
    this.formModalIsOpen$.next(true);
  }

  addChecklistItem(checklistId: string) {
    this.checklistItemService.add(
      this.checklistItemForm.getRawValue(),
      checklistId
    );
  }

  editChecklistItem(checklistItemId: string) {
    this.checklistItemService.update(
      checklistItemId,
      this.checklistItemForm.getRawValue()
    )
  }

  deleteChecklistItem(checklistId: string) {
    this.checklistItemService.remove(checklistId);
  }

  toggleChecklistItem(itemId: string) {
    this.checklistItemService.toggle(itemId);
  }

  resetChecklistItems(checklistId: string) {
    this.checklistItemService.reset(checklistId);
  }
}

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ChecklistComponent
      }
    ]),
    FormModalComponentModule,
    ChecklistItemListComponentModule,
  ],
  declarations: [ChecklistComponent]
})
export class ChecklistComponentModule {}
