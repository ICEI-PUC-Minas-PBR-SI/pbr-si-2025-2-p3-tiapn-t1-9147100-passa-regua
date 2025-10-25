package com.passaregua.app.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "notifications", indexes = {
        @Index(name = "idx_notifications_user", columnList = "user_email, created_at")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_email", nullable = false, length = 150)
    private String userEmail;

    @Column(name = "type", length = 60)
    private String type; // e.g., GROUP_INVITE, MEMBER_REMOVED, ADMIN_PROMOTED

    @Column(name = "title", length = 200)
    private String title;

    @Column(name = "message", length = 1000)
    private String message;

    @Column(name = "invite_token", length = 64)
    private String inviteToken; // for GROUP_INVITE action

    @Column(name = "group_id")
    private Long groupId;

    @Column(name = "group_name", length = 200)
    private String groupName;

    @Column(name = "actor_email", length = 150)
    private String actorEmail; // who generated

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "read_at")
    private Instant readAt;
}

