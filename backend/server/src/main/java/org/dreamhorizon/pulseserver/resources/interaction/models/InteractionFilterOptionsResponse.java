package org.dreamhorizon.pulseserver.resources.interaction.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InteractionFilterOptionsResponse {
    private List<String> statuses;
    private List<String> createdBy;
}
