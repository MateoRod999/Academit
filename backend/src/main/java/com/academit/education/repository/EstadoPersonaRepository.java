package com.academit.education.repository;

import com.academit.education.model.EstadoPersona;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EstadoPersonaRepository extends JpaRepository<EstadoPersona, Integer> {

    Optional<EstadoPersona> findByNombre(String nombre);
}
