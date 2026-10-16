package com.academit.education.repository;

import com.academit.education.model.Docente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DocenteRepository extends JpaRepository<Docente, Integer> {

    boolean existsByDni(String dni);

    Optional<Docente> findByDni(String dni);

    Page<Docente> findByDniContainingOrApellidoContainingIgnoreCaseOrNombreContainingIgnoreCase(
            String dni, String apellido, String nombre, Pageable pageable);
}
