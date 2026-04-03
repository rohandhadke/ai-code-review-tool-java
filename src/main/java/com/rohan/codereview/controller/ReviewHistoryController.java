package com.rohan.codereview.controller;

import com.rohan.codereview.model.ReviewHistory;
import com.rohan.codereview.repository.ReviewHistoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewHistoryController {

    private static final Logger log = LoggerFactory.getLogger(ReviewHistoryController.class);

    private final ReviewHistoryRepository repository;

    public ReviewHistoryController(ReviewHistoryRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<ReviewHistory>> getAllReviews() {
        log.info("Fetching all reviews");
        List<ReviewHistory> reviews = repository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReviewById(@PathVariable String id) {
        log.info("Fetching review: {}", id);
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable String id) {
        log.info("Deleting review: {}", id);
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
