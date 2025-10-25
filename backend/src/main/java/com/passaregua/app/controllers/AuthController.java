package com.passaregua.app.controllers;

import com.passaregua.app.dtos.auth.*;
import com.passaregua.app.services.AuthService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
// @CrossOrigin(origins = "*") // NÃO precisa: já temos CorsConfig global com credentials
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public RegisterResponse register(@Valid @RequestBody RegisterRequest req) {
        return authService.register(req);
    }

    @PostMapping("/2fa/send")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void sendCode(@Valid @RequestBody SendCodeRequest req) {
        authService.sendCode(req);
    }

    @PostMapping("/2fa/verify")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void verify(@Valid @RequestBody VerifyCodeRequest req) {
        authService.verifyCode(req);
    }

    // LOGIN: grava apenas o e-mail na HttpSession
    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest req, HttpSession session) {
        LoginResponse resp = authService.login(req);
        session.setAttribute("USUARIO_EMAIL", req.getEmail()); // suficiente para /me
        return resp;
    }

    // PERFIL: responde 200 se tiver e-mail na sessão
    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession session) {
        Object email = session.getAttribute("USUARIO_EMAIL");
        if (email == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(Map.of(
            "id",        "",                 // opcional agora
            "email",     String.valueOf(email),
            "firstName", "Usuário"           // opcional agora
        ));
    }
}
