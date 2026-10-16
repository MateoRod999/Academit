package com.academit.education.repository;

import com.academit.education.model.Rol;
import com.academit.education.model.enums.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RolRepository extends JpaRepository<Rol, Integer> {

    Optional<Rol> findByNombre(NombreRol nombre);
}
