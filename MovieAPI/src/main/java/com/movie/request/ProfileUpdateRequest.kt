package com.movie.request

data class ProfileUpdateRequest(
        val id: Int,
        val pName: String,
        val pImage: String?,
        val age: String
)
