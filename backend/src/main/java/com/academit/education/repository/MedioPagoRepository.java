package com.academit.education.repository;

import com.academit.education.model.MedioPago;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MedioPagoRepository extends JpaRepository<MedioPago, Integer> {

    Optional<MedioPago> findByNombre(String nombre);
}
