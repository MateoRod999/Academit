package com.academit.education.repository;

import com.academit.education.model.Asistencia;
import com.academit.education.model.enums.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AsistenciaRepository extends JpaRepository<Asistencia, Integer> {

    List<Asistencia> findByAlumnoIdAndCursoId(Integer idAlumno, Integer idCurso);

    boolean existsByAlumnoIdAndCursoIdAndFecha(Integer idAlumno, Integer idCurso, LocalDate fecha);

    long countByAlumnoIdAndCursoIdAndEstado(Integer idAlumno, Integer idCurso, EstadoAsistencia estado);
}
