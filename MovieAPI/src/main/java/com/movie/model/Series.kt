package com.movie.model

import com.fasterxml.jackson.annotation.JsonIgnore
import org.hibernate.Hibernate
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction
import javax.persistence.*

@Entity
@Table(name = "series")
class Series {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null

    var title: String? = null

    @Column(length = 512)
    var description: String? = null

    var seriesImage: String? = null
    var trailer: String? = null
    var seriesUrl: String? = null

    var year: Int = 1995 // 기본값 설정

    @ManyToMany(fetch = FetchType.LAZY, cascade = [CascadeType.MERGE])
    @JoinTable(
            name = "series_genre",
            joinColumns = [JoinColumn(name = "series_id")],
            inverseJoinColumns = [JoinColumn(name = "genre_id")]
    )
    @OnDelete(action = OnDeleteAction.CASCADE)
    var genres: Set<Genre> = HashSet()

    @ManyToMany
    @JoinTable(name = "series_user", joinColumns = [JoinColumn(name = "series_id")], inverseJoinColumns = [JoinColumn(name = "user_id")])
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    var users: Set<User> = HashSet()

    constructor()

    constructor(
            id: Long?,
            title: String?,
            description: String?,
            seriesImage: String?,
            trailer: String?,
            seriesUrl: String?,
            year: Int,
            genres: Set<Genre>
    ) {
        this.id = id
        this.title = title
        this.description = description
        this.seriesImage = seriesImage
        this.trailer = trailer
        this.seriesUrl = seriesUrl
        this.year = year
        this.genres = genres
    }

    constructor(
            title: String?,
            description: String?,
            seriesImage: String?,
            trailer: String?,
            seriesUrl: String?,
            year: Int,
            genres: Set<Genre>
    ) {
        this.title = title
        this.description = description
        this.seriesImage = seriesImage
        this.trailer = trailer
        this.seriesUrl = seriesUrl
        this.year = year
        this.genres = genres
    }

    override fun equals(o: Any?): Boolean {
        if (this === o) return true
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false
        val series = o as Series
        return id != null && id == series.id
    }

    override fun hashCode(): Int {
        return javaClass.hashCode()
    }

    override fun toString(): String {
        return "Series{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", seriesImage='" + seriesImage + '\'' +
                ", trailer='" + trailer + '\'' +
                ", seriesUrl='" + seriesUrl + '\'' +
                ", year=" + year +
                ", genres=" + genres +
                '}'
    }
}
