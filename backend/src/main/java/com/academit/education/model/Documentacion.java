package com.academit.education.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "documentacion")
@Getter
@Setter
@NoArgsConstructor
public class Documentacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_documento")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_alumno", nullable = false)
    private Alumno alumno;

    @Column(name = "tipo", nullable = false, length = 30)
    private String tipo;

    @Column(name = "obligatorio", nullable = false)
    private Boolean obligatorio = true;

    @Column(name = "estado", nullable = false, length = 20)
    private String estado = "PENDIENTE";

    @Column(name = "fecha_entrega")
    private LocalDate fechaEntrega;

    @Column(name = "observaciones", length = 255)
    private String observaciones;
}
