package org.dreamhorizon.pulseserver.resources.v1.auth;

import org.dreamhorizon.pulseserver.dto.request.GetAccessTokenFromRefreshTokenRequestDto;
import org.dreamhorizon.pulseserver.resources.v1.auth.models.GetAccessTokenFromRefreshTokenResponseDto;
import org.dreamhorizon.pulseserver.resources.v1.auth.models.VerifyAuthTokenResponseDto;
import org.dreamhorizon.pulseserver.resources.v1.auth.models.AuthenticateRequestDto;
import org.dreamhorizon.pulseserver.error.ServiceError;
import org.dreamhorizon.pulseserver.resources.v1.auth.models.AuthenticateResponseDto;
import org.dreamhorizon.pulseserver.rest.io.Response;
import org.dreamhorizon.pulseserver.rest.io.RestResponse;
import org.dreamhorizon.pulseserver.service.AuthService;
import com.google.inject.Inject;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.concurrent.CompletionStage;

@Slf4j
@RequiredArgsConstructor(onConstructor = @__({@Inject}))
@Path("/v1/auth")
public class Authenticate {
    final AuthService authService;

    @POST
    @Path("/social/authenticate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public CompletionStage<Response<AuthenticateResponseDto>> getAccessAndRefreshTokens(
            @RequestBody(description = "Request body to authenticate user")
            @Valid
            AuthenticateRequestDto authenticateRequestDto) {
        try {
            return authService
                    .verifyGoogleIdToken(authenticateRequestDto.identifier)
                    .to(RestResponse.jaxrsRestHandler());
        } catch (Exception e) {
            throw ServiceError.SERVICE_UNKNOWN_EXCEPTION.getException();
        }
    }

    @GET
    @Path("/token/verify")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public CompletionStage<Response<VerifyAuthTokenResponseDto>> verifyAuthToken(
            @NotNull @HeaderParam("authorization") String authorization) {
        try {
            return authService.verifyAuthToken(authorization).to(RestResponse.jaxrsRestHandler());
        } catch (Exception e) {
            throw ServiceError.SERVICE_UNKNOWN_EXCEPTION.getException();
        }
    }

    @POST
    @Path("/token/refresh")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public CompletionStage<Response<GetAccessTokenFromRefreshTokenResponseDto>>
    getAccessTokenFromRefreshToken(
            @RequestBody(
                    description =
                            "Request body to get access token using refresh token from guardian service")
            @Valid
            GetAccessTokenFromRefreshTokenRequestDto getAccessTokenFromRefreshTokenRequestDto) {
        return authService
                .getAccessTokenFromRefreshToken(getAccessTokenFromRefreshTokenRequestDto)
                .to(RestResponse.jaxrsRestHandler());
    }
}
