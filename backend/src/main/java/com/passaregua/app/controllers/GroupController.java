package com.passaregua.app.controllers;

import com.passaregua.app.dtos.group.CreateGroupRequest;
import com.passaregua.app.dtos.group.GroupResponse;
import com.passaregua.app.services.GroupService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService service;

    /** Lê o e-mail salvo na sessão pelo AuthController (/api/auth/login). */
    private String requireEmail(HttpSession session) {
        Object e = session.getAttribute("USUARIO_EMAIL");
        if (e == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Não autenticado.");
        }
        return String.valueOf(e);
    }

    /** POST /api/groups  (criar grupo) */
    @PostMapping
    public GroupResponse create(@Valid @RequestBody CreateGroupRequest req, HttpSession session) {
        return service.create(requireEmail(session), req);
    }

    /** GET /api/groups/mine (listar meus grupos) */
    @GetMapping("/mine")
    public List<GroupResponse> mine(HttpSession session) {
        return service.myGroups(requireEmail(session));
    }

    /** GET /api/groups/{id} (detalhar 1 grupo — usado na edição) */
    @GetMapping("/{id}")
    public ResponseEntity<GroupResponse> getOne(@PathVariable Long id, HttpSession session) {
        GroupResponse resp = service.getOne(requireEmail(session), id);
        return ResponseEntity.ok(resp);
    }

    /** PUT /api/groups/{id} (editar — apenas dono) */
    @PutMapping("/{id}")
    public ResponseEntity<GroupResponse> update(@PathVariable Long id,
                                                @Valid @RequestBody CreateGroupRequest req,
                                                HttpSession session) {
        GroupResponse resp = service.update(requireEmail(session), id, req);
        return ResponseEntity.ok(resp);
    }

    /** DELETE /api/groups/{id} (excluir — apenas dono) */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id, HttpSession session) {
        service.delete(requireEmail(session), id);
        return ResponseEntity.noContent().build();
    }

    /** POST /api/groups/{id}/leave (sair) */
    @PostMapping("/{id}/leave")
    public ResponseEntity<Void> leave(@PathVariable Long id, HttpSession session) {
        service.leave(requireEmail(session), id);
        return ResponseEntity.noContent().build();
    }
}
