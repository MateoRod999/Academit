package com.academit.education.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "tipo_evaluacion")
@Getter
@Setter
@NoArgsConstructor
public class TipoEvaluacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_evaluacion")
    private Integer id;

    @Column(name = "nombre", nullable = false, length = 30, unique = true)
    private String nombre;
}
