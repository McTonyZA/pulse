package in.horizonos.pulseserver.service.alert.core.operatror;

public class LessThanMetricOperatorProcessor implements MetricOperatorProcessor {
  @Override
  public boolean isFiring(Float threshold, Float actualValue) {
    return actualValue < threshold;
  }
}
