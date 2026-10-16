package com.academit.education.repository;

import com.academit.education.model.CursoMateria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CursoMateriaRepository extends JpaRepository<CursoMateria, Integer> {

    List<CursoMateria> findByCursoId(Integer idCurso);

    List<CursoMateria> findByDocenteId(Integer idDocente);
}
