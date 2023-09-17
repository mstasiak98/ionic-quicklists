import { Injectable } from '@angular/core';
import {BehaviorSubject, filter, map, Observable, shareReplay, take, tap} from "rxjs";
import {AddChecklist, Checklist} from "../models/checklist";
import {StorageService} from "./storage.service";
import {ChecklistItemService} from "../../checklist/data-access/checklist-item.service";

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {
  private checklists$ = new BehaviorSubject<Checklist[]>([]);

  private sharedChecklists$: Observable<Checklist[]> = this.checklists$.pipe(
    tap((checklists) => this.storageService.saveChecklists(checklists)),
    shareReplay(1)
  );

  constructor(private storageService: StorageService, private checklistItemService: ChecklistItemService) { }


  load() {
    this.storageService.loadChecklists$
      .pipe(take(1))
      .subscribe((checklists) => {
        this.checklists$.next(checklists);
    });
  }

  getChecklists() {
    return this.sharedChecklists$;
  }

  add(checklist: Pick<Checklist, 'title'>) {
    const newChecklist = {
      ...checklist,
      id: this.generateSlug(checklist.title)
    }

    this.checklists$.next([...this.checklists$.value, newChecklist]);
  }

  update(id: string, editedData: AddChecklist) {
    const modifiedChecklists = this.checklists$.value.map((checklist) =>
      checklist.id === id
        ? { ...checklist, title: editedData.title }
        : checklist
    );

    this.checklists$.next(modifiedChecklists);
  }

  remove(id: string) {
    const modifiedChecklists = this.checklists$.value.filter((checklist) =>
      checklist.id !== id
    );

    this.checklistItemService.removeAllItemsForChecklist(id);
    this.checklists$.next(modifiedChecklists);
  }

  getChecklistById(id: string) {
    return this.checklists$.pipe(
      filter((checklists) => checklists.length > 0), //dont'emit if not loaded yet
      map((checklists) => checklists.find((checklist) => checklist.id === id))
    );
  }

  private generateSlug(title: string) {

    let slug = title.toLowerCase().replace(/s+/g, '-');

    // Check for matching slug
    const matchingSlugs = this.checklists$.value.find((checklist) => checklist.id === slug);

    if(matchingSlugs) {
      slug = slug + Date.now().toString();
    }

    return slug;
  }
}
