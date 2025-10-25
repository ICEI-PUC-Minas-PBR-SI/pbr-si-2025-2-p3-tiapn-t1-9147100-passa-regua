package com.passaregua.app.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "friendships", indexes = {
        @Index(name = "idx_friendships_owner", columnList = "owner_email"),
        @Index(name = "idx_friendships_friend", columnList = "friend_email")
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Friendship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "owner_email", nullable = false, length = 150)
    private String ownerEmail;

    @Column(name = "friend_email", nullable = false, length = 150)
    private String friendEmail;
}

