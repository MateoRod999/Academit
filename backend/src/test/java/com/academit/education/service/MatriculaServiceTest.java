package com.academit.education.service;

import com.academit.education.dto.matricula.MatriculaResponseDTO;
import com.academit.education.model.Cuota;
import com.academit.education.model.EstadoCuota;
import com.academit.education.model.EstadoMatricula;
import com.academit.education.model.Matricula;
import com.academit.education.repository.CuotaRepository;
import com.academit.education.repository.EstadoCuotaRepository;
import com.academit.education.repository.EstadoMatriculaRepository;
import com.academit.education.repository.MatriculaRepository;
import com.academit.education.service.impl.MatriculaServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MatriculaServiceTest {

    @Mock
    private MatriculaRepository matriculaRepository;

    @Mock
    private CuotaRepository cuotaRepository;

    @Mock
    private EstadoMatriculaRepository estadoMatriculaRepository;

    @Mock
    private EstadoCuotaRepository estadoCuotaRepository;

    private MatriculaService matriculaService;

    @BeforeEach
    void setUp() {
        matriculaService = new MatriculaServiceImpl(
                matriculaRepository,
                cuotaRepository,
                estadoMatriculaRepository,
                estadoCuotaRepository
        );
    }

    private Cuota crearCuota(String estadoNombre, LocalDate fechaVencimiento) {
        Cuota c = new Cuota();
        EstadoCuota ec = new EstadoCuota();
        ec.setNombre(estadoNombre);
        c.setEstado(ec);
        c.setFechaVencimiento(fechaVencimiento);
        return c;
    }

    @Test
    void testCalcularEstadoPagoEnMoraCuandoHayCuotaVencida() {
        List<Cuota> cuotas = List.of(
                crearCuota("PAGADA", LocalDate.now().minusMonths(2)),
                crearCuota("VENCIDA", LocalDate.now().minusMonths(1)),
                crearCuota("PENDIENTE", LocalDate.now().plusMonths(1))
        );

        String estadoPago = matriculaService.calcularEstadoPago(cuotas);
        assertEquals("EN_MORA", estadoPago);
    }

    @Test
    void testCalcularEstadoPagoAlDiaCuandoTodasLasVencidasEstanPagadas() {
        List<Cuota> cuotas = List.of(
                crearCuota("PAGADA", LocalDate.now().minusMonths(2)),
                crearCuota("PAGADA", LocalDate.now().minusMonths(1)),
                crearCuota("PENDIENTE", LocalDate.now().plusMonths(1))
        );

        String estadoPago = matriculaService.calcularEstadoPago(cuotas);
        assertEquals("AL_DIA", estadoPago);
    }

    @Test
    void testCalcularEstadoPagoPendienteCuandoNoHayExigiblesVencidas() {
        List<Cuota> cuotas = List.of(
                crearCuota("PENDIENTE", LocalDate.now().plusMonths(1)),
                crearCuota("PENDIENTE", LocalDate.now().plusMonths(2))
        );

        String estadoPago = matriculaService.calcularEstadoPago(cuotas);
        assertEquals("PENDIENTE", estadoPago);
    }

    @Test
    void testCancelarMatriculaPasaCuotasPendientesAAnulada() {
        Matricula matricula = new Matricula();
        matricula.setId(10);
        EstadoMatricula activa = new EstadoMatricula();
        activa.setNombre("ACTIVA");
        matricula.setEstado(activa);

        EstadoMatricula cancelada = new EstadoMatricula();
        cancelada.setNombre("CANCELADA");

        EstadoCuota anulada = new EstadoCuota();
        anulada.setNombre("ANULADA");

        Cuota cuota1 = crearCuota("PENDIENTE", LocalDate.now().plusMonths(1));
        Cuota cuota2 = crearCuota("PAGADA", LocalDate.now().minusMonths(1));

        when(matriculaRepository.findById(10)).thenReturn(Optional.of(matricula));
        when(estadoMatriculaRepository.findByNombre("CANCELADA")).thenReturn(Optional.of(cancelada));
        when(estadoCuotaRepository.findByNombre("ANULADA")).thenReturn(Optional.of(anulada));
        when(cuotaRepository.findByMatriculaId(10)).thenReturn(new ArrayList<>(List.of(cuota1, cuota2)));

        MatriculaResponseDTO response = matriculaService.cancelarMatricula(10);

        assertEquals("CANCELADA", response.getEstado());
        assertEquals("ANULADA", cuota1.getEstado().getNombre());
        assertEquals("PAGADA", cuota2.getEstado().getNombre());
        verify(cuotaRepository).save(cuota1);
        verify(cuotaRepository, never()).save(cuota2);
    }
}
