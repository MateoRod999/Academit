package com.academit.education.repository;

import com.academit.education.model.Cuota;
import com.academit.education.model.enums.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

public interface CuotaRepository extends JpaRepository<Cuota, Integer> {

    List<Cuota> findByMatriculaId(Integer idMatricula);

    List<Cuota> findByMatriculaAlumnoId(Integer idAlumno);

    List<Cuota> findByMatriculaAlumnoIdAndEstadoIn(Integer idAlumno, Collection<EstadoCuota> estados);

    /** RF30 / RN07: pasa a VENCIDA las cuotas pendientes con vencimiento anterior a hoy. */
    @Modifying
    @Query("update Cuota c set c.estado = :nuevo where c.estado = :actual and c.fechaVencimiento < :hoy")
    int marcarVencidas(@Param("hoy") LocalDate hoy, @Param("actual") EstadoCuota actual, @Param("nuevo") EstadoCuota nuevo);
}
