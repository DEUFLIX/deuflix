package com.movie.service;

import com.movie.dto.GenreDto;
import com.movie.exception.ResourceNotFoundException;
import com.movie.model.Genre;
import com.movie.repository.GenreRepository;
import com.movie.request.GenreRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class GenreService {
    private final GenreRepository genreRepository;

    public GenreService(GenreRepository genreRepository) {
        this.genreRepository = genreRepository;
    }

    public List<GenreDto> getAllGenres() {
        return genreRepository.findAll().stream()
                .map(genre -> new GenreDto(genre.getId(), genre.getGenre(), genre.getType()))
                .collect(Collectors.toList());
    }

    public GenreDto getGenreById(Integer id) {
        Genre genre = this.findGenreByID(id);
        return new GenreDto(genre.getId(), genre.getGenre(), genre.getType());
    }

    public GenreRequest createGenre(GenreRequest request) {
        if (this.genreRepository.existsByGenre(request.getGenre())) {
            throw new ResourceNotFoundException("Duplicate Genre");
        }
        Genre genre = new Genre(request.getId(), Objects.requireNonNull(request.getGenre()), request.getType());
        Genre savedOne = this.genreRepository.save(genre);
        return new GenreRequest(savedOne.getId(), savedOne.getGenre(), savedOne.getType());
    }

    public GenreDto updateGenre(Integer id, GenreRequest request) {
        Genre genre = this.findGenreByID(id);
        Genre updatedOne = new Genre(
                genre.getId(),
                Objects.requireNonNull(request.getGenre()),
                request.getType(),
                genre.getMovies(),
                genre.getSeries()
        );
        this.genreRepository.save(updatedOne);
        return new GenreDto(updatedOne.getId(), updatedOne.getGenre(), updatedOne.getType());
    }

    public void deleteGenre(Integer id) {
        Genre genre = this.findGenreByID(id);
        this.genreRepository.delete(genre);
    }

    public List<GenreDto> findGenresByTypeAndGenre(String type, String genre) {
        return genreRepository.findByTypeAndGenre(type, genre).stream()
                .map(g -> new GenreDto(g.getId(), g.getGenre(), g.getType()))
                .collect(Collectors.toList());
    }

    protected Genre findGenreByID(Integer id) {
        return this.genreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Genre is not found"));
    }
}
