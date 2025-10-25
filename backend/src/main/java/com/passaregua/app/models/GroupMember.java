package com.passaregua.app.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "group_members", indexes = {
        @Index(name = "idx_group_members_group", columnList = "group_id"),
        @Index(name = "idx_group_members_email", columnList = "member_email")
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class GroupMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "group_id", nullable = false)
    private Long groupId;

    @Column(name = "member_email", nullable = false, length = 150)
    private String memberEmail;

    @Column(name = "role", length = 30)
    private String role; // OWNER, MEMBER (simples)
}

