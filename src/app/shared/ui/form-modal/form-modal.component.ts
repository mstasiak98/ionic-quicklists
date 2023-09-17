import {ChangeDetectionStrategy, Component, EventEmitter, Input, NgModule, OnInit, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IonicModule, ModalController} from "@ionic/angular";

@Component({
  selector: 'app-form-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">
            <ion-icon name="close" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <form [formGroup]="formGroup" (ngSubmit)="handleSave()">
        <ion-item *ngFor="let control of formGroup.controls | keyvalue">
          <ion-label position="stacked">{{ control.key }}</ion-label>
          <ion-input type="text" [formControlName]="control.key"></ion-input>
        </ion-item>
        <ion-button color="dark" expand="full" type="submit" [disabled]="formGroup.invalid">
          <ion-icon slot="start" name="save-outline"></ion-icon> Save
        </ion-button>
      </form>
    </ion-content>
  `,
  styles: [`
    :host {
      height: 100%
    }
    ion-label {
      font-weight: bold;
      color: white !important;
    }
    form {
      padding: 1rem;
    }
    ion-input {
      background: var(--ion-color-light);
      --padding-start: 1rem !important;
      --padding-top: 1rem !important;
      --padding-bottom: 1rem !important;
      --padding-end: 1rem !important;
      color: red;
    }
    ion-button {
      margin-top: 1rem;
      width: 100%;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormModalComponent {
  @Input() title!: string;
  @Input() formGroup!: FormGroup;

  @Output() save = new EventEmitter<boolean>();


  constructor(private modalCtrl: ModalController) { }

  handleSave(): void {
    this.save.emit(true);
    this.dismiss();
  }

  dismiss(): void {
    this.formGroup.reset();
    this.modalCtrl.dismiss();
  }


}

@NgModule({
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule],
  declarations: [FormModalComponent],
  exports: [FormModalComponent]
})
export class FormModalComponentModule {}
