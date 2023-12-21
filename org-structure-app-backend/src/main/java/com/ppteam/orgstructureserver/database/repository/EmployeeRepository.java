package com.ppteam.orgstructureserver.database.repository;

import com.ppteam.orgstructureserver.database.model.Employee;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends CrudRepository<Employee, Long> {

    List<Employee> findByParentId(long parentId);

    List<Employee> findByParentIdOrderByFullNameAsc(long parentId);

    List<Employee> findByFullNameContainingIgnoreCase(String name);

    @Query("SELECT e from Employee e " +
            "WHERE e.parent.id = ?1 AND " +
            "(e.jobTitle.name LIKE '%Руководитель подразделения%' " +
            "OR e.jobTitle.name LIKE '%Руководитель отдела%' " +
            "OR e.jobTitle.name LIKE '%Руководитель группы%')")
    Optional<Employee> findOrganizationalUnitHead(long organizationalUnitId);

}
