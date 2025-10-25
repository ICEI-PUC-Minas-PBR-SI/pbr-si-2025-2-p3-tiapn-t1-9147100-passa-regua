package com.passaregua.app.dtos.group;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GroupResponse {
    private Long id;
    private String name;
    private String description;
    private boolean owner; // sempre true neste mínimo
}
