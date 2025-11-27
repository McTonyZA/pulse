package in.horizonos.pulseserver.module;

import in.horizonos.pulseserver.service.interaction.ClickhouseMetricService;
import in.horizonos.pulseserver.service.interaction.PerformanceMetricService;
import in.horizonos.pulseserver.service.interaction.InteractionService;
import in.horizonos.pulseserver.service.interaction.impl.InteractionServiceImpl;
import com.google.inject.AbstractModule;
import com.google.inject.Singleton;

public class InteractionModule extends AbstractModule {

  @Override
  protected void configure() {
    bind(InteractionService.class).to(
        InteractionServiceImpl.class);
    bind(PerformanceMetricService.class).to(ClickhouseMetricService.class)
            .in(Singleton.class);
  }
}
