package com.academit.education.repository;

import com.academit.education.model.Solicitud;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SolicitudRepository extends JpaRepository<Solicitud, Integer> {

    List<Solicitud> findByAlumnoId(Integer idAlumno);

    List<Solicitud> findByEstado(String estado);
}
