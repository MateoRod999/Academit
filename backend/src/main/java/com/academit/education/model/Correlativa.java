package com.academit.education.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Una materia del plan requiere haber aprobado otra (correlativa).
 * Se mapea solo con su clave compuesta; las FK a plan_materia las garantiza la base.
 */
@Entity
@Table(name = "correlativa")
@Getter
@Setter
@NoArgsConstructor
public class Correlativa {

    @EmbeddedId
    private CorrelativaId id = new CorrelativaId();
}
