package com.academit.education.repository;

import com.academit.education.model.EstadoCuota;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EstadoCuotaRepository extends JpaRepository<EstadoCuota, Integer> {

    Optional<EstadoCuota> findByNombre(String nombre);
}
