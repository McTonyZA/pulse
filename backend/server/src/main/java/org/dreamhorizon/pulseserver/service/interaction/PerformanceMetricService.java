package org.dreamhorizon.pulseserver.service.interaction;

import org.dreamhorizon.pulseserver.resources.performance.models.PerformanceMetricDistributionRes;
import org.dreamhorizon.pulseserver.resources.performance.models.QueryRequest;
import io.reactivex.rxjava3.core.Single;

public interface PerformanceMetricService {
    Single<PerformanceMetricDistributionRes> getMetricDistribution(QueryRequest request);
}
