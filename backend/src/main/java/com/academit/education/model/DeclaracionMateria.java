package com.academit.education.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "declaracion_materia")
@Getter
@Setter
@NoArgsConstructor
public class DeclaracionMateria {

    @EmbeddedId
    private DeclaracionMateriaId id = new DeclaracionMateriaId();

    @MapsId("idDeclaracion")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_declaracion", nullable = false)
    private DeclaracionJurada declaracion;

    @MapsId("idMateria")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_materia", nullable = false)
    private Materia materia;
}
