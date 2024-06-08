package com.movie.model

import com.fasterxml.jackson.annotation.JsonIgnore
import org.hibernate.Hibernate
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction
import javax.persistence.*

@Entity
@Table(name = "series")
data class Series(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Long? = null,

        var title: String,
        var description: String,
        var seriesImage: String?,
        var seriesUrl: String?,
        var trailer: String?,
        var year: Int,

        @ManyToMany(cascade = [CascadeType.ALL])
        @JoinTable(
                name = "series_genre",
                joinColumns = [JoinColumn(name = "series_id")],
                inverseJoinColumns = [JoinColumn(name = "genre_id")]
        )
        @OnDelete(action = OnDeleteAction.CASCADE)
        @JsonIgnore
        var genres: Set<Genre> = HashSet(),

        @OneToMany(mappedBy = "series", cascade = [CascadeType.ALL], orphanRemoval = true)
        var episodes: List<Episode> = mutableListOf()
) {
    constructor(
            title: String,
            description: String,
            seriesImage: String?,
            seriesUrl: String?,
            trailer: String?,
            year: Int,
            genres: Set<Genre>
    ) : this(
            id = null,
            title = title,
            description = description,
            seriesImage = seriesImage,
            seriesUrl = seriesUrl,
            trailer = trailer,
            year = year,
            genres = genres
    )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as Series

        return id != null && id == other.id
    }

    override fun hashCode(): Int = javaClass.hashCode()

    override fun toString(): String {
        return this::class.simpleName + "(id = $id , title = $title , description = $description , seriesImage = $seriesImage , seriesUrl = $seriesUrl , trailer = $trailer , year = $year )"
    }
}
