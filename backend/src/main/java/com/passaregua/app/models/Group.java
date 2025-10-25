package com.passaregua.app.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "groups")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private String ownerEmail;

    @Builder.Default
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    // Optional cover image stored in DB
    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "cover_image")
    private byte[] coverImage;

    @Column(name = "cover_content_type")
    private String coverContentType;

    @Column(name = "cover_updated_at")
    private Instant coverUpdatedAt;
}
