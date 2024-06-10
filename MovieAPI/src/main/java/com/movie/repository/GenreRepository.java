package com.movie.repository;

import com.movie.model.Genre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GenreRepository extends JpaRepository<Genre, Integer> {
    Genre findByGenreContaining(String genre);
    Genre findByGenre(String genre);
    Boolean existsByGenre(String genre);
    List<Genre> findByTypeAndGenre(String type, String genre);
}
