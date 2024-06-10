package com.movie.dto

import com.movie.model.Episode

class EpisodeDto {
    var id: Long? = null
    var seriesId: Long? = null
    var episodeNumber: Int = 0
    var title: String? = null
    var description: String? = null
    var url: String? = null
    var duration: Int = 0
    var thumbnailImage: String? = null

    companion object {
        fun convert(episode: Episode): EpisodeDto {
            val dto = EpisodeDto()
            dto.id = episode.id
            dto.seriesId = episode.series.id
            dto.episodeNumber = episode.episodeNumber
            dto.title = episode.title
            dto.description = episode.description
            dto.url = episode.url
            dto.duration = episode.duration
            dto.thumbnailImage = episode.thumbnailImage
            return dto
        }
    }
}
