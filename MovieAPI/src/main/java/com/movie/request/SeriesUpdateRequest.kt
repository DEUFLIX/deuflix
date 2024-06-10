package com.movie.request

import com.movie.model.Genre
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull

data class SeriesUpdateRequest(
        @field:NotBlank(message = "Title Cannot be Empty")
        val title: String,
        @field:NotBlank(message = "Description Cannot be Empty")
        val description: String,
        val seriesImage: String?,
        val seriesUrl: String,
        val trailer: String,
        @field:NotNull(message = "Year Cannot be Empty")
        val year: Int,
        @field:NotNull(message = "Genre Cannot be Empty")
        val genres: Set<Genre>?
)
