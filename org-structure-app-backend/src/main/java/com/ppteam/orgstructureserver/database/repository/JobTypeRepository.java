package com.ppteam.orgstructureserver.database.repository;

import com.ppteam.orgstructureserver.database.model.JobType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobTypeRepository extends JpaRepository<JobType, Long> {

    List<JobType> findByNameContainingIgnoreCase(String name);

}
