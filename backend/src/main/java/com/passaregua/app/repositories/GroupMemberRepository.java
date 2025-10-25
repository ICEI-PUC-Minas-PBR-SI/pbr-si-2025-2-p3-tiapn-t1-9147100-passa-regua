package com.passaregua.app.repositories;

import com.passaregua.app.models.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {
    List<GroupMember> findByGroupId(Long groupId);
    boolean existsByGroupIdAndMemberEmail(Long groupId, String memberEmail);
    List<GroupMember> findByMemberEmail(String memberEmail);
    java.util.Optional<GroupMember> findByGroupIdAndMemberEmail(Long groupId, String memberEmail);
    void deleteByGroupIdAndMemberEmail(Long groupId, String memberEmail);
}
