package com.movie.dto

import com.movie.model.Genre
import com.movie.model.Movie

data class MovieDto(
        val id: Long?,
        val title: String?,
        val description: String?,
        val movieImage: String?,
        val movieUrl: String?,
        val trailer: String?,
        val year: Int,
        val genres: Set<Genre>?,
        val isMovie: Boolean?
) {
    companion object {
        @JvmStatic
        fun convert(movie: Movie): MovieDto {
            return MovieDto(
                    movie.id,
                    movie.title,
                    movie.description,
                    movie.movieImage,
                    movie.movieUrl,
                    movie.trailer,
                    movie.year?.year ?: 1995,
                    movie.genres,
                    movie.isMovie
            )
        }
    }
}
