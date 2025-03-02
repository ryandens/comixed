/*
 * ComiXed - A digital comic book library management application.
 * Copyright (C) 2021, The ComiXed Project
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
import { HttpClient } from '@angular/common/http';
import { LoggerService } from '@angular-ru/cdk/logger';
import { Observable } from 'rxjs';
import { interpolate } from '@app/core';
import {
  LOAD_COMICS_WITH_DUPLICATE_PAGES_URL,
  LOAD_DUPLICATE_PAGE_DETAIL_URL
} from '@app/library/library.constants';

@Injectable({
  providedIn: 'root'
})
export class DuplicatePageService {
  constructor(private logger: LoggerService, private http: HttpClient) {}

  loadDuplicatePages(): Observable<any> {
    this.logger.trace('Service: Load duplicate pages');
    return this.http.get(interpolate(LOAD_COMICS_WITH_DUPLICATE_PAGES_URL));
  }

  loadDuplicatePageDetail(args: { hash: string }): Observable<any> {
    this.logger.trace('Service: Load detail for duplicate page:', args);
    return this.http.get(
      interpolate(LOAD_DUPLICATE_PAGE_DETAIL_URL, { hash: args.hash })
    );
  }
}
