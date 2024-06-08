package com.movie.request

import com.movie.model.Genre

class GenreRequest {
    var id: Int? = null
    var genre: String? = null
    var type: String? = null

    constructor()

    constructor(id: Int?, genre: String?, type: String?) {
        this.id = id
        this.genre = genre
        this.type = type
    }

    companion object {
        fun fromEntity(genre: Genre): GenreRequest {
            return GenreRequest(genre.id, genre.genre, genre.type)
        }
    }
}
