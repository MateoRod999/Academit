package com.academit.education.repository;

import com.academit.education.model.Correlativa;
import com.academit.education.model.CorrelativaId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CorrelativaRepository extends JpaRepository<Correlativa, CorrelativaId> {

    List<Correlativa> findByIdIdPlanAndIdIdMateria(Integer idPlan, Integer idMateria);
}
