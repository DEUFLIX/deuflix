package com.movie.dto

import com.movie.model.Series
import java.util.stream.Collectors

class SeriesDto {
    var id: Long? = null
    var title: String? = null
    var description: String? = null
    var seriesImage: String? = null
    var seriesUrl: String? = null
    var trailer: String? = null
    var year: Int = 0
    var genres: Set<String>? = null
    var episodes: List<EpisodeDto>? = null

    companion object {
        @JvmStatic
        fun convert(series: Series): SeriesDto {
            val dto = SeriesDto()
            dto.id = series.id
            dto.title = series.title
            dto.description = series.description
            dto.seriesImage = series.seriesImage
            dto.seriesUrl = series.seriesUrl
            dto.trailer = series.trailer
            dto.year = series.year
            dto.genres = series.genres.map { it.genre }.toSet()
            dto.episodes = series.episodes.map { EpisodeDto.convert(it) }
            return dto
        }
    }
}
