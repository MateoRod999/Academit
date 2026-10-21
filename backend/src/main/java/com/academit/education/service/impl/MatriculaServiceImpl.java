package com.academit.education.service.impl;

import com.academit.education.dto.matricula.MatriculaResponseDTO;
import com.academit.education.exception.ResourceNotFoundException;
import com.academit.education.model.Cuota;
import com.academit.education.model.EstadoCuota;
import com.academit.education.model.EstadoMatricula;
import com.academit.education.model.Matricula;
import com.academit.education.model.enums.EstadoPagoEnum;
import com.academit.education.repository.CuotaRepository;
import com.academit.education.repository.EstadoCuotaRepository;
import com.academit.education.repository.EstadoMatriculaRepository;
import com.academit.education.repository.MatriculaRepository;
import com.academit.education.service.MatriculaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatriculaServiceImpl implements MatriculaService {

    private final MatriculaRepository matriculaRepository;
    private final CuotaRepository cuotaRepository;
    private final EstadoMatriculaRepository estadoMatriculaRepository;
    private final EstadoCuotaRepository estadoCuotaRepository;

    public MatriculaServiceImpl(MatriculaRepository matriculaRepository,
                                CuotaRepository cuotaRepository,
                                EstadoMatriculaRepository estadoMatriculaRepository,
                                EstadoCuotaRepository estadoCuotaRepository) {
        this.matriculaRepository = matriculaRepository;
        this.cuotaRepository = cuotaRepository;
        this.estadoMatriculaRepository = estadoMatriculaRepository;
        this.estadoCuotaRepository = estadoCuotaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public MatriculaResponseDTO obtenerPorId(Integer idMatricula) {
        Matricula matricula = matriculaRepository.findById(idMatricula)
                .orElseThrow(() -> new ResourceNotFoundException("Matrícula no encontrada con ID: " + idMatricula));
        List<Cuota> cuotas = cuotaRepository.findByMatriculaId(idMatricula);
        return toDTO(matricula, cuotas);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MatriculaResponseDTO> listarMatriculas() {
        return matriculaRepository.findAll().stream()
                .map(m -> {
                    List<Cuota> cuotas = cuotaRepository.findByMatriculaId(m.getId());
                    return toDTO(m, cuotas);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MatriculaResponseDTO cancelarMatricula(Integer idMatricula) {
        Matricula matricula = matriculaRepository.findById(idMatricula)
                .orElseThrow(() -> new ResourceNotFoundException("Matrícula no encontrada con ID: " + idMatricula));

        EstadoMatricula cancelada = estadoMatriculaRepository.findByNombre("CANCELADA")
                .orElseThrow(() -> new ResourceNotFoundException("Estado CANCELADA no encontrado"));
        matricula.setEstado(cancelada);
        matriculaRepository.save(matricula);

        EstadoCuota anulada = estadoCuotaRepository.findByNombre("ANULADA")
                .orElseThrow(() -> new ResourceNotFoundException("Estado ANULADA no encontrado"));

        List<Cuota> cuotas = cuotaRepository.findByMatriculaId(idMatricula);
        for (Cuota c : cuotas) {
            String est = c.getEstado() != null ? c.getEstado().getNombre() : "";
            if ("PENDIENTE".equalsIgnoreCase(est) || "VENCIDA".equalsIgnoreCase(est)) {
                c.setEstado(anulada);
                cuotaRepository.save(c);
            }
        }

        return toDTO(matricula, cuotas);
    }

    @Override
    public String calcularEstadoPago(List<Cuota> cuotas) {
        if (cuotas == null || cuotas.isEmpty()) {
            return EstadoPagoEnum.PENDIENTE.name();
        }

        LocalDate hoy = LocalDate.now();

        // Si hay al menos una cuota VENCIDA -> EN_MORA
        boolean tieneVencida = cuotas.stream().anyMatch(c -> {
            String estadoNombre = c.getEstado() != null ? c.getEstado().getNombre() : "";
            boolean marcadaVencida = "VENCIDA".equalsIgnoreCase(estadoNombre);
            boolean vencidaPorFecha = "PENDIENTE".equalsIgnoreCase(estadoNombre)
                    && c.getFechaVencimiento() != null
                    && c.getFechaVencimiento().isBefore(hoy);
            return marcadaVencida || vencidaPorFecha;
        });

        if (tieneVencida) {
            return EstadoPagoEnum.EN_MORA.name();
        }

        // Si todas las cuotas ya vencidas (o todas) están PAGADA -> AL_DIA
        long totalNoAnuladas = cuotas.stream()
                .filter(c -> !("ANULADA".equalsIgnoreCase(c.getEstado() != null ? c.getEstado().getNombre() : "")))
                .count();

        List<Cuota> cuotasExigibles = cuotas.stream()
                .filter(c -> !("ANULADA".equalsIgnoreCase(c.getEstado() != null ? c.getEstado().getNombre() : "")))
                .filter(c -> c.getFechaVencimiento() != null && !c.getFechaVencimiento().isAfter(hoy))
                .toList();

        if (totalNoAnuladas > 0) {
            boolean todasPagadas = cuotas.stream()
                    .filter(c -> !("ANULADA".equalsIgnoreCase(c.getEstado() != null ? c.getEstado().getNombre() : "")))
                    .allMatch(c -> "PAGADA".equalsIgnoreCase(c.getEstado() != null ? c.getEstado().getNombre() : ""));

            boolean todasExigiblesPagadas = !cuotasExigibles.isEmpty() && cuotasExigibles.stream()
                    .allMatch(c -> "PAGADA".equalsIgnoreCase(c.getEstado() != null ? c.getEstado().getNombre() : ""));

            if (todasPagadas || todasExigiblesPagadas) {
                return EstadoPagoEnum.AL_DIA.name();
            }
        }

        // En el resto -> PENDIENTE
        return EstadoPagoEnum.PENDIENTE.name();
    }

    private MatriculaResponseDTO toDTO(Matricula m, List<Cuota> cuotas) {
        String estadoPagoCalculado = calcularEstadoPago(cuotas);

        String alumnoNombre = "";
        if (m.getAlumno() != null) {
            alumnoNombre = m.getAlumno().getNombre() + " " + m.getAlumno().getApellido();
        }

        return MatriculaResponseDTO.builder()
                .idMatricula(m.getId())
                .idAlumno(m.getAlumno() != null ? m.getAlumno().getId() : null)
                .alumnoNombre(alumnoNombre)
                .idCiclo(m.getCiclo() != null ? m.getCiclo().getId() : null)
                .cicloAnio(m.getCiclo() != null ? m.getCiclo().getAnio() : null)
                .fecha(m.getFecha())
                .importe(m.getImporte())
                .estado(m.getEstado() != null ? m.getEstado().getNombre() : "PENDIENTE")
                .estadoPago(estadoPagoCalculado)
                .build();
    }
}
