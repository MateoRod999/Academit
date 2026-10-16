package com.academit.education.repository;

import com.academit.education.model.Curso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CursoRepository extends JpaRepository<Curso, Integer> {

    List<Curso> findByCicloId(Integer idCiclo);
}
