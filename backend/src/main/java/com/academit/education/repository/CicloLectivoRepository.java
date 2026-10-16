package com.academit.education.repository;

import com.academit.education.model.CicloLectivo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CicloLectivoRepository extends JpaRepository<CicloLectivo, Integer> {

    Optional<CicloLectivo> findByAnio(Integer anio);

    boolean existsByAnio(Integer anio);
}
