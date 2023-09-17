import { TestBed } from '@angular/core/testing';
import { Storage } from "@ionic/storage-angular";
import { StorageService } from './storage.service';
import {Checklist} from "../models/checklist";
import {of} from "rxjs";

describe('StorageService', () => {
  let service: StorageService;
  let storage: Storage;

  const testLoadData: any = {};

  const setMock = jasmine.createSpy('set');
  const getMock = jasmine.createSpy('get').and.resolveTo(testLoadData);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Storage,
          useValue: {
            create: jasmine.createSpy('create').and.resolveTo({
              set: setMock,
              get: getMock,
            } as any),
          },
        },
        StorageService
      ],
      teardown: {
        destroyAfterEach: true
      }
    });

    service = TestBed.inject(StorageService);
    storage = TestBed.inject(Storage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadChecklists$', () => {
    it('should return result of get method of storage api', (done) => {
      service.loadChecklists$.subscribe((result) => {
        expect(getMock).toHaveBeenCalledWith('checklists' as any);
        expect(result).toEqual(testLoadData);
        done();
      })
    })
  })

  describe('saveChecklists()', () => {

    beforeEach(() => {
      service = TestBed.inject(StorageService);
      storage = TestBed.inject(Storage);
    });

    it('should pass data to set method of storage api', () => {
      const testData = {} as any;
      service.loadChecklists$.subscribe(() => {
        service.saveChecklists(testData);
        expect(setMock).toHaveBeenCalledWith('checklists' as any, testData);
      })
    })

    it('should NOT pass data if checklists have not been loaded yet', () => {
      const testData = {} as any;
      service.saveChecklists(testData);
      expect(setMock).not.toHaveBeenCalled();
    });
  })
});
