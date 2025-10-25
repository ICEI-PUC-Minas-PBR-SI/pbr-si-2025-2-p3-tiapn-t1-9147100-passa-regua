package com.passaregua.app.dtos.group;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupMemberResponse {
    private String email;
    private String name;
    private String role; // OWNER, MEMBER, etc.
}

