package in.horizonos.pulseserver.resources.session.models;

import java.util.List;
import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetSessionResponse {
    @JsonProperty("sessions")
    private List<Session> sessions;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Session {
        @JsonProperty("SessionId")
        private String sessionId;
        @JsonProperty("DeviceModel")
        private String device;
        @JsonProperty("UserId")
        private String userId;
        @JsonProperty("duration")
        private Long duration;
        @JsonProperty("hasAnr")
        private boolean hasAnr;
        @JsonProperty("hasCrash")
        private boolean hasCrash;
        @JsonProperty("hasNetwork")
        private boolean hasNetwork;
        @JsonProperty("hasFrozen")
        private boolean hasFrozen;
        @JsonProperty("Timestamp")
        private String timestamp;
    }
}
