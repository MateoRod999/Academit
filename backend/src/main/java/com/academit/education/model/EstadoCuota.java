package com.academit.education.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "estado_cuota")
@Getter
@Setter
@NoArgsConstructor
public class EstadoCuota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estado_cuota")
    private Integer id;

    @Column(name = "nombre", nullable = false, length = 30, unique = true)
    private String nombre;
}
