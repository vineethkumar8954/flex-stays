package com.flexstays.repository;

import com.flexstays.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByStatus(Event.EventStatus status);
    List<Event> findByUserEmailOrderByCreatedAtDesc(String email);
    long countByStatus(Event.EventStatus status);
}
