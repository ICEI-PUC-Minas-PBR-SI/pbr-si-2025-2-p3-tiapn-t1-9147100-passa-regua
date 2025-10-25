package com.passaregua.app.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "invites", indexes = {
        @Index(name = "idx_invites_token", columnList = "token", unique = true),
        @Index(name = "idx_invites_group", columnList = "group_id")
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Invite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "token", nullable = false, unique = true, length = 64)
    private String token;

    @Column(name = "group_id", nullable = false)
    private Long groupId;

    @Column(name = "inviter_email", nullable = false, length = 150)
    private String inviterEmail;

    @Column(name = "invitee_email", length = 150)
    private String inviteeEmail; // opcional (pode ser nulo para link aberto)

    @Column(name = "status", length = 20)
    private String status; // PENDING, ACCEPTED, DECLINED

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "accepted_at")
    private Instant acceptedAt;
}

