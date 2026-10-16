package com.academit.education.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "plan_materia")
@Getter
@Setter
@NoArgsConstructor
public class PlanMateria {

    @EmbeddedId
    private PlanMateriaId id = new PlanMateriaId();

    @MapsId("idPlan")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_plan", nullable = false)
    private PlanEstudio plan;

    @MapsId("idMateria")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_materia", nullable = false)
    private Materia materia;

    @Column(name = "anio_plan", nullable = false)
    private Integer anioPlan;
}
