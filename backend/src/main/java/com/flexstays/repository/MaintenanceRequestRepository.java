package com.flexstays.repository;

import com.flexstays.entity.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {
    List<MaintenanceRequest> findByStatus(MaintenanceRequest.MaintenanceStatus status);
    List<MaintenanceRequest> findByAssignedToEmail(String email);
    List<MaintenanceRequest> findByRoomRoomNumber(String roomNumber);
    long countByStatus(MaintenanceRequest.MaintenanceStatus status);
}
