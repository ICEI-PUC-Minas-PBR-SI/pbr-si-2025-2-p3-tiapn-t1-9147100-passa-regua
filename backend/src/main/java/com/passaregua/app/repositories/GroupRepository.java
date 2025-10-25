package com.passaregua.app.repositories;

import com.passaregua.app.models.Group;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupRepository extends JpaRepository<Group, Long> {
    List<Group> findByOwnerEmailOrderByCreatedAtDesc(String ownerEmail);
}
