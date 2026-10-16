package com.academit.education.repository;

import com.academit.education.model.EstadoAsistencia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EstadoAsistenciaRepository extends JpaRepository<EstadoAsistencia, Integer> {

    Optional<EstadoAsistencia> findByNombre(String nombre);
}
