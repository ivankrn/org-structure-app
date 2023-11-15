package com.ppteam.orgstructureserver.database.repository;

import com.ppteam.orgstructureserver.database.model.Department;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepartmentRepository extends CrudRepository<Department, Long> {

    List<Department> findByDivisionId(long divisionId);

}
