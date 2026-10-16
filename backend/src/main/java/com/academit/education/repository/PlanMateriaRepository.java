package com.academit.education.repository;

import com.academit.education.model.PlanMateria;
import com.academit.education.model.PlanMateriaId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlanMateriaRepository extends JpaRepository<PlanMateria, PlanMateriaId> {

    List<PlanMateria> findByPlanId(Integer idPlan);
}
