package com.academit.education.repository;

import com.academit.education.model.TipoCuota;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TipoCuotaRepository extends JpaRepository<TipoCuota, Integer> {

    Optional<TipoCuota> findByNombre(String nombre);
}
