package com.movie.dto

class GenreDto {
    // getter와 setter
    var id: Int? = null
    var genre: String? = null
    var type: String? = null

    // 기본 생성자
    constructor()

    // 생성자
    constructor(id: Int?, genre: String?, type: String?) {
        this.id = id
        this.genre = genre
        this.type = type
    }
}