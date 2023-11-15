package com.ppteam.orgstructureserver.database.repository;

import com.ppteam.orgstructureserver.database.model.Department;
import com.ppteam.orgstructureserver.database.model.Employee;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends CrudRepository<Department, Long> {

    @Query("SELECT e from Employee e WHERE e.division.id = ?1 AND e.department.id IS NULL AND e.group.id IS NULL")
    List<Employee> findAttachedOnlyToDivisionId(long divisionId);

}
