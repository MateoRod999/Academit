package com.academit.education.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "mesa_examen")
@Getter
@Setter
@NoArgsConstructor
public class MesaExamen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mesa")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_materia", nullable = false)
    private Materia materia;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_docente", nullable = false)
    private Docente docente;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "cupo", nullable = false)
    private Integer cupo;

    @Column(name = "tribunal", length = 150)
    private String tribunal;

    @Column(name = "turno", length = 10)
    private String turno = "MANANA";
}
