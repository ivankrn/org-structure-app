package com.ppteam.orgstructureserver.database.repository;

import com.ppteam.orgstructureserver.database.model.Employee;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends CrudRepository<Employee, Long> {

    @Query("SELECT e from Employee e WHERE e.division.id = ?1 AND e.department.id IS NULL AND e.group.id IS NULL")
    List<Employee> findAttachedOnlyToDivisionId(long divisionId);

    @Query("SELECT e from Employee e WHERE e.department.id = ?1 AND e.group.id IS NULL")
    List<Employee> findAttachedOnlyToDepartmentId(long departmentId);

    List<Employee> findByGroupId(long groupId);

    @Query("SELECT e from Employee e WHERE e.division.id = ?1 AND e.jobTitle.name = 'Руководитель подразделения'")
    Optional<Employee> findDivisionHead(long divisionId);

    @Query("SELECT e from Employee e WHERE e.department.id = ?1 AND e.jobTitle.name = 'Руководитель отдела'")
    Optional<Employee> findDepartmentHead(long departmentId);

    @Query("SELECT e from Employee e WHERE e.group.id = ?1 AND e.jobTitle.name = 'Руководитель группы'")
    Optional<Employee> findGroupHead(long groupId);

}
