package com.passaregua.app.controllers;

import com.passaregua.app.models.Notification;
import com.passaregua.app.repositories.NotificationRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository repo;

    private String requireEmail(HttpSession session) {
        Object e = session.getAttribute("USUARIO_EMAIL");
        if (e == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Nao autenticado");
        return String.valueOf(e);
    }

    @GetMapping
    public List<Notification> list(HttpSession session) {
        String email = requireEmail(session);
        return repo.findByUserEmailOrderByCreatedAtDesc(email);
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<?> markRead(@PathVariable Long id, HttpSession session) {
        String email = requireEmail(session);
        Notification n = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!n.getUserEmail().equalsIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        if (n.getReadAt() == null) {
            n.setReadAt(Instant.now());
            repo.save(n);
        }
        return ResponseEntity.ok().build();
    }
}

