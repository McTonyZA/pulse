package in.horizonos.pulseserver.util;

import io.vertx.core.Vertx;

import java.util.concurrent.atomic.AtomicBoolean;

import static in.horizonos.pulseserver.constant.Constants.*;

public class MaintenanceUtil {
    public static void setShutdownStatus(Vertx vertx) {
        AtomicBoolean shutdown =
                VertxUtil.getOrCreateSharedData(vertx, SHUTDOWN_STATUS, () -> new AtomicBoolean(true));
        shutdown.set(true);
    }

    public static AtomicBoolean getShutdownStatus(Vertx vertx) {
        return VertxUtil.getOrCreateSharedData(vertx, SHUTDOWN_STATUS, () -> new AtomicBoolean(false));
    }
}
