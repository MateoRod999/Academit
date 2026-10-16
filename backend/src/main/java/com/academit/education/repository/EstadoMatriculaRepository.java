package com.academit.education.repository;

import com.academit.education.model.EstadoMatricula;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EstadoMatriculaRepository extends JpaRepository<EstadoMatricula, Integer> {

    Optional<EstadoMatricula> findByNombre(String nombre);
}
