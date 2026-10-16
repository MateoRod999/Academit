package com.academit.education.repository;

import com.academit.education.model.Carrera;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarreraRepository extends JpaRepository<Carrera, Integer> {

    boolean existsByNombre(String nombre);
}
