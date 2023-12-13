package com.ppteam.orgstructureserver.database.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.Objects;

@Entity
@Table(name = "employee")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    @Id
    @SequenceGenerator(name = "employee_id_seq", sequenceName = "employee_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "employee_id_seq")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "parent_id", nullable = false)
    private OrganizationalUnit parent;

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
