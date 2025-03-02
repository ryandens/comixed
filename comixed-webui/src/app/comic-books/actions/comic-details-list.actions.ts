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

import { createAction, props } from '@ngrx/store';
import { ArchiveType } from '@app/comic-books/models/archive-type.enum';
import { ComicType } from '@app/comic-books/models/comic-type';
import { ComicState } from '@app/comic-books/models/comic-state';
import { ComicDetail } from '@app/comic-books/models/comic-detail';
import { TagType } from '@app/collections/models/comic-collection.enum';

export const loadComicDetails = createAction(
  '[Comic Details List] Load a page worth of comic details',
  props<{
    pageSize: number;
    pageIndex: number;
    sortBy: string;
    sortDirection: string;
    coverYear: number;
    coverMonth: number;
    archiveType: ArchiveType;
    comicType: ComicType;
    comicState: ComicState;
    unscrapedState: boolean;
    searchText: string;
    publisher: string;
    series: string;
    volume: string;
  }>()
);

export const loadComicDetailsById = createAction(
  '[Comic Detail List] Load comic details by their ids',
  props<{ comicBookIds: number[] }>()
);

export const loadComicDetailsForCollection = createAction(
  '[Comic Detail List] Load comic details for a given collection type',
  props<{
    pageSize: number;
    pageIndex: number;
    tagType: TagType;
    tagValue: string;
    sortBy: string;
    sortDirection: string;
  }>()
);

export const loadUnreadComicDetails = createAction(
  '[Comic Detail List] Load comic details for unread comic books',
  props<{
    pageSize: number;
    pageIndex: number;
    sortBy: string;
    sortDirection: string;
  }>()
);

export const comicDetailsLoaded = createAction(
  '[Comic Details List] A page worth of comic details were loaded',
  props<{
    comicDetails: ComicDetail[];
    totalCount: number;
    filteredCount: number;
    coverYears: number[];
    coverMonths: number[];
  }>()
);

export const loadComicDetailsFailed = createAction(
  '[Comic Details List]  Loading a page worth of comic details failed'
);

export const comicDetailUpdated = createAction(
  '[Comic Details List] Received an updated comic detail',
  props<{ comicDetail: ComicDetail }>()
);

export const comicDetailRemoved = createAction(
  '[Comic Details List] Received an removed comic detail',
  props<{ comicDetail: ComicDetail }>()
);
