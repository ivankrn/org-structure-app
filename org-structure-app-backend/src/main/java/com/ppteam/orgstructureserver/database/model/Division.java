package com.ppteam.orgstructureserver.database.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Table(name = "division")
@Data
public class Division {

    @Id
    @SequenceGenerator(name = "division_id_seq", sequenceName = "division_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "division_id_seq")
    private long id;

    @ManyToOne
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @ManyToOne
    @JoinColumn(name = "legal_entity_id", nullable = false)
    private LegalEntity legalEntity;

    @Column(nullable = false)
    @NotBlank
    private String name;

}
