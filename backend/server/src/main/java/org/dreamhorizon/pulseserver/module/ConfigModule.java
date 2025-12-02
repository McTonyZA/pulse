package org.dreamhorizon.pulseserver.module;

import org.dreamhorizon.pulseserver.config.ApplicationConfig;
import org.dreamhorizon.pulseserver.config.ClickhouseConfig;
import org.dreamhorizon.pulseserver.vertx.SharedDataUtils;
import com.google.inject.AbstractModule;
import io.vertx.core.Vertx;

public class ConfigModule extends AbstractModule {

    private final Vertx vertx;

    public ConfigModule(Vertx vertx) {
        this.vertx = vertx;
    }

    @Override
    protected void configure() {
        bind(ApplicationConfig.class).toProvider(() -> SharedDataUtils.get(vertx, ApplicationConfig.class));
        bind(ClickhouseConfig.class).toProvider(() -> SharedDataUtils.get(vertx, ClickhouseConfig.class));
    }
}
