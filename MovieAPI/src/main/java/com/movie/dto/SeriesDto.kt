package com.movie.dto

import com.movie.model.Genre
import com.movie.model.Series
import java.util.stream.Collectors

data class SeriesDto(
        val id: Long?,
        val title: String?,
        val description: String?,
        val seriesImage: String?,
        val seriesUrl: String?,
        val trailer: String?,
        val year: Int,
        val genres: Set<String>? // 장르를 문자열 세트로 변경
) {
    companion object {
        @JvmStatic
        fun convert(series: Series): SeriesDto {
            return SeriesDto(
                    series.id,
                    series.title,
                    series.description,
                    series.seriesImage,
                    series.seriesUrl,
                    series.trailer,
                    series.year,
                    series.genres?.map { it.genre }?.toSet() // Genre 객체에서 genre 문자열을 추출
            )
        }
    }
}
