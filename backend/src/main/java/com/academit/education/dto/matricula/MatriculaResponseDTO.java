package com.academit.education.dto.matricula;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatriculaResponseDTO {

    private Integer idMatricula;
    private Integer idAlumno;
    private String alumnoNombre;
    private Integer idCiclo;
    private Integer cicloAnio;
    private LocalDate fecha;
    private BigDecimal importe;
    private String estado;
    private String estadoPago;
}
