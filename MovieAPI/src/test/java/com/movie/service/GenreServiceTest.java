package com.movie.service;

import com.movie.model.Genre;
import com.movie.repository.GenreRepository;
import com.movie.request.GenreRequest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.mockito.Mockito.verify;

class GenreServiceTest {

    private GenreService genreService;

    private GenreRepository genreRepository;

    @BeforeEach
    void setUp() {
        genreRepository = Mockito.mock(GenreRepository.class);
        genreService = new GenreService(genreRepository);
    }

    @Test
    void getAllGenre() {
        // when
        genreService.getAllGenres();
        // then
        verify(genreRepository).findAll();
    }

    @Test
    public void whenCreateGenreCalledWithValidRequestItShouldReturnGenreDto() {
        GenreRequest request = new GenreRequest(1, "Action", "Movie");
        Genre genre = new Genre(request.getId(), request.getGenre(), request.getType());

        Mockito.when(genreRepository.save(genre)).thenReturn(genre);

        GenreRequest result = genreService.createGenre(request);
        Assertions.assertEquals(result, request);

        verify(genreRepository).save(genre);
    }
}
