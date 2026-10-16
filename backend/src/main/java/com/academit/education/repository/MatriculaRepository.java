package com.academit.education.repository;

import com.academit.education.model.Matricula;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatriculaRepository extends JpaRepository<Matricula, Integer> {

    boolean existsByAlumnoIdAndCicloId(Integer idAlumno, Integer idCiclo);

    List<Matricula> findByAlumnoId(Integer idAlumno);

    List<Matricula> findByCicloId(Integer idCiclo);
}
