import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import { AppComponent } from './app.component';
import {ChecklistService} from "./shared/data-access/checklist.service";
import {ChecklistItemService} from "./checklist/data-access/checklist-item.service";
import {StorageService} from "./shared/data-access/storage.service";

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  // Mock services
  const checklistServiceMock: Partial<ChecklistService> = {
    load: jasmine.createSpy('load'),
  };

  const checklistItemServiceMock: Partial<ChecklistItemService> = {
    load: jasmine.createSpy('load'),
  };

  const storageServiceMock: Partial<StorageService> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: ChecklistService, useValue: checklistServiceMock },
        { provide: ChecklistItemService, useValue: checklistItemServiceMock },
        { provide: StorageService, useValue: storageServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should call load method for checklist service', () => {
    expect(checklistServiceMock.load).toHaveBeenCalled();
  })

  it('should call load method for checklist item service', () => {
    expect(checklistItemServiceMock.load).toHaveBeenCalled();
  })

});
