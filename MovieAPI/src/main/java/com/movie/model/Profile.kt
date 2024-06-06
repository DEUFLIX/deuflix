package com.movie.model

import javax.persistence.*

@Entity
@Table(name = "profiles")
data class Profile(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Int = 0,

        @Column(name = "u_id")
        val UId: Long,

        @Column(name = "p_name")
        var pName: String,

        @Column(name = "p_image")
        var pImage: String,

        @Column(name = "age")
        var age: String
) {
    constructor(uId: Long, pName: String, pImage: String, age: String) : this(
            id = 0,
            UId = uId,
            pName = pName,
            pImage = pImage,
            age = age
    )
}
