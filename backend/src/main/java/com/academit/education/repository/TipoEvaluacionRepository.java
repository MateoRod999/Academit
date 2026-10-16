package com.academit.education.repository;

import com.academit.education.model.TipoEvaluacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TipoEvaluacionRepository extends JpaRepository<TipoEvaluacion, Integer> {

    Optional<TipoEvaluacion> findByNombre(String nombre);
}
