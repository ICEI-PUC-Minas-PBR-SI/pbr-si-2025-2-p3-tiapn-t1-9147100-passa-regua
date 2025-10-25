package com.passaregua.app.services;

import com.passaregua.app.models.Group;
import com.passaregua.app.models.GroupMember;
import com.passaregua.app.models.Invite;
import com.passaregua.app.repositories.GroupMemberRepository;
import com.passaregua.app.repositories.GroupRepository;
import com.passaregua.app.repositories.InviteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InviteService {

    private final InviteRepository inviteRepository;
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final FriendService friendService;
    private final com.passaregua.app.repositories.NotificationRepository notificationRepository;

    public Map<String, String> createLink(String inviterEmail, Long groupId) {
        Group g = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo nao encontrado"));
        if (!g.getOwnerEmail().equalsIgnoreCase(inviterEmail)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas o dono pode convidar nesta versao");
        }
        String token = UUID.randomUUID().toString().replaceAll("-", "");
        Invite inv = Invite.builder()
                .token(token)
                .groupId(groupId)
                .inviterEmail(inviterEmail)
                .status("PENDING")
                .createdAt(Instant.now())
                .build();
        inviteRepository.save(inv);
        return Map.of("inviteId", token, "url", "/invite/" + token);
    }

    public void inviteUsers(String inviterEmail, Long groupId, List<String> userEmails) {
        Group g = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo nao encontrado"));
        if (!g.getOwnerEmail().equalsIgnoreCase(inviterEmail)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas o dono pode convidar nesta versao");
        }
        for (String email : userEmails) {
            String token = UUID.randomUUID().toString().replaceAll("-", "");
            Invite inv = Invite.builder()
                    .token(token)
                    .groupId(groupId)
                    .inviterEmail(inviterEmail)
                    .inviteeEmail(email)
                    .status("PENDING")
                    .createdAt(Instant.now())
                    .build();
            inviteRepository.save(inv);

            // create notification for invitee
            String title = "Convite para entrar no grupo";
            String message = "Voce foi convidado para entrar no grupo '" + g.getName() + "' por " + inviterEmail + ".";
            notificationRepository.save(com.passaregua.app.models.Notification.builder()
                    .userEmail(email)
                    .type("GROUP_INVITE")
                    .title(title)
                    .message(message)
                    .inviteToken(token)
                    .groupId(g.getId())
                    .groupName(g.getName())
                    .actorEmail(inviterEmail)
                    .createdAt(Instant.now())
                    .build());
        }
    }

    public Map<String, Object> getInviteInfo(String token) {
        Invite inv = inviteRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Convite nao encontrado"));
        Group g = groupRepository.findById(inv.getGroupId())
                .orElse(null);
        return Map.of(
                "inviteId", token,
                "groupId", inv.getGroupId(),
                "groupName", g != null ? g.getName() : "Grupo",
                "inviterEmail", inv.getInviterEmail()
        );
    }

    public void accept(String currentEmail, String token) {
        Invite inv = inviteRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Convite nao encontrado"));
        if (!"PENDING".equalsIgnoreCase(inv.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Convite nao esta pendente");
        }
        inv.setStatus("ACCEPTED");
        inv.setAcceptedAt(Instant.now());
        inviteRepository.save(inv);

        Group g = groupRepository.findById(inv.getGroupId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo nao encontrado"));

        // amizade em ambos os sentidos
        friendService.addFriendshipBothSides(inv.getInviterEmail(), currentEmail);

        // adiciona no grupo se ainda nao membro
        if (!groupMemberRepository.existsByGroupIdAndMemberEmail(g.getId(), currentEmail)) {
            groupMemberRepository.save(GroupMember.builder()
                    .groupId(g.getId())
                    .memberEmail(currentEmail)
                    .role("MEMBER")
                    .build());
        }

        // notifica o convidador que o usuario entrou no grupo
        String title = "Novo membro no seu grupo";
        String message = currentEmail + " entrou no grupo '" + g.getName() + "'.";
        notificationRepository.save(com.passaregua.app.models.Notification.builder()
                .userEmail(inv.getInviterEmail())
                .type("GROUP_MEMBER_JOINED")
                .title(title)
                .message(message)
                .inviteToken(token)
                .groupId(g.getId())
                .groupName(g.getName())
                .actorEmail(currentEmail)
                .createdAt(Instant.now())
                .build());
    }

    public void decline(String currentEmail, String token) {
        Invite inv = inviteRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Convite nao encontrado"));
        if (!"PENDING".equalsIgnoreCase(inv.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Convite nao esta pendente");
        }
        inv.setStatus("DECLINED");
        inviteRepository.save(inv);
    }
}
