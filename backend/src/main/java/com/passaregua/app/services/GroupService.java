package com.passaregua.app.services;

import com.passaregua.app.dtos.group.CreateGroupRequest;
import com.passaregua.app.dtos.group.GroupMemberResponse;
import com.passaregua.app.dtos.group.GroupResponse;
import com.passaregua.app.models.Group;
import com.passaregua.app.models.GroupMember;
import com.passaregua.app.repositories.GroupMemberRepository;
import com.passaregua.app.repositories.GroupRepository;
import com.passaregua.app.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository repo;
    private final GroupMemberRepository memberRepo;
    private final UsuarioRepository usuarioRepository;

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

    /** Listar grupos do dono (versao minima) */
    public List<GroupResponse> myGroups(String email) {
        var ownerGroups = repo.findByOwnerEmailOrderByCreatedAtDesc(email);
        var memberships = memberRepo.findByMemberEmail(email);
        var memberGroupIds = memberships.stream().map(GroupMember::getGroupId).toList();
        var asMember = repo.findAllById(memberGroupIds);

        LinkedHashMap<Long, Group> map = new LinkedHashMap<>();
        for (Group g : ownerGroups) map.put(g.getId(), g);
        for (Group g : asMember) map.putIfAbsent(g.getId(), g);

        return map.values().stream().map(g -> toDto(g, email)).toList();
    }

    /** Carregar 1 grupo (usado na edicao) */
    public GroupResponse getOne(String email, Long id) {
        Group g = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo nao encontrado"));

        if (!g.getOwnerEmail().equalsIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Sem permissao");
        }
        return toDto(g, email);
    }

    /** Atualizar grupo (apenas dono) */
    public GroupResponse update(String email, Long id, CreateGroupRequest req) {
        Group g = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo nao encontrado"));

        if (!g.getOwnerEmail().equalsIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Sem permissao");
        }

        // aplica alteracoes (simples)
        g.setName(req.getName() == null ? g.getName() : req.getName().trim());
        g.setDescription(req.getDescription()); // null valido se quiser limpar

        g = repo.save(g);
        return toDto(g, email);
    }

    /** Excluir grupo (apenas dono) */
    public void delete(String email, Long id) {
        Group g = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo nao encontrado"));

        if (!g.getOwnerEmail().equalsIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Somente o dono pode excluir");
        }
        repo.delete(g);
    }

    /** Sair (no minimo atual nao ha membros; no-op) */
    public void leave(String email, Long id) {
        // no-op nesta versao
    }

    /** Listar membros do grupo (owner ou membro podem ver) */
    public List<GroupMemberResponse> listMembers(String requesterEmail, Long groupId) {
        Group g = repo.findById(groupId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo nao encontrado"));
        boolean allowed = g.getOwnerEmail().equalsIgnoreCase(requesterEmail)
                || memberRepo.existsByGroupIdAndMemberEmail(groupId, requesterEmail);
        if (!allowed) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Sem permissao");
        }

        ArrayList<GroupMemberResponse> out = new ArrayList<>();

        // dono do grupo primeiro
        {
            String email = g.getOwnerEmail();
            var user = usuarioRepository.findByEmail(email);
            String name = user
                    .map(u -> (u.getPrimeiroNome() + " " + u.getUltimoNome()).trim())
                    .orElse(email);
            out.add(GroupMemberResponse.builder()
                    .id(user.get().getId())
                    .email(email)
                    .name(name)
                    .role("OWNER")
                    .build());
        }

        // demais membros
        for (var m : memberRepo.findByGroupId(groupId)) {
            if (m.getMemberEmail().equalsIgnoreCase(g.getOwnerEmail())) continue;
            String email = m.getMemberEmail();
            var usr = usuarioRepository.findByEmail(email);
            String name = usr
                    .map(u -> (u.getPrimeiroNome() + " " + u.getUltimoNome()).trim())
                    .orElse(email);
            out.add(GroupMemberResponse.builder()
                    .id(usr.get().getId())
                    .email(email)
                    .name(name)
                    .role(m.getRole() == null ? "MEMBER" : m.getRole())
                    .build());
        }

        return out;
    }

    /** Define papel do membro (MEMBER/ADMIN) - somente dono */
    public void setMemberRole(String requesterEmail, Long groupId, String memberEmail, String role) {
        Group g = repo.findById(groupId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo nao encontrado"));
        if (!g.getOwnerEmail().equalsIgnoreCase(requesterEmail)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Somente o dono pode alterar papeis");
        }
        if (g.getOwnerEmail().equalsIgnoreCase(memberEmail)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nao e possivel alterar o papel do dono");
        }
        var gm = memberRepo.findByGroupIdAndMemberEmail(groupId, memberEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Membro nao encontrado"));
        gm.setRole("ADMIN".equalsIgnoreCase(role) ? "ADMIN" : "MEMBER");
        memberRepo.save(gm);
    }

    /** Remove um membro do grupo - somente dono */
    @Transactional
    public void removeMember(String requesterEmail, Long groupId, String memberEmail) {
        Group g = repo.findById(groupId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo nao encontrado"));
        if (!g.getOwnerEmail().equalsIgnoreCase(requesterEmail)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Somente o dono pode remover membros");
        }
        if (g.getOwnerEmail().equalsIgnoreCase(memberEmail)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nao e possivel remover o dono");
        }
        memberRepo.deleteByGroupIdAndMemberEmail(groupId, memberEmail);
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
