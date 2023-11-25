package com.ppteam.orgstructureserver.database.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Table(name = "legal_entity")
@Data
public class LegalEntity {

    @Id
    @SequenceGenerator(name = "legal_entity_id_seq", sequenceName = "legal_entity_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "legal_entity_id_seq")
    private long id;

    @Column(nullable = false)
    @NotBlank
    private String name;

}
