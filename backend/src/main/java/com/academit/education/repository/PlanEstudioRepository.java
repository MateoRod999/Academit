package com.academit.education.repository;

import com.academit.education.model.PlanEstudio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlanEstudioRepository extends JpaRepository<PlanEstudio, Integer> {

    List<PlanEstudio> findByCarreraId(Integer idCarrera);
}
