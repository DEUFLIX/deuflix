package com.movie.request

data class ProfileCreateRequest(
        var uId: Long,
        var pName: String,
        var pImage: String?,
        var age: String
)
