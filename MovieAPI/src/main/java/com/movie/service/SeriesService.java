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

    // Get All Series
    public List<SeriesDto> getAllSeries() {
        return seriesRepository.findAll().stream().map(SeriesDto::convert).collect(Collectors.toList());
    }

    public List<SeriesDto> getSeriesByTypes(String type) {
        boolean control = type.equals("series");
        if (!control) {
            return this.seriesRepository.findAll()
                    .stream().map(SeriesDto::convert).toList();
        }
        return List.of(this.seriesRepository.findSeriesByIsSeries(control))
                .stream().map(SeriesDto::convert).toList();
    }

    // Get Series By Genre ID
    public List<SeriesDto> getAllSeriesByGenreId(Integer id) {
        this.genreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Genre is not found"));
        return this.seriesRepository.findSeriesByGenresId(id)
                .stream().map(SeriesDto::convert).collect(Collectors.toList());
    }

    // Get Series By Genre
    public List<SeriesDto> getAllSeriesByGenre(String genre) {
        return this.seriesRepository.findSeriesByGenresGenre(genre)
                .stream()
                .map(SeriesDto::convert)
                .collect(Collectors.toList());
    }

    // Get Series By ID
    public SeriesDto getSeriesById(Long id) {
        return SeriesDto.convert(this.findSeriesByID(id));
    }

    public SeriesDto getRandomOneSeries(String type) {
        logger.info("Fetching random series of type: {}", type);
        if (type == null) {
            throw new IllegalArgumentException("Type cannot be null");
        }
        boolean control = type.equals("series");
        try {
            Series series = this.seriesRepository.findSeriesByIsSeries(control);
            if (series == null) {
                throw new ResourceNotFoundException("No random series found for type: " + type);
            }
            logger.info("Fetched random series: {}", series);
            return SeriesDto.convert(series);
        } catch (Exception e) {
            logger.error("Error fetching random series", e);
            throw new RuntimeException("Error fetching random series", e);
        }
    }


    // Create Series
    public SeriesDto createSeries(SeriesRequest request) {
        Series series = new Series(
                request.getTitle(),
                request.getDescription(),
                request.getSeriesImage(),
                request.getTrailer(),
                request.getSeriesUrl(),
                request.getYear(),
                Objects.requireNonNull(request.getGenres())
        );
        this.addSeriesToGenre(series, request.getGenres());
        Series savedOne = this.seriesRepository.save(series);
        return SeriesDto.convert(savedOne);
    }

    // Update Series
    public SeriesDto updateSeries(Long id, SeriesUpdateRequest request) {
        Series series = this.findSeriesByID(id);
        Series updateSeries = new Series(
                series.getId(),
                request.getTitle(),
                request.getDescription(),
                request.getSeriesImage(),
                request.getTrailer(),
                request.getSeriesUrl(),
                request.getYear(),
                series.getGenres() // Add existing genres
        );

        Objects.requireNonNull(updateSeries.getGenres()).removeAll(Objects.requireNonNull(series.getGenres()).stream().map(a -> {
            Genre genre = this.genreRepository.findByGenre(a.getGenre());
            Objects.requireNonNull(genre.getSeries()).remove(series);
            return genre;
        }).collect(Collectors.toSet()));
        this.addSeriesToGenre(updateSeries, request.getGenres());

        Series savedOne = this.seriesRepository.save(updateSeries);
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

    // Delete Series By ID
    public void deleteSeriesById(Long id) {
        Series series = this.findSeriesByID(id);
        if (series.getSeriesImage() != null)
            imageService.deleteFile(series.getSeriesImage());
        this.seriesRepository.delete(series);
    }

    // Search Series
    public List<SeriesDto> searchSeriesByKeyword(String keyword) {
        return this.seriesRepository.searchSeriesByKeyword(keyword).stream()
                .map(SeriesDto::convert).collect(Collectors.toList());
    }

    // Find Series By ID
    protected Series findSeriesByID(Long id) {
        return this.seriesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Series is not found"));
    }

    public List<SeriesDto> getLastFiveSeries() {
        return this.seriesRepository.findLastFiveSeries()
                .stream().map(SeriesDto::convert).toList();
    }

    public SeriesDto addImageToSeries(Long seriesId, MultipartFile file) {
        Series series = this.findSeriesByID(seriesId);
        String fileName = imageService.uploadFile(file);
        Series imgSeries = new Series(
                series.getId(),
                series.getTitle(),
                series.getDescription(),
                fileName,
                series.getTrailer(),
                series.getSeriesUrl(),
                series.getYear(),
                series.getGenres() // Add existing genres
        );

        this.seriesRepository.save(imgSeries);
        return SeriesDto.convert(imgSeries);
    }

    public String imgUpload(MultipartFile file) {
        return imageService.uploadFile(file);
    }
}
