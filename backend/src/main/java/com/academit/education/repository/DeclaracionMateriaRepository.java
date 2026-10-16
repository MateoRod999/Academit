package com.academit.education.repository;

import com.academit.education.model.DeclaracionMateria;
import com.academit.education.model.DeclaracionMateriaId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeclaracionMateriaRepository extends JpaRepository<DeclaracionMateria, DeclaracionMateriaId> {
}
