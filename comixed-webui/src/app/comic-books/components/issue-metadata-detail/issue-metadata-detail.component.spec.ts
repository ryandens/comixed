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

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IssueMetadataDetailComponent } from './issue-metadata-detail.component';
import { LoggerModule } from '@angular-ru/cdk/logger';
import { IssueMetadataTitlePipe } from '@app/comic-books/pipes/issue-metadata-title.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ComicPageComponent } from '@app/comic-books/components/comic-page/comic-page.component';
import { MatIconModule } from '@angular/material/icon';
import { provideMockStore } from '@ngrx/store/testing';
import {
  initialState as initialUserState,
  USER_FEATURE_KEY
} from '@app/user/reducers/user.reducer';
import { USER_READER } from '@app/user/user.fixtures';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SCRAPING_ISSUE_1 } from '@app/comic-metadata/comic-metadata.fixtures';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('IssueMetadataDetailComponent', () => {
  const SCRAPING_ISSUE = SCRAPING_ISSUE_1;
  const USER = USER_READER;
  const initialState = {
    [USER_FEATURE_KEY]: { ...initialUserState, user: USER }
  };

  let component: IssueMetadataDetailComponent;
  let fixture: ComponentFixture<IssueMetadataDetailComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          IssueMetadataDetailComponent,
          ComicPageComponent,
          IssueMetadataTitlePipe
        ],
        imports: [
          NoopAnimationsModule,
          LoggerModule.forRoot(),
          TranslateModule.forRoot(),
          MatCardModule,
          MatFormFieldModule,
          MatIconModule,
          MatTooltipModule
        ],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();

      fixture = TestBed.createComponent(IssueMetadataDetailComponent);
      component = fixture.componentInstance;
      component.issue = SCRAPING_ISSUE;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
