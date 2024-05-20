package com.ppteam.orgstructureserver.database.repository;

import com.ppteam.orgstructureserver.database.model.JobTitle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobTitleRepository extends JpaRepository<JobTitle, Long> {

    List<JobTitle> findByNameContainingIgnoreCase(String name);

}
