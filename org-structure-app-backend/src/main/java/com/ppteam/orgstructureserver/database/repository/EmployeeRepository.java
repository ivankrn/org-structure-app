package com.ppteam.orgstructureserver.database.repository;

import com.ppteam.orgstructureserver.database.model.Employee;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface EmployeeRepository extends CrudRepository<Employee, Long> {

    List<Employee> findByParentId(long parentId);

    List<Employee> findByParentIdOrderByFullNameAsc(long parentId);

    List<Employee> findByFullNameContainingIgnoreCase(String name);

    @Query("""
        SELECT new com.ppteam.orgstructureserver.database.repository.EmployeeRepository$SalaryStatistics(
            MIN(e.salary),
            MAX(e.salary)
        ) FROM Employee e
    """)
    SalaryStatistics getSalaryStatistics();

    record SalaryStatistics(BigDecimal minSalary, BigDecimal maxSalary) {}
}
