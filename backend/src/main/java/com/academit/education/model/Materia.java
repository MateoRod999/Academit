package com.academit.education.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "materia")
@Getter
@Setter
@NoArgsConstructor
public class Materia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_materia")
    private Integer id;

    @Column(name = "nombre", nullable = false, length = 80, unique = true)
    private String nombre;

    @Column(name = "activa", nullable = false)
    private Boolean activa = true;
}
