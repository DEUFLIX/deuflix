package com.movie.dto

import com.movie.model.Profile

data class ProfileDto(
        val id: Int,
        val UId: Long,
        val pName: String,
        val pImage: String,
        val age: String
) {
    companion object {
        @JvmStatic
        fun fromEntity(profile: Profile): ProfileDto {
            return ProfileDto(
                    profile.id,
                    profile.UId,
                    profile.pName,
                    profile.pImage,
                    profile.age
            )
        }
    }
}
