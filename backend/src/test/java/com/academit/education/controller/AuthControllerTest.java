package com.academit.education.controller;

import com.academit.education.dto.auth.AuthMeResponseDTO;
import com.academit.education.dto.auth.LoginRequestDTO;
import com.academit.education.dto.auth.LoginResponseDTO;
import com.academit.education.dto.auth.UsuarioSesionDTO;
import com.academit.education.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthService authService;

    @Test
    void testLoginSuccessReturns200AndToken() throws Exception {
        UsuarioSesionDTO usuarioDto = UsuarioSesionDTO.builder()
                .idUsuario(1)
                .username("admin")
                .nombre("Administrador General")
                .rol("ADMINISTRADOR")
                .build();

        LoginResponseDTO mockResponse = LoginResponseDTO.builder()
                .usuario(usuarioDto)
                .token("mocked.jwt.token")
                .build();

        when(authService.login(any(LoginRequestDTO.class))).thenReturn(mockResponse);

        String json = "{\"username\":\"admin\",\"password\":\"Academit123\"}";

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.usuario.idUsuario").value(1))
                .andExpect(jsonPath("$.usuario.username").value("admin"))
                .andExpect(jsonPath("$.usuario.rol").value("ADMINISTRADOR"))
                .andExpect(jsonPath("$.token").value("mocked.jwt.token"));
    }

    @Test
    void testLoginInvalidCredentialsReturns401WithApiError() throws Exception {
        when(authService.login(any(LoginRequestDTO.class)))
                .thenThrow(new BadCredentialsException("Credenciales inválidas"));

        String json = "{\"username\":\"admin\",\"password\":\"wrong\"}";

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.message").value("Credenciales inválidas"));
    }

    @Test
    void testLoginEmptyFieldsReturns400ValidationError() throws Exception {
        String json = "{\"username\":\"\",\"password\":\"\"}";

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Error de validación en los datos enviados"))
                .andExpect(jsonPath("$.errors").isArray())
                .andExpect(jsonPath("$.errors[0].campo").exists())
                .andExpect(jsonPath("$.errors[0].mensaje").exists());
    }

    @Test
    void testLogoutReturns204NoContent() throws Exception {
        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMINISTRADOR"})
    void testMeAuthenticatedReturns200AndUsuario() throws Exception {
        UsuarioSesionDTO usuarioDto = UsuarioSesionDTO.builder()
                .idUsuario(1)
                .username("admin")
                .nombre("Administrador General")
                .rol("ADMINISTRADOR")
                .build();

        when(authService.getMe("admin")).thenReturn(new AuthMeResponseDTO(usuarioDto));

        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.usuario.idUsuario").value(1))
                .andExpect(jsonPath("$.usuario.username").value("admin"))
                .andExpect(jsonPath("$.usuario.rol").value("ADMINISTRADOR"));
    }
}
