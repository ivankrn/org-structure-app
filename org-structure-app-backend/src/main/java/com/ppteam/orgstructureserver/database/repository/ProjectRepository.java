package com.ppteam.orgstructureserver.database.repository;

import com.ppteam.orgstructureserver.database.model.Project;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends CrudRepository<Project, Long> {

    List<Project> findByNameContainingIgnoreCase(String name);

}
