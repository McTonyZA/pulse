package in.horizonos.pulseserver.resources.alert.v1;

import in.horizonos.pulseserver.service.alert.core.AlertService;
import in.horizonos.pulseserver.rest.io.Response;
import in.horizonos.pulseserver.rest.io.RestResponse;
import com.google.inject.Inject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.concurrent.CompletionStage;

@Slf4j
@RequiredArgsConstructor(onConstructor = @__({@Inject}))
@Path("/v1/alert/{id}")
public class DeleteAlert {
    final AlertService alertsService;

    @DELETE
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public CompletionStage<Response<Boolean>> deleteAlert(@NotNull @PathParam("id") Integer alertId) {
        return alertsService.deleteAlert(alertId)
                .to(RestResponse.jaxrsRestHandler());
    }
}
