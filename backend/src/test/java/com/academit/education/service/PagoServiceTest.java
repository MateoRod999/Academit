package com.academit.education.service;

import com.academit.education.dto.pago.PagoRequestDTO;
import com.academit.education.dto.pago.PagoResponseDTO;
import com.academit.education.exception.BusinessRuleException;
import com.academit.education.model.*;
import com.academit.education.repository.*;
import com.academit.education.service.impl.PagoServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PagoServiceTest {

    @Mock
    private PagoRepository pagoRepository;

    @Mock
    private CuotaRepository cuotaRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private MedioPagoRepository medioPagoRepository;

    @Mock
    private EstadoCuotaRepository estadoCuotaRepository;

    private PagoService pagoService;

    @BeforeEach
    void setUp() {
        pagoService = new PagoServiceImpl(
                pagoRepository,
                cuotaRepository,
                usuarioRepository,
                medioPagoRepository,
                estadoCuotaRepository
        );
    }

    @Test
    void testGenerarComprobanteFormatoValido() {
        String comprobante = pagoService.generarComprobante(2026, 123);
        assertEquals("2026-000123", comprobante);
    }

    @Test
    void testRegistrarPagoExitosoAsignaComprobanteYActualizaCuota() {
        Cuota cuota = new Cuota();
        cuota.setId(5);
        cuota.setImporte(new BigDecimal("12000.00"));
        EstadoCuota pendiente = new EstadoCuota();
        pendiente.setNombre("PENDIENTE");
        cuota.setEstado(pendiente);

        Usuario usuario = new Usuario();
        usuario.setUsername("administrativo");

        MedioPago medioPago = new MedioPago();
        medioPago.setId(1);
        medioPago.setNombre("EFECTIVO");

        EstadoCuota pagada = new EstadoCuota();
        pagada.setNombre("PAGADA");

        when(cuotaRepository.findById(5)).thenReturn(Optional.of(cuota));
        when(usuarioRepository.findByUsername("administrativo")).thenReturn(Optional.of(usuario));
        when(medioPagoRepository.findById(1)).thenReturn(Optional.of(medioPago));
        when(estadoCuotaRepository.findByNombre("PAGADA")).thenReturn(Optional.of(pagada));

        when(pagoRepository.saveAndFlush(any(Pago.class))).thenAnswer(invocation -> {
            Pago p = invocation.getArgument(0);
            p.setId(42);
            return p;
        });

        when(pagoRepository.save(any(Pago.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PagoRequestDTO request = PagoRequestDTO.builder()
                .idCuota(5)
                .idMedioPago(1)
                .importe(new BigDecimal("12000.00"))
                .build();

        PagoResponseDTO response = pagoService.registrarPago("administrativo", request);

        assertNotNull(response);
        assertEquals("PAGADA", cuota.getEstado().getNombre());
        assertEquals("2026-000042", response.getComprobante());
        verify(cuotaRepository).save(cuota);
    }

    @Test
    void testRegistrarPagoParcialLanzaBusinessRuleException() {
        Cuota cuota = new Cuota();
        cuota.setId(5);
        cuota.setImporte(new BigDecimal("12000.00"));
        EstadoCuota pendiente = new EstadoCuota();
        pendiente.setNombre("PENDIENTE");
        cuota.setEstado(pendiente);

        when(cuotaRepository.findById(5)).thenReturn(Optional.of(cuota));

        PagoRequestDTO request = PagoRequestDTO.builder()
                .idCuota(5)
                .idMedioPago(1)
                .importe(new BigDecimal("6000.00")) // Pago parcial rechazado
                .build();

        assertThrows(BusinessRuleException.class, () ->
                pagoService.registrarPago("administrativo", request));
    }
}
