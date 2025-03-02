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
 * along with this program. If not, see <http:/www.gnu.org/licenses>
 */

package org.comixedproject.model.net.comicbooks;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.comixedproject.model.comicbooks.ComicDetail;
import org.comixedproject.model.library.LastRead;
import org.comixedproject.views.View;

/**
 * <code>LoadComicDetailsResponse</code> represents the response payload when loading a page worth
 * of comics.
 *
 * @author Darryl L. Pierce
 */
@AllArgsConstructor
public class LoadComicDetailsResponse {
  @JsonProperty("comicDetails")
  @JsonView(View.ComicDetailsView.class)
  @Getter
  private List<ComicDetail> comicDetails;

  @JsonProperty("coverYears")
  @JsonView(View.ComicDetailsView.class)
  @Getter
  private List<Integer> coverYears;

  @JsonProperty("coverMonths")
  @JsonView(View.ComicDetailsView.class)
  @Getter
  private List<Integer> coverMonths;

  @JsonProperty("totalCount")
  @JsonView(View.ComicDetailsView.class)
  @Getter
  private long totalCount;

  @JsonProperty("filteredCount")
  @JsonView(View.ComicDetailsView.class)
  @Getter
  private long filteredCount;

  @JsonProperty("lastReadEntries")
  @JsonView(View.ComicDetailsView.class)
  @Getter
  private List<LastRead> lastReadEntries;
}
