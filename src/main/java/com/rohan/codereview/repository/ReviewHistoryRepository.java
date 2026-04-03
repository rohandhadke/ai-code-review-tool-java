package com.rohan.codereview.repository;

import com.rohan.codereview.model.ReviewHistory;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReviewHistoryRepository extends MongoRepository<ReviewHistory, String> {
    List<ReviewHistory> findAllByOrderByCreatedAtDesc();
}
