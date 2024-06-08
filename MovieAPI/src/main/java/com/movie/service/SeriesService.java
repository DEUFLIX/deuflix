package com.movie.service;

import com.movie.dto.SeriesDto;
import com.movie.exception.ResourceNotFoundException;
import com.movie.model.Genre;
import com.movie.model.Series;
import com.movie.repository.GenreRepository;
import com.movie.repository.SeriesRepository;
import com.movie.request.SeriesRequest;
import com.movie.request.SeriesUpdateRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SeriesService {

    private static final Logger logger = LoggerFactory.getLogger(SeriesService.class);

    private final ImageService imageService;
    private final SeriesRepository seriesRepository;
    private final GenreRepository genreRepository;

    public SeriesService(ImageService imageService,
                         SeriesRepository seriesRepository,
                         GenreRepository genreRepository) {
        this.imageService = imageService;
        this.seriesRepository = seriesRepository;
        this.genreRepository = genreRepository;
    }

    public List<SeriesDto> getAllSeries() {
        return seriesRepository.findAll().stream().map(SeriesDto::convert).collect(Collectors.toList());
    }

    public List<SeriesDto> getSeriesByTypes(String type) {
        return this.seriesRepository.findAll()
                .stream().map(SeriesDto::convert).collect(Collectors.toList());
    }

    public List<SeriesDto> getAllSeriesByGenreId(Integer id) {
        this.genreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Genre is not found"));
        return this.seriesRepository.findSeriesByGenresId(id)
                .stream().map(SeriesDto::convert).collect(Collectors.toList());
    }

    public List<SeriesDto> getAllSeriesByGenre(String genre) {
        return this.seriesRepository.findSeriesByGenresGenre(genre)
                .stream()
                .map(SeriesDto::convert)
                .collect(Collectors.toList());
    }

    public SeriesDto getSeriesById(Long id) {
        return SeriesDto.convert(this.findSeriesByID(id));
    }

    public SeriesDto getRandomOneSeries(String type) {
        logger.info("Fetching random series of type: {}", type);
        List<Series> seriesList;
        try {
            seriesList = this.seriesRepository.findAll();
            if (seriesList == null || seriesList.isEmpty()) {
                throw new ResourceNotFoundException("No random series found for type: " + type);
            }
            Series series = seriesList.get(new Random().nextInt(seriesList.size()));
            logger.info("Fetched random series: {}", series);
            return SeriesDto.convert(series);
        } catch (Exception e) {
            logger.error("Error fetching random series", e);
            throw new RuntimeException("Error fetching random series", e);
        }
    }

    public SeriesDto createSeries(SeriesRequest request) {
        Series series = new Series(
                request.getTitle(),
                request.getDescription(),
                request.getSeriesImage(),
                request.getSeriesUrl(),
                request.getTrailer(),
                request.getYear(),
                request.getGenres()
        );

        this.addSeriesToGenre(series, request.getGenres());
        Series savedOne = this.seriesRepository.save(series);
        return SeriesDto.convert(savedOne);
    }

    public SeriesDto updateSeries(Long id, SeriesUpdateRequest request) {
        Series series = this.findSeriesByID(id);
        series.setTitle(request.getTitle());
        series.setDescription(request.getDescription());
        series.setSeriesImage(request.getSeriesImage());
        series.setSeriesUrl(request.getSeriesUrl());
        series.setTrailer(request.getTrailer());
        series.setYear(request.getYear());
        series.setGenres(request.getGenres());

        Objects.requireNonNull(series.getGenres()).removeAll(Objects.requireNonNull(series.getGenres()).stream().map(a -> {
            Genre genre = this.genreRepository.findByGenre(a.getGenre());
            Objects.requireNonNull(genre.getSeries()).remove(series);
            return genre;
        }).collect(Collectors.toSet()));
        this.addSeriesToGenre(series, request.getGenres());

        Series savedOne = this.seriesRepository.save(series);
        return SeriesDto.convert(savedOne);
    }

    private Series addSeriesToGenre(Series series, Set<Genre> genres) {
        series.getGenres().addAll(genres.stream().map(a -> {
            Genre genre = this.genreRepository.findByGenre(a.getGenre());
            if (genre == null)
                throw new ResourceNotFoundException("Genre could not found => " + genres
                        .stream().map(Genre::getGenre).collect(Collectors.toList()));
            genre.getSeries().add(series);
            return genre;
        }).collect(Collectors.toSet()));
        return series;
    }

    public void deleteSeriesById(Long id) {
        Series series = this.findSeriesByID(id);
        if (series.getSeriesImage() != null)
            imageService.deleteFile(series.getSeriesImage());
        this.seriesRepository.delete(series);
    }

    public List<SeriesDto> searchSeriesByKeyword(String keyword) {
        return this.seriesRepository.searchSeriesByKeyword(keyword).stream()
                .map(SeriesDto::convert).collect(Collectors.toList());
    }

    protected Series findSeriesByID(Long id) {
        return this.seriesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Series is not found"));
    }

    public List<SeriesDto> getLastFiveSeries() {
        return this.seriesRepository.findLastFiveSeries()
                .stream().map(SeriesDto::convert).collect(Collectors.toList());
    }

    public SeriesDto addImageToSeries(Long seriesId, MultipartFile file) {
        Series series = this.findSeriesByID(seriesId);
        String fileName = imageService.uploadFile(file);
        series.setSeriesImage(fileName);

        Series savedOne = this.seriesRepository.save(series);
        return SeriesDto.convert(savedOne);
    }

    public String imgUpload(MultipartFile file) {
        return imageService.uploadFile(file);
    }
}
