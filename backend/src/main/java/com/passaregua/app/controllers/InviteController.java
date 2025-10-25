package com.passaregua.app.controllers;

import com.passaregua.app.repositories.UsuarioRepository;
import com.passaregua.app.services.InviteService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class InviteController {

    private final InviteService inviteService;
    private final UsuarioRepository usuarioRepository;

    private String requireEmail(HttpSession session) {
        Object e = session.getAttribute("USUARIO_EMAIL");
        if (e == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Nao autenticado");
        }
        return String.valueOf(e);
    }

    // POST /api/groups/{id}/invites => cria link unico
    @PostMapping("/api/groups/{id}/invites")
    public Map<String, String> createLink(@PathVariable("id") Long groupId, HttpSession session) {
        String email = requireEmail(session);
        return inviteService.createLink(email, groupId);
    }

    // POST /api/groups/{id}/invite => envia convites
    @PostMapping("/api/groups/{id}/invite")
    public ResponseEntity<?> inviteUsers(@PathVariable("id") Long groupId,
                                         @RequestBody Map<String, List<String>> body,
                                         HttpSession session) {
        String email = requireEmail(session);
        List<String> userIds = body.getOrDefault("userIds", List.of());
        // converter ids para emails via UsuarioRepository; se ja forem emails, mantem
        List<String> emails = userIds.stream().map(idOrEmail -> {
            try {
                Long id = Long.valueOf(idOrEmail);
                return usuarioRepository.findById(id).map(u -> u.getEmail()).orElse(idOrEmail);
            } catch (NumberFormatException nfe) {
                return idOrEmail;
            }
        }).toList();
        inviteService.inviteUsers(email, groupId, emails);
        return ResponseEntity.ok().build();
    }

    // GET /api/invites/{inviteId}
    @GetMapping("/api/invites/{inviteId}")
    public ResponseEntity<?> getInvite(@PathVariable String inviteId, HttpSession session) {
        Object email = session.getAttribute("USUARIO_EMAIL");
        if (email == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(inviteService.getInviteInfo(inviteId));
    }

    // POST /api/invites/{inviteId}/accept
    @PostMapping("/api/invites/{inviteId}/accept")
    public ResponseEntity<?> accept(@PathVariable String inviteId, HttpSession session) {
        String email = requireEmail(session);
        inviteService.accept(email, inviteId);
        return ResponseEntity.ok().build();
    }

    // POST /api/invites/{inviteId}/decline
    @PostMapping("/api/invites/{inviteId}/decline")
    public ResponseEntity<?> decline(@PathVariable String inviteId, HttpSession session) {
        String email = requireEmail(session);
        inviteService.decline(email, inviteId);
        return ResponseEntity.ok().build();
    }
}

