package com.passaregua.app.services;

import com.passaregua.app.dtos.group.CreateGroupRequest;
import com.passaregua.app.dtos.group.GroupResponse;
import com.passaregua.app.models.Group;
import com.passaregua.app.repositories.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository repo;

    /** Criar grupo */
    public GroupResponse create(String ownerEmail, CreateGroupRequest req) {
        Group g = Group.builder()
                .name(req.getName().trim())
                .description(req.getDescription())
                .ownerEmail(ownerEmail)
                .build();
        g = repo.save(g);
        return toDto(g, ownerEmail);
    }

    /** Listar grupos do dono (versão mínima) */
    public List<GroupResponse> myGroups(String email) {
        return repo.findByOwnerEmailOrderByCreatedAtDesc(email)
                .stream()
                .map(g -> toDto(g, email))
                .toList();
    }

    /** Carregar 1 grupo (usado na edição) */
    public GroupResponse getOne(String email, Long id) {
        Group g = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo não encontrado"));

        if (!g.getOwnerEmail().equalsIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Sem permissão");
        }
        return toDto(g, email);
    }

    /** Atualizar grupo (apenas dono) */
    public GroupResponse update(String email, Long id, CreateGroupRequest req) {
        Group g = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo não encontrado"));

        if (!g.getOwnerEmail().equalsIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Sem permissão");
        }

        // aplica alterações (simples)
        g.setName(req.getName() == null ? g.getName() : req.getName().trim());
        g.setDescription(req.getDescription()); // null é válido se quiser limpar

        g = repo.save(g);
        return toDto(g, email);
    }

    /** Excluir grupo (apenas dono) */
    public void delete(String email, Long id) {
        Group g = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo não encontrado"));

        if (!g.getOwnerEmail().equalsIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Somente o dono pode excluir");
        }
        repo.delete(g);
    }

    /** “Sair” (no mínimo atual não há membros; no-op) */
    public void leave(String email, Long id) {
        // no-op nesta versão
    }

    /** Mapper para resposta */
    private GroupResponse toDto(Group g, String email) {
        return GroupResponse.builder()
                .id(g.getId())
                .name(g.getName())
                .description(g.getDescription())
                .owner(g.getOwnerEmail().equalsIgnoreCase(email))
                .build();
    }
}
