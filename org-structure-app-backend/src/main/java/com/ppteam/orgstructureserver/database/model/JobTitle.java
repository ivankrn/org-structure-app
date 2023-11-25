package com.ppteam.orgstructureserver.database.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.Objects;

@Entity
@Table(name = "job_title")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JobTitle {

    @Id
    @SequenceGenerator(name = "job_title_id_seq", sequenceName = "job_title_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "job_title_id_seq")
    private Long id;

    @Column(nullable = false)
    @NotBlank
    private String name;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        JobTitle that = (JobTitle) o;
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
