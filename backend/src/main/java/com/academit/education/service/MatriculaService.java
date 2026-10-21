package com.academit.education.service;

import com.academit.education.dto.matricula.MatriculaResponseDTO;
import com.academit.education.model.Cuota;
import com.academit.education.model.Matricula;

import java.util.List;

public interface MatriculaService {

    MatriculaResponseDTO obtenerPorId(Integer idMatricula);

    List<MatriculaResponseDTO> listarMatriculas();

    MatriculaResponseDTO cancelarMatricula(Integer idMatricula);

    String calcularEstadoPago(List<Cuota> cuotas);
}
