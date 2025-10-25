package com.passaregua.app.repositories;

import com.passaregua.app.models.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    List<Friendship> findByOwnerEmail(String ownerEmail);
    boolean existsByOwnerEmailAndFriendEmail(String ownerEmail, String friendEmail);
    void deleteByOwnerEmailAndFriendEmail(String ownerEmail, String friendEmail);
}
