package com.academit.education.repository;

import com.academit.education.model.MesaExamen;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MesaExamenRepository extends JpaRepository<MesaExamen, Integer> {

    List<MesaExamen> findByMateriaId(Integer idMateria);
}
