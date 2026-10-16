package com.academit.education.repository;

import com.academit.education.model.Materia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MateriaRepository extends JpaRepository<Materia, Integer> {

    boolean existsByNombre(String nombre);
}
