package com.movie.dto

import com.movie.model.Movie
import com.movie.model.User

data class UserDto @JvmOverloads constructor(
        val id:Long?,
        val name: String?,
        val email:String,
        val password: String,
        val movies: Set<Movie>? = HashSet(),
        val isAdmin: Boolean,
<<<<<<< HEAD
=======

>>>>>>> origin/IK4P1N4
){
    companion object{
        @JvmStatic
        fun convert(from: User):  UserDto{
            return UserDto(from.id,
                    from.name,
                    from.email,
                    from.password,
                    from.movieList,
<<<<<<< HEAD
                    from.authorities.stream().anyMatch{a-> a.authority.equals("ROLE_ADMIN")})
=======
                    from.authorities.stream
                    ().anyMatch{a-> a.authority.equals("ROLE_ADMIN")})
>>>>>>> origin/IK4P1N4
        }
    }
}
