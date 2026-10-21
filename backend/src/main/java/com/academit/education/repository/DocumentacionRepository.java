package com.academit.education.repository;

import com.academit.education.model.Documentacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentacionRepository extends JpaRepository<Documentacion, Integer> {

    List<Documentacion> findByAlumnoId(Integer idAlumno);

    List<Documentacion> findByEstado(String estado);
}
