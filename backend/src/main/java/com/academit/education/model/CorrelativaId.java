package com.academit.education.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
public class CorrelativaId implements Serializable {

    @Column(name = "id_plan")
    private Integer idPlan;

    @Column(name = "id_materia")
    private Integer idMateria;

    @Column(name = "id_materia_requerida")
    private Integer idMateriaRequerida;
}
