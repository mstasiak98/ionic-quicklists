import {ChangeDetectionStrategy, Component, NgModule, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {AlertController, IonContent, IonicModule, IonRouterOutlet} from "@ionic/angular";

import {RouterModule} from "@angular/router";
import {BehaviorSubject, tap} from "rxjs";
import {FormModalComponentModule} from "../shared/ui/form-modal/form-modal.component";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ChecklistService} from "../shared/data-access/checklist.service";
import {ChecklistListComponentModule} from "./ui/checklist-list/checklist-list.component";
import {Checklist} from "../shared/models/checklist";

@Component({
  selector: 'app-home',
  template: `
    <ion-header>
      <ion-toolbar color="success">
        <ion-title>
          <img src="assets/logo.svg" />
        </ion-title>
        <ion-buttons slot="end" (click)="formModalIsOpen$.next(true)">
          <ion-button>
            <ion-icon name="add" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content [fullscreen]="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title color="light" size="large">Your lists</ion-title>
        </ion-toolbar>
      </ion-header>
      <app-checklist-list
        *ngIf="checklists$ | async as checklists"
        [checklists]="checklists"
        (delete)="deleteChecklist($event)"
        (edit)="openEditModal($event)"
      >

      </app-checklist-list>
      <ion-modal
        *ngIf="{
            checklistIdBeingEdited: checklistIdBeingEdited$ | async,
            isOpen: formModalIsOpen$ | async
        } as vm"
        [isOpen]="formModalIsOpen$ | async"
        [canDismiss]="true"
        [presentingElement]="routerOutlet.nativeEl"
        (ionModalDidDismiss)="formModalIsOpen$.next(false); checklistIdBeingEdited$.next(null)"
      >
        <ng-template>
          <app-form-modal
            [title]="vm.checklistIdBeingEdited ? 'Edit Checklist' : 'Create checklist'"
            [formGroup]="checklistForm"
            (save)="
              vm.checklistIdBeingEdited
                ? editChecklist(vm.checklistIdBeingEdited)
                : addChecklist()
            "
          ></app-form-modal>
        </ng-template>
      </ion-modal>
    </ion-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

  @ViewChild(IonContent) ionContent!: IonContent;

  checklists$ = this.checklistService.getChecklists().pipe(
    tap(() => {
      setTimeout(() => {
        this.ionContent.scrollToBottom(200);
      }, 0);
    })
  );
  formModalIsOpen$ = new BehaviorSubject<boolean>(false);
  checklistIdBeingEdited$ = new BehaviorSubject<string | null>(null);

  checklistForm = this.fb.nonNullable.group({
    title: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private checklistService: ChecklistService,
    public routerOutlet: IonRouterOutlet,
    private alertCtrl: AlertController
  ) {}

  openEditModal(checklist: Checklist) {
    this.checklistForm.patchValue({
      title: checklist.title
    });
    this.checklistIdBeingEdited$.next(checklist.id);
    this.formModalIsOpen$.next(true);
  }

  addChecklist() {
    this.checklistService.add(this.checklistForm.getRawValue());
  }

  editChecklist(id: string) {
    this.checklistService.update(id, this.checklistForm.getRawValue());
  }

  async deleteChecklist(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure?',
      subHeader: 'This will also delete all of the items for this checklist',
      buttons: [
        {
          text: 'Delete',
          cssClass: 'confirm-delete-button',
          role: 'destructive',
          handler: () => {
            this.checklistService.remove(id);
          }
        },
        {
          text: 'Cancel',
          cssClass: 'cancel-delete-button',
          role: 'cancel'
        }
      ]
    });

    alert.present();
  }
}

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent
      }
    ]),
    FormModalComponentModule,
    ReactiveFormsModule,
    FormsModule,
    ChecklistListComponentModule
  ],
  declarations: [HomeComponent]
})
export class HomeComponentModule {}
