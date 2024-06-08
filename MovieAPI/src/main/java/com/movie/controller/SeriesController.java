package com.movie.controller;

import com.movie.dto.SeriesDto;
import com.movie.request.SeriesRequest;
import com.movie.request.SeriesUpdateRequest;
import com.movie.service.SeriesService;
import io.swagger.v3.oas.annotations.Operation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/series")
public class SeriesController {
    private final SeriesService seriesService;
    private static final Logger logger = LoggerFactory.getLogger(SeriesController.class);

    public SeriesController(SeriesService seriesService) {
        this.seriesService = seriesService;
    }

    // Get All Series
    @Operation(summary = "Get All Series")
    @GetMapping
    public ResponseEntity<List<SeriesDto>> getAllSeries() {
        return ResponseEntity.ok(this.seriesService.getAllSeries());
    }

    // Get Last 5 Series
    @GetMapping("/last")
    public ResponseEntity<List<SeriesDto>> getLastFiveSeries() {
        return ResponseEntity.ok(this.seriesService.getLastFiveSeries());
    }

    // Get Series By Type
    @Operation(summary = "Get All Series By Type")
    @GetMapping("/type")
    public ResponseEntity<List<SeriesDto>> getSeriesByTypes(@RequestParam(required = false, value = "type") String type) {
        return ResponseEntity.ok(this.seriesService.getSeriesByTypes(type));
    }

    // Get Series By ID
    @Operation(summary = "Get One Series By ID")
    @GetMapping("/{id}")
    public ResponseEntity<SeriesDto> getSeriesById(@PathVariable Long id) {
        return ResponseEntity.ok(this.seriesService.getSeriesById(id));
    }

    // Get Random Series
    @Operation(summary = "Get Random One Series")
    @GetMapping("/random")
    public ResponseEntity<SeriesDto> getRandomOneSeries(@RequestParam(required = false, value = "type") String type) {
        logger.info("Received request to fetch random series of type: {}", type);
        if (type == null || type.isEmpty()) {
            type = "series"; // 기본값 설정
        }
        try {
            SeriesDto seriesDto = this.seriesService.getRandomOneSeries(type);
            logger.info("Returning random series: {}", seriesDto);
            return ResponseEntity.ok(seriesDto);
        } catch (Exception e) {
            logger.error("Error fetching random series", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Get Series By Genre ID
    @Operation(summary = "Get All Series By Genre ID")
    @GetMapping("/{id}/genre")
    public ResponseEntity<List<SeriesDto>> getAllSeriesByGenreId(@PathVariable Integer id) {
        return ResponseEntity.ok(this.seriesService.getAllSeriesByGenreId(id));
    }

    // Get Series By Genre Name
    @Operation(summary = "Get All Series By Genre Name")
    @GetMapping("/{genre}/genres")
    public ResponseEntity<List<SeriesDto>> getAllSeriesByGenre(@PathVariable String genre) {
        return ResponseEntity.ok(this.seriesService.getAllSeriesByGenre(genre));
    }

    // Create Series
    @Operation(summary = "Create Series")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<SeriesDto> createSeries(@Valid @RequestBody SeriesRequest request) {
        return new ResponseEntity<>(this.seriesService.createSeries(request), HttpStatus.CREATED);
    }

    // Update Series By Series ID
    @Operation(summary = "Update Series By Series ID")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<SeriesDto> updateSeries(@PathVariable Long id, @Valid @RequestBody SeriesUpdateRequest request) {
        return new ResponseEntity<>(this.seriesService.updateSeries(id, request), HttpStatus.OK);
    }

    // Delete Series By ID
    @Operation(summary = "DELETE Series By Series ID")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeriesByID(@PathVariable Long id) {
        this.seriesService.deleteSeriesById(id);
        return ResponseEntity.ok().build();
    }

    // Search Series By String Keyword
    @Operation(summary = "Search Series By String Keyword")
    @GetMapping("/search/{keyword}")
    public ResponseEntity<List<SeriesDto>> searchSeriesByKeyword(@PathVariable String keyword) {
        return ResponseEntity.ok(this.seriesService.searchSeriesByKeyword(keyword));
    }

    @PostMapping("/file/upload/{seriesId}")
    public ResponseEntity<SeriesDto> uploadSeriesImage(@PathVariable Long seriesId,
                                                       @RequestParam("file") MultipartFile file) {
        return new ResponseEntity<>(this.seriesService.addImageToSeries(seriesId, file), HttpStatus.OK);
    }

    @PostMapping("/file/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(this.seriesService.imgUpload(file));
    }
}
