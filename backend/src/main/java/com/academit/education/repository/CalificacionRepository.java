package com.academit.education.repository;

import com.academit.education.model.Calificacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CalificacionRepository extends JpaRepository<Calificacion, Integer> {

    List<Calificacion> findByAlumnoId(Integer idAlumno);

    boolean existsByEvaluacionIdAndAlumnoId(Integer idEvaluacion, Integer idAlumno);
}
