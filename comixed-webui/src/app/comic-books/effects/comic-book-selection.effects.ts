/*
 * ComiXed - A digital comic book library management application.
 * Copyright (C) 2023, The ComiXed Project
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses>
 */

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  addSingleComicBookSelection,
  clearComicBookSelectionState,
  clearComicBookSelectionStateFailed,
  comicBookSelectionsLoaded,
  comicBookSelectionStateCleared,
  loadComicBookSelections,
  loadComicBookSelectionsFailed,
  removeSingleComicBookSelection,
  setMultipleComicBookByFilterSelectionState,
  setMultipleComicBookByIdSelectionState,
  setMultipleComicBooksByTagTypeAndValueSelectionState,
  setMultipleComicBookSelectionStateFailure,
  setMultipleComicBookSelectionStateSuccess,
  singleComicBookSelectionFailed,
  singleComicBookSelectionUpdated
} from '../actions/comic-book-selection.actions';
import { LoggerService } from '@angular-ru/cdk/logger';
import { ComicBookSelectionService } from '@app/comic-books/services/comic-book-selection.service';
import { AlertService } from '@app/core/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

@Injectable()
export class ComicBookSelectionEffects {
  loadSelections$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadComicBookSelections),
      tap(() => this.logger.debug('Loading comic book selectsion')),
      switchMap(() =>
        this.comicBookSelectionService.loadSelections().pipe(
          tap(response => this.logger.debug('Response received:', response)),
          map((response: number[]) =>
            comicBookSelectionsLoaded({ ids: response })
          ),
          catchError(error => {
            this.logger.error('Service failure:', error);
            this.alertService.error(
              this.translateService.instant(
                'selection.load-selections.effect-failure'
              )
            );
            return of(loadComicBookSelectionsFailed());
          })
        )
      ),
      catchError(error => {
        this.logger.error('General failure:', error);
        this.alertService.error(
          this.translateService.instant('app.general-effect-failure')
        );
        return of(loadComicBookSelectionsFailed());
      })
    );
  });

  addSingleSelection$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addSingleComicBookSelection),
      tap(action => this.logger.debug('Adding a single comic book:', action)),
      switchMap(action =>
        this.comicBookSelectionService
          .addSingleSelection({
            comicBookId: action.comicBookId
          })
          .pipe(
            tap(response => this.logger.debug('Response received:', response)),
            map(() => singleComicBookSelectionUpdated()),
            catchError(error => {
              this.logger.error('Service failure:', error);
              this.alertService.error(
                this.translateService.instant(
                  'selection.set-single-state.effect-failure'
                )
              );
              return of(singleComicBookSelectionFailed());
            })
          )
      ),
      catchError(error => {
        this.logger.error('General failure:', error);
        this.alertService.error(
          this.translateService.instant('app.general-effect-failure')
        );
        return of(singleComicBookSelectionFailed());
      })
    );
  });

  removeSingleSelection$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(removeSingleComicBookSelection),
      tap(action => this.logger.debug('Removing a single comic book:', action)),
      switchMap(action =>
        this.comicBookSelectionService
          .removeSingleSelection({
            comicBookId: action.comicBookId
          })
          .pipe(
            tap(response => this.logger.debug('Response received:', response)),
            map(() => singleComicBookSelectionUpdated()),
            catchError(error => {
              this.logger.error('Service failure:', error);
              this.alertService.error(
                this.translateService.instant(
                  'selection.set-single-state.effect-failure'
                )
              );
              return of(singleComicBookSelectionFailed());
            })
          )
      ),
      catchError(error => {
        this.logger.error('General failure:', error);
        this.alertService.error(
          this.translateService.instant('app.general-effect-failure')
        );
        return of(singleComicBookSelectionFailed());
      })
    );
  });

  setSelectedByFilter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(setMultipleComicBookByFilterSelectionState),
      tap(action =>
        this.logger.debug('Selecting multiple comic books by filter:', action)
      ),
      switchMap(action =>
        this.comicBookSelectionService
          .setSelectedByFilter({
            coverYear: action.coverYear,
            coverMonth: action.coverMonth,
            archiveType: action.archiveType,
            comicType: action.comicType,
            comicState: action.comicState,
            unscrapedState: action.unscrapedState,
            searchText: action.searchText,
            selected: action.selected
          })
          .pipe(
            tap(response => this.logger.debug('Response received:', response)),
            map(() => setMultipleComicBookSelectionStateSuccess()),
            catchError(error => this.doMultipleSelectedServiceFailure(error))
          )
      ),
      catchError(error => this.doMultipleSelectedGeneralFailure(error))
    );
  });

  setSelectedByTagTypeAndValue$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(setMultipleComicBooksByTagTypeAndValueSelectionState),
      tap(action =>
        this.logger.debug(
          'Selecting multiple comic books by tag type and value:',
          action
        )
      ),
      switchMap(action =>
        this.comicBookSelectionService
          .setSelectedByTagTypeAndValue({
            tagType: action.tagType,
            tagValue: action.tagValue,
            selected: action.selected
          })
          .pipe(
            tap(response => this.logger.debug('Response received:', response)),
            map(() => setMultipleComicBookSelectionStateSuccess()),
            catchError(error => this.doMultipleSelectedServiceFailure(error))
          )
      ),
      catchError(error => this.doMultipleSelectedGeneralFailure(error))
    );
  });

  setSelectedById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(setMultipleComicBookByIdSelectionState),
      tap(action =>
        this.logger.debug('Selecting multiple comic books by id:', action)
      ),
      switchMap(action =>
        this.comicBookSelectionService
          .setSelectedById({
            comicBookIds: action.comicBookIds,
            selected: action.selected
          })
          .pipe(
            tap(response => this.logger.debug('Response received:', response)),
            map(() => setMultipleComicBookSelectionStateSuccess()),
            catchError(error => this.doMultipleSelectedServiceFailure(error))
          )
      ),
      catchError(error => this.doMultipleSelectedGeneralFailure(error))
    );
  });

  clearSelections$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(clearComicBookSelectionState),
      tap(() => this.logger.debug('Clearing comic book selectsion')),
      switchMap(() =>
        this.comicBookSelectionService.clearSelections().pipe(
          tap(response => this.logger.debug('Response received:', response)),
          map(() => comicBookSelectionStateCleared()),
          catchError(error => {
            this.logger.error('Service failure:', error);
            this.alertService.error(
              this.translateService.instant(
                'selection.clear-selection-state.effect-failure'
              )
            );
            return of(clearComicBookSelectionStateFailed());
          })
        )
      ),
      catchError(error => {
        this.logger.error('General failure:', error);
        this.alertService.error(
          this.translateService.instant('app.general-effect-failure')
        );
        return of(clearComicBookSelectionStateFailed());
      })
    );
  });

  constructor(
    private logger: LoggerService,
    private actions$: Actions,
    private comicBookSelectionService: ComicBookSelectionService,
    private alertService: AlertService,
    private translateService: TranslateService
  ) {}

  private doMultipleSelectedServiceFailure(error: any) {
    this.logger.error('Service failure:', error);
    this.alertService.error(
      this.translateService.instant(
        'selection.set-multiple-state.effect-failure'
      )
    );
    return of(setMultipleComicBookSelectionStateFailure());
  }

  private doMultipleSelectedGeneralFailure(error: any) {
    this.logger.error('General failure:', error);
    this.alertService.error(
      this.translateService.instant('app.general-effect-failure')
    );
    return of(setMultipleComicBookSelectionStateFailure());
  }
}
