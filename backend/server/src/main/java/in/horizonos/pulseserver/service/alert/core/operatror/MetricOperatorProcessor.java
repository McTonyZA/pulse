package in.horizonos.pulseserver.service.alert.core.operatror;

public interface MetricOperatorProcessor {
  boolean isFiring(Float threshold, Float actualValue);
}
