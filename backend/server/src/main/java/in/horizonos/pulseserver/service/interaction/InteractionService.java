package in.horizonos.pulseserver.service.interaction;

import in.horizonos.pulseserver.dto.response.EmptyResponse;
import in.horizonos.pulseserver.resources.interaction.models.InteractionFilterOptionsResponse;
import in.horizonos.pulseserver.resources.interaction.models.TelemetryFilterOptionsResponse;
import in.horizonos.pulseserver.service.interaction.models.CreateInteractionRequest;
import in.horizonos.pulseserver.service.interaction.models.DeleteInteractionRequest;
import in.horizonos.pulseserver.service.interaction.models.GetInteractionsRequest;
import in.horizonos.pulseserver.service.interaction.models.GetInteractionsResponse;
import in.horizonos.pulseserver.service.interaction.models.InteractionDetails;
import in.horizonos.pulseserver.service.interaction.models.UpdateInteractionRequest;
import io.reactivex.rxjava3.core.Single;
import java.util.List;
import jakarta.validation.Valid;

public interface InteractionService {
    Single<InteractionDetails> createInteraction(@Valid CreateInteractionRequest createInteractionRequest);

    Single<EmptyResponse> updateInteraction(@Valid UpdateInteractionRequest updateInteractionRequest);

    Single<InteractionDetails> getInteractionDetails(String interactionName);

    Single<GetInteractionsResponse> getInteractions(GetInteractionsRequest getInteractionsRequest);

    Single<EmptyResponse> deleteInteraction(DeleteInteractionRequest deleteInteractionRequest);

    Single<List<InteractionDetails>> getAllActiveAndRunningInteractions();

    Single<InteractionFilterOptionsResponse> getInteractionFilterOptions();

    Single<TelemetryFilterOptionsResponse> getTelemetryFilterOptions();
}