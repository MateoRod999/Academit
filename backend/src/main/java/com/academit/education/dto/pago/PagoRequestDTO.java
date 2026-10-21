package com.academit.education.dto.pago;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PagoRequestDTO {

    @NotNull(message = "El ID de la cuota es obligatorio")
    private Integer idCuota;

    @NotNull(message = "El importe es obligatorio")
    @Positive(message = "El importe debe ser mayor a 0")
    private BigDecimal importe;

    @NotNull(message = "El ID del medio de pago es obligatorio")
    private Integer idMedioPago;
}
