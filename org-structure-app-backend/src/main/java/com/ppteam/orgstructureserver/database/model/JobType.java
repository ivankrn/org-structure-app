package com.ppteam.orgstructureserver.database.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Table(name = "job_type")
@Data
public class JobType {

    @Id
    @SequenceGenerator(name = "job_type_id_seq", sequenceName = "job_type_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "job_type_id_seq")
    private long id;

    @Column(nullable = false)
    @NotBlank
    private String name;
}
