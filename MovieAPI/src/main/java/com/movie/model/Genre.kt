package com.movie.model

import javax.persistence.*

@Entity
@Table(name = "genres")
data class Genre(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Int? = null,
        val genre: String,
        val type: String,

        @ManyToMany(mappedBy = "genres", cascade = [CascadeType.ALL])
        val movies: List<Movie> = mutableListOf(),

        @ManyToMany(mappedBy = "genres", cascade = [CascadeType.ALL])
        val series: List<Series> = mutableListOf()
) {
        constructor(id: Int?, genre: String, type: String) : this(
                id = id,
                genre = genre,
                type = type,
                movies = mutableListOf(),
                series = mutableListOf()
        )
}
