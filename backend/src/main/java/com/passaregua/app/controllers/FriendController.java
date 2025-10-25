package com.passaregua.app.controllers;

import com.passaregua.app.models.Usuario;
import com.passaregua.app.services.FriendService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/friends")
@RequiredArgsConstructor
public class FriendController {

    private final FriendService friendService;
    private final com.passaregua.app.repositories.UsuarioRepository usuarioRepository;

    private String requireEmail(HttpSession session) {
        Object e = session.getAttribute("USUARIO_EMAIL");
        if (e == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Nao autenticado");
        }
        return String.valueOf(e);
    }

    @GetMapping
    public ResponseEntity<?> list(HttpSession session) {
        String email = requireEmail(session);
        List<Usuario> amigos = friendService.listFriends(email);
        // Normaliza retorno simples id/name/email
        return ResponseEntity.ok(
                amigos.stream().map(u -> Map.of(
                        "id", u.getId(),
                        "name", String.format("%s %s",
                                u.getPrimeiroNome() != null ? u.getPrimeiroNome() : "",
                                u.getUltimoNome() != null ? u.getUltimoNome() : "").trim(),
                        "email", u.getEmail()
                )).toList()
        );
    }

    @DeleteMapping("/{identifier}")
    public ResponseEntity<?> remove(@PathVariable String identifier, HttpSession session) {
        String me = requireEmail(session);
        String friendEmail;
        try {
            Long id = Long.valueOf(identifier);
            friendEmail = usuarioRepository.findById(id).map(Usuario::getEmail)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario nao encontrado"));
        } catch (NumberFormatException nfe) {
            friendEmail = identifier;
        }
        friendService.removeFriendshipBothSides(me, friendEmail);
        return ResponseEntity.noContent().build();
    }
}
