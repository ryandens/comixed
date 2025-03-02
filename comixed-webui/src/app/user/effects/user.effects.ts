/*
 * ComiXed - A digital comic book library management application.
 * Copyright (C) 2020, The ComiXed Project
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
import { LoggerService } from '@angular-ru/cdk/logger';
import {
  currentUserLoaded,
  loadCurrentUser,
  loadCurrentUserFailed,
  loginUser,
  loginUserFailed,
  logoutUser,
  saveCurrentUser,
  saveCurrentUserFailed,
  saveUserPreference,
  saveUserPreferenceFailed,
  userLoggedIn,
  userLoggedOut,
  userPreferenceSaved
} from '@app/user/actions/user.actions';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { UserService } from '@app/user/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { LoginResponse } from '@app/user/models/net/login-response';
import { AlertService } from '@app/core/services/alert.service';
import { TokenService } from '@app/core/services/token.service';
import { User } from '@app/user/models/user';

@Injectable()
export class UserEffects {
  loadCurrentUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadCurrentUser),
      tap(action => this.logger.debug('Effect: loading current user:', action)),
      switchMap(action =>
        this.userService.loadCurrentUser().pipe(
          tap(response => this.logger.debug('Received response:', response)),
          map((response: User) => currentUserLoaded({ user: response })),
          catchError(error => {
            this.logger.error('Service failure:', error);
            return of(loadCurrentUserFailed());
          })
        )
      ),
      catchError(error => {
        this.logger.error('General failure:', error);
        return of(loadCurrentUserFailed());
      })
    );
  });

  loginUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loginUser),
      tap(action => this.logger.debug('Effect: logging in user:', action)),
      switchMap(action =>
        this.userService
          .loginUser({ email: action.email, password: action.password })
          .pipe(
            tap(response => this.logger.debug('Received response:', response)),
            tap((response: LoginResponse) =>
              this.tokenService.setAuthToken(response.token)
            ),
            mergeMap((response: LoginResponse) => [
              userLoggedIn(),
              loadCurrentUser()
            ]),
            catchError(error => {
              this.logger.error('Service failure:', error);
              this.tokenService.clearAuthToken();
              this.alertService.error(
                this.translateService.instant('user.login-user.effect-failure')
              );
              return of(loginUserFailed());
            })
          )
      ),
      catchError(error => {
        this.logger.error('General failure:', error);
        this.tokenService.clearAuthToken();
        this.alertService.error(
          this.translateService.instant('app.general-effect-failure')
        );
        return of(loginUserFailed());
      })
    );
  });

  logoutUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(logoutUser),
      tap(action => this.logger.trace('Logout out user:', action)),
      mergeMap(() => {
        this.tokenService.clearAuthToken();
        return of(userLoggedOut());
      })
    );
  });

  saveUserPreference$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(saveUserPreference),
      tap(action => this.logger.trace('Save user preference:', action)),
      mergeMap(action =>
        this.userService
          .saveUserPreference({ name: action.name, value: action.value })
          .pipe(
            tap(response => this.logger.debug('Response received:', response)),
            map((response: User) => userPreferenceSaved({ user: response })),
            catchError(error => {
              this.logger.error('Service failure:', error);
              return of(saveUserPreferenceFailed());
            })
          )
      ),
      catchError(error => {
        this.logger.error('General failure:', error);
        return of(saveUserPreferenceFailed());
      })
    );
  });

  saveCurrentUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(saveCurrentUser),
      tap(action => this.logger.trace('Save current user:', action)),
      switchMap(action =>
        this.userService
          .saveUser({ user: action.user, password: action.password })
          .pipe(
            tap(response => this.logger.debug('Response received:', response)),
            tap(() =>
              this.alertService.info(
                this.translateService.instant(
                  'user.save-current-user.effect-success'
                )
              )
            ),
            map((response: User) => currentUserLoaded({ user: response })),
            catchError(error => {
              this.logger.error('Service failure:', error);
              this.alertService.error(
                this.translateService.instant(
                  'user.save-current-user.effect-failure'
                )
              );
              return of(saveCurrentUserFailed());
            })
          )
      ),
      catchError(error => {
        this.logger.error('General failure:', error);
        this.alertService.error(
          this.translateService.instant('app.general-effect-failure')
        );
        return of(saveCurrentUserFailed());
      })
    );
  });

  constructor(
    private logger: LoggerService,
    private actions$: Actions,
    private userService: UserService,
    private alertService: AlertService,
    private translateService: TranslateService,
    private tokenService: TokenService
  ) {}
}
