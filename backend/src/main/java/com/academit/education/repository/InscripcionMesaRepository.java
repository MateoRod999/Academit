package com.academit.education.repository;

import com.academit.education.model.InscripcionMesa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InscripcionMesaRepository extends JpaRepository<InscripcionMesa, Integer> {

    long countByMesaIdAndActivaTrue(Integer idMesa);

    boolean existsByMesaIdAndAlumnoIdAndActivaTrue(Integer idMesa, Integer idAlumno);
}
