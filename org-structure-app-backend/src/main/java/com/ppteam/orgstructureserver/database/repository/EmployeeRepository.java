package com.ppteam.orgstructureserver.database.repository;

import com.ppteam.orgstructureserver.database.model.Employee;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends CrudRepository<Employee, Long> {

    List<Employee> findByParentId(long parentId);

    List<Employee> findByParentIdOrderByFullNameAsc(long parentId);

    List<Employee> findByFullNameContainingIgnoreCase(String name);

}
