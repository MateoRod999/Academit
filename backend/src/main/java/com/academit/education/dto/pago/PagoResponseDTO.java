package com.academit.education.dto.pago;

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
public class PagoResponseDTO {

    private Integer idPago;
    private Integer idCuota;
    private Integer idUsuario;
    private LocalDate fecha;
    private BigDecimal importe;
    private Integer idMedioPago;
    private String medioPagoNombre;
    private String comprobante;
}
