package org.dreamhorizon.pulseserver.resources.interaction.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TelemetryFilterOptionsResponse {
    List<String> appVersionCodes;
    List<String> deviceModels;
    List<String> networkProviders;
    List<String> platforms;
    List<String> osVersions;
    List<String> states;
}
