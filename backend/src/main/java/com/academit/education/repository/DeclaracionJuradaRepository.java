package com.academit.education.repository;

import com.academit.education.model.DeclaracionJurada;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeclaracionJuradaRepository extends JpaRepository<DeclaracionJurada, Integer> {

    boolean existsByAlumnoIdAndCicloId(Integer idAlumno, Integer idCiclo);
}
