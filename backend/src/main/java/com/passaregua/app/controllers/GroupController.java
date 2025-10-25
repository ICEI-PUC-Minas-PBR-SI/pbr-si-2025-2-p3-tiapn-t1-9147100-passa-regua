package com.passaregua.app.controllers;

import com.passaregua.app.dtos.group.CreateGroupRequest;
import com.passaregua.app.dtos.group.GroupResponse;
import com.passaregua.app.dtos.group.GroupMemberResponse;
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

    // GET /api/groups/{id}/members
    @GetMapping("/{id}/members")
    public ResponseEntity<java.util.List<GroupMemberResponse>> members(@PathVariable Long id, HttpSession session) {
        var list = service.listMembers(requireEmail(session), id);
        return ResponseEntity.ok(list);
    }

    // POST /api/groups/{id}/members/{email}/role  body: { role: "ADMIN"|"MEMBER" }
    @PostMapping("/{id}/members/{email}/role")
    public ResponseEntity<Void> setRole(@PathVariable Long id,
                                        @PathVariable String email,
                                        @RequestBody java.util.Map<String, String> body,
                                        HttpSession session) {
        String role = body.getOrDefault("role", "MEMBER");
        service.setMemberRole(requireEmail(session), id, email, role);
        return ResponseEntity.ok().build();
    }

    // DELETE /api/groups/{id}/members/{email}
    @DeleteMapping("/{id}/members/{email}")
    public ResponseEntity<Void> removeMember(@PathVariable Long id,
                                             @PathVariable String email,
                                             HttpSession session) {
        service.removeMember(requireEmail(session), id, email);
        return ResponseEntity.noContent().build();
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

    // Cover image endpoints removed (no longer supported)
}
