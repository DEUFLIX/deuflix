package com.movie.model

import javax.persistence.*

@Entity
@Table(name = "episodes")
data class Episode(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Long? = null,

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "series_id")
        var series: Series,

        var episodeNumber: Int,
        var title: String,
        var description: String?,
        var url: String?,
        var duration: Int,
        var thumbnailImage: String?
)
