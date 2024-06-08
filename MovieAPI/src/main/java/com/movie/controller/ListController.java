package com.movie.controller;

import com.movie.dto.GenreDto;
import com.movie.service.GenreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/lists")
public class ListController {

    @Autowired
    private GenreService genreService;

    @GetMapping("/genre")
    public ResponseEntity<List<GenreDto>> getGenresByType(@RequestParam String type, @RequestParam String genre) {
        System.out.println("Type: " + type);
        System.out.println("Genre: " + genre);

        List<GenreDto> genres = genreService.findGenresByTypeAndGenre(type, genre);
        if (genres.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(genres, HttpStatus.OK);
    }
}
