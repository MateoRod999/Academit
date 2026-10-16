package com.academit.education.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import com.academit.education.model.enums.*;

@Entity
@Table(name = "alumno")
@Getter
@Setter
@NoArgsConstructor
public class Alumno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_alumno")
    private Integer id;

    @Column(name = "dni", nullable = false, length = 10, unique = true)
    private String dni;

    @Column(name = "apellido", nullable = false, length = 60)
    private String apellido;

    @Column(name = "nombre", nullable = false, length = 60)
    private String nombre;

    @Column(name = "fecha_nacimiento", nullable = false)
    private LocalDate fechaNacimiento;

    @Column(name = "domicilio", nullable = true, length = 120)
    private String domicilio;

    @Column(name = "telefono", nullable = true, length = 20)
    private String telefono;

    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @Column(name = "fecha_ingreso", nullable = false)
    private LocalDate fechaIngreso = LocalDate.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 10)
    private EstadoPersona estado = EstadoPersona.ACTIVO;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_plan", nullable = false)
    private PlanEstudio plan;
}
