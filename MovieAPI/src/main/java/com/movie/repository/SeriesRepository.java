package com.movie.repository;

import com.movie.model.Series;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SeriesRepository extends JpaRepository<Series, Long> {

    List<Series> findSeriesByGenresId(Integer id);
    List<Series> findSeriesByGenresGenre(String genre);

    @Query(value = "SELECT * FROM series WHERE title LIKE %?1%", nativeQuery = true)
    List<Series> searchSeriesByKeyword(String keyword);

    @Query(value = "SELECT * FROM series ORDER BY RAND() LIMIT 10", nativeQuery = true)
    List<Series> findRandomSeries();

    @Query(value = "SELECT * FROM series WHERE is_series = ?1", nativeQuery = true)
    List<Series> findSeriesByIsSeries(boolean control);  // 수정된 부분

    @Query(value = "SELECT * FROM series ORDER BY id DESC LIMIT 5", nativeQuery = true)
    List<Series> findLastFiveSeries();
}
