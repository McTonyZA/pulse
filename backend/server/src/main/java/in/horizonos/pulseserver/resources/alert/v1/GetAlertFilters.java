package in.horizonos.pulseserver.resources.alert.v1;

import in.horizonos.pulseserver.dto.response.alerts.AlertFiltersResponseDto;
import in.horizonos.pulseserver.service.alert.core.AlertService;
import in.horizonos.pulseserver.rest.io.Response;
import in.horizonos.pulseserver.rest.io.RestResponse;
import com.google.inject.Inject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.concurrent.CompletionStage;

@Slf4j
@RequiredArgsConstructor(onConstructor = @__({@Inject}))
@Path("/v1/alert/filters")
public class GetAlertFilters {
    final AlertService alertsService;

    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public CompletionStage<Response<AlertFiltersResponseDto>> getAlertsFilters() {
        return alertsService
                .getAlertFilters()
                .to(RestResponse.jaxrsRestHandler());
    }
}
