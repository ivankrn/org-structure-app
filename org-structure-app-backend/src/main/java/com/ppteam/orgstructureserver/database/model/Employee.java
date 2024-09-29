package com.ppteam.orgstructureserver.database.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "employee")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    @Id
    @SequenceGenerator(name = "employee_id_seq", sequenceName = "employee_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "employee_id_seq")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "parent_id", nullable = false)
    private OrganizationalUnit parent;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "employee_project",
            joinColumns = @JoinColumn(name = "employee_id"),
            inverseJoinColumns = @JoinColumn(name = "project_id")
    )
    private Set<Project> projects;

    @ManyToOne
    @JoinColumn(name = "job_title_id", nullable = false)
    private JobTitle jobTitle;

    @Column(name = "fullname", nullable = false)
    @NotBlank
    private String fullName;

    @ManyToOne
    @JoinColumn(name = "job_type_id", nullable = false)
    private JobType jobType;

    @Column(name = "is_vacancy", nullable = false)
    private boolean vacancy;

    @Column(name = "employment_date", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime employmentDate;

    @Column(name = "salary")
    private BigDecimal salary;

    @Column(name = "gender", columnDefinition = "gender")
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "status", columnDefinition = "employee_status")
    @Enumerated(EnumType.STRING)
    private EmployeeStatus status;

    @Column(name = "total_years_experience")
    private Integer totalYearsExperience;

    @Column(name = "birthdate", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime birthdate;

    @Column(name = "email")
    @Email
    private String email;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Employee that = (Employee) o;
        if (id == null && that.id == null) {
            return false;
        }
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}
