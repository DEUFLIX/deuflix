package com.movie.model

import com.fasterxml.jackson.annotation.JsonIgnore
import org.hibernate.Hibernate
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction
import javax.persistence.*

@Entity
@Table(name = "movie")
class Movie {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        var id: Long? = null

        var title: String? = null

        @Column(length = 512)
        var description: String? = null

        var movieImage: String? = null
        var trailer: String? = null
        var movieUrl: String? = null

        @ManyToOne
        @JoinColumn(name = "movieYear_id")
        var year: MovieYear? = null

        @ManyToMany(fetch = FetchType.LAZY, cascade = [CascadeType.MERGE])
        @JoinTable(
                name = "movie_genre",
                joinColumns = [JoinColumn(name = "movie_id")],
                inverseJoinColumns = [JoinColumn(name = "genre_id")]
        )
        @OnDelete(action = OnDeleteAction.CASCADE)
        var genres: Set<Genre> = HashSet()

        @ManyToMany
        @JoinTable(name = "movie_user", joinColumns = [JoinColumn(name = "movie_id")], inverseJoinColumns = [JoinColumn(name = "user_id")])
        @OnDelete(action = OnDeleteAction.CASCADE)
        @JsonIgnore
        var users: Set<User> = HashSet()

        @ManyToMany
        @JoinTable(name = "movie_lists", joinColumns = [JoinColumn(name = "movie_id")], inverseJoinColumns = [JoinColumn(name = "list_id")])
        @OnDelete(action = OnDeleteAction.CASCADE)
        @JsonIgnore
        var lists: Set<MovieList> = HashSet()

        var isMovie: Boolean = true // 기본 값을 설정하고 nullable하지 않게 변경

        fun getIsMovie(): Boolean {
                return isMovie
        }

        constructor()

        constructor(
                id: Long?,
                title: String?,
                description: String?,
                movieImage: String?,
                trailer: String?,
                movieUrl: String?,
                year: MovieYear?,
                isMovie: Boolean,
                genres: Set<Genre>,
                users: Set<User>,
                lists: Set<MovieList>
        ) {
                this.id = id
                this.title = title
                this.description = description
                this.movieImage = movieImage
                this.trailer = trailer
                this.movieUrl = movieUrl
                this.year = year
                this.isMovie = isMovie
                this.genres = genres
                this.users = users
                this.lists = lists
        }

        constructor(
                title: String?,
                description: String?,
                movieImage: String?,
                trailer: String?,
                movieUrl: String?,
                year: MovieYear?,
                isMovie: Boolean
        ) {
                this.title = title
                this.description = description
                this.movieImage = movieImage
                this.trailer = trailer
                this.movieUrl = movieUrl
                this.year = year
                this.isMovie = isMovie
        }

        override fun equals(o: Any?): Boolean {
                if (this === o) return true
                if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false
                val movie = o as Movie
                return id != null && id == movie.id
        }

        override fun hashCode(): Int {
                return javaClass.hashCode()
        }

        override fun toString(): String {
                return "Movie{" +
                        "id=" + id +
                        ", title='" + title + '\'' +
                        ", description='" + description + '\'' +
                        ", movieImage='" + movieImage + '\'' +
                        ", trailer='" + trailer + '\'' +
                        ", movieUrl='" + movieUrl + '\'' +
                        ", year=" + year +
                        ", genres=" + genres +
                        ", users=" + users +
                        ", lists=" + lists +
                        ", isMovie=" + isMovie +
                        '}'
        }
}
