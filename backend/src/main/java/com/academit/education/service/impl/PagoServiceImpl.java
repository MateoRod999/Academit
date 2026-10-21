package com.academit.education.service.impl;

import com.academit.education.dto.pago.PagoRequestDTO;
import com.academit.education.dto.pago.PagoResponseDTO;
import com.academit.education.exception.BusinessRuleException;
import com.academit.education.exception.ResourceNotFoundException;
import com.academit.education.model.Cuota;
import com.academit.education.model.EstadoCuota;
import com.academit.education.model.MedioPago;
import com.academit.education.model.Pago;
import com.academit.education.model.Usuario;
import com.academit.education.repository.CuotaRepository;
import com.academit.education.repository.EstadoCuotaRepository;
import com.academit.education.repository.MedioPagoRepository;
import com.academit.education.repository.PagoRepository;
import com.academit.education.repository.UsuarioRepository;
import com.academit.education.service.PagoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PagoServiceImpl implements PagoService {

    private final PagoRepository pagoRepository;
    private final CuotaRepository cuotaRepository;
    private final UsuarioRepository usuarioRepository;
    private final MedioPagoRepository medioPagoRepository;
    private final EstadoCuotaRepository estadoCuotaRepository;

    public PagoServiceImpl(PagoRepository pagoRepository,
                           CuotaRepository cuotaRepository,
                           UsuarioRepository usuarioRepository,
                           MedioPagoRepository medioPagoRepository,
                           EstadoCuotaRepository estadoCuotaRepository) {
        this.pagoRepository = pagoRepository;
        this.cuotaRepository = cuotaRepository;
        this.usuarioRepository = usuarioRepository;
        this.medioPagoRepository = medioPagoRepository;
        this.estadoCuotaRepository = estadoCuotaRepository;
    }

    @Override
    @Transactional
    public PagoResponseDTO registrarPago(String username, PagoRequestDTO request) {
        Cuota cuota = cuotaRepository.findById(request.getIdCuota())
                .orElseThrow(() -> new ResourceNotFoundException("Cuota no encontrada con ID: " + request.getIdCuota()));

        String estadoActual = cuota.getEstado() != null ? cuota.getEstado().getNombre() : "";
        if ("PAGADA".equalsIgnoreCase(estadoActual)) {
            throw new BusinessRuleException("La cuota ya se encuentra pagada");
        }
        if ("ANULADA".equalsIgnoreCase(estadoActual)) {
            throw new BusinessRuleException("No se puede registrar pago sobre una cuota anulada");
        }

        // RN09: No se admiten pagos parciales, debe ser por el importe completo de la cuota
        if (request.getImporte().compareTo(cuota.getImporte()) != 0) {
            throw new BusinessRuleException(String.format("El importe del pago ($%s) debe ser igual al importe de la cuota ($%s)",
                    request.getImporte(), cuota.getImporte()));
        }

        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + username));

        MedioPago medioPago = medioPagoRepository.findById(request.getIdMedioPago())
                .orElseThrow(() -> new ResourceNotFoundException("Medio de pago no encontrado con ID: " + request.getIdMedioPago()));

        LocalDate fechaPago = LocalDate.now();

        Pago pago = new Pago();
        pago.setCuota(cuota);
        pago.setUsuario(usuario);
        pago.setFecha(fechaPago);
        pago.setImporte(request.getImporte());
        pago.setMedioPago(medioPago);
        // Marcador temporal único para persistir y obtener el ID generado
        pago.setComprobante("TMP-" + UUID.randomUUID().toString().substring(0, 7));

        pago = pagoRepository.saveAndFlush(pago);

        // Formato oficial AAAA-NNNNNN (ej. 2026-000123)
        String comprobanteOficial = generarComprobante(fechaPago.getYear(), pago.getId());
        pago.setComprobante(comprobanteOficial);
        pago = pagoRepository.save(pago);

        // Actualizar cuota a PAGADA
        EstadoCuota pagada = estadoCuotaRepository.findByNombre("PAGADA")
                .orElseThrow(() -> new ResourceNotFoundException("Estado PAGADA no encontrado"));
        cuota.setEstado(pagada);
        cuotaRepository.save(cuota);

        return toDTO(pago);
    }

    @Override
    @Transactional(readOnly = true)
    public PagoResponseDTO obtenerPorId(Integer idPago) {
        Pago pago = pagoRepository.findById(idPago)
                .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado con ID: " + idPago));
        return toDTO(pago);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PagoResponseDTO> listarPagos() {
        return pagoRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public String generarComprobante(Integer anio, Integer idPago) {
        int year = (anio != null) ? anio : LocalDate.now().getYear();
        int id = (idPago != null) ? idPago : 0;
        return String.format("%04d-%06d", year, id);
    }

    private PagoResponseDTO toDTO(Pago pago) {
        return PagoResponseDTO.builder()
                .idPago(pago.getId())
                .idCuota(pago.getCuota() != null ? pago.getCuota().getId() : null)
                .idUsuario(pago.getUsuario() != null ? pago.getUsuario().getId() : null)
                .fecha(pago.getFecha())
                .importe(pago.getImporte())
                .idMedioPago(pago.getMedioPago() != null ? pago.getMedioPago().getId() : null)
                .medioPagoNombre(pago.getMedioPago() != null ? pago.getMedioPago().getNombre() : "")
                .comprobante(pago.getComprobante())
                .build();
    }
}
