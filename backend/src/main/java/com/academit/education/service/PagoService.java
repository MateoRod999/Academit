package com.academit.education.service;

import com.academit.education.dto.pago.PagoRequestDTO;
import com.academit.education.dto.pago.PagoResponseDTO;
import com.academit.education.model.Pago;

import java.util.List;

public interface PagoService {

    PagoResponseDTO registrarPago(String username, PagoRequestDTO request);

    PagoResponseDTO obtenerPorId(Integer idPago);

    List<PagoResponseDTO> listarPagos();

    String generarComprobante(Integer anio, Integer idPago);
}
